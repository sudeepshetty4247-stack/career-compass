import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  service: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: Record<string, unknown>;
  fix?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const results: HealthCheckResult[] = [];

  // 1. Check Edge Function itself
  results.push({
    service: 'Edge Function',
    status: 'ok',
    message: 'Edge function is running correctly',
    details: { runtime: 'Deno', timestamp: new Date().toISOString() }
  });

  // 2. Check Supabase Database
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      results.push({
        service: 'Database',
        status: 'error',
        message: 'Missing Supabase environment variables',
        fix: 'Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set'
      });
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      
      if (error) {
        results.push({
          service: 'Database',
          status: 'error',
          message: `Database query failed: ${error.message}`,
          fix: 'Check if the database is running and tables exist'
        });
      } else {
        results.push({
          service: 'Database',
          status: 'ok',
          message: 'Database connection successful',
          details: { tablesAccessible: true }
        });
      }
    }
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    results.push({
      service: 'Database',
      status: 'error',
      message: `Database check failed: ${errMessage}`,
      fix: 'Verify Supabase is running: supabase start'
    });
  }

  // 3. Check Ollama
  const ollamaHost = Deno.env.get('OLLAMA_HOST') || 'http://host.docker.internal:11434';
  const ollamaModel = Deno.env.get('OLLAMA_MODEL') || 'tinyllama';
  
  try {
    // First check if Ollama is reachable
    const tagsResponse = await fetch(`${ollamaHost}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!tagsResponse.ok) {
      results.push({
        service: 'Ollama',
        status: 'error',
        message: 'Ollama is not responding',
        details: { host: ollamaHost },
        fix: 'Start Ollama: ollama serve'
      });
    } else {
      const tagsData = await tagsResponse.json();
      const models = tagsData.models || [];
      const modelNames = models.map((m: { name: string }) => m.name);
      const hasConfiguredModel = modelNames.some((name: string) => name.includes(ollamaModel));
      
      if (!hasConfiguredModel) {
        results.push({
          service: 'Ollama',
          status: 'warning',
          message: `Ollama running but model "${ollamaModel}" not found`,
          details: { availableModels: modelNames, configuredModel: ollamaModel },
          fix: `Pull the model: ollama pull ${ollamaModel}`
        });
      } else {
        // Test a quick generation
        try {
          const testStart = Date.now();
          const testResponse = await fetch(`${ollamaHost}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: ollamaModel,
              prompt: 'Say OK',
              stream: false,
              options: { num_predict: 5 }
            }),
            signal: AbortSignal.timeout(30000)
          });
          
          const testTime = Date.now() - testStart;
          
          if (testResponse.ok) {
            results.push({
              service: 'Ollama',
              status: 'ok',
              message: `Ollama is ready with model "${ollamaModel}"`,
              details: { 
                host: ollamaHost, 
                model: ollamaModel, 
                responseTimeMs: testTime,
                availableModels: modelNames 
              }
            });
          } else {
            results.push({
              service: 'Ollama',
              status: 'warning',
              message: 'Ollama model test failed',
              details: { model: ollamaModel },
              fix: `Try warming up the model: ollama run ${ollamaModel} "Say OK"`
            });
          }
        } catch (genError) {
          results.push({
            service: 'Ollama',
            status: 'warning',
            message: `Model test timed out (>30s) - model may be slow`,
            details: { model: ollamaModel },
            fix: `Try a faster model like tinyllama: ollama pull tinyllama`
          });
        }
      }
    }
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    const isTimeout = error instanceof Error && (error.name === 'TimeoutError' || errMessage.includes('timeout'));
    results.push({
      service: 'Ollama',
      status: 'error',
      message: isTimeout ? 'Ollama connection timed out' : `Cannot connect to Ollama: ${errMessage}`,
      details: { host: ollamaHost },
      fix: 'Make sure Ollama is running: ollama serve'
    });
  }

  // 4. Check environment configuration
  const useLocalOllama = Deno.env.get('USE_LOCAL_OLLAMA') === 'true';
  const allowCloudFallback = Deno.env.get('ALLOW_CLOUD_FALLBACK') === 'true';
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  
  results.push({
    service: 'Configuration',
    status: 'ok',
    message: 'Environment configuration loaded',
    details: {
      useLocalOllama,
      allowCloudFallback,
      ollamaHost,
      ollamaModel,
      hasLovableApiKey: !!lovableApiKey,
      ollamaTimeoutMs: Deno.env.get('OLLAMA_TIMEOUT_MS') || '90000',
      ollamaNumPredict: Deno.env.get('OLLAMA_NUM_PREDICT') || '500'
    }
  });

  // Summary
  const hasErrors = results.some(r => r.status === 'error');
  const hasWarnings = results.some(r => r.status === 'warning');
  
  const summary = {
    overall: hasErrors ? 'error' : hasWarnings ? 'warning' : 'ok',
    timestamp: new Date().toISOString(),
    results
  };

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
