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
    message: 'Service running'
  });

  // 2. Check Supabase Database
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      results.push({
        service: 'Database',
        status: 'error',
        message: 'Configuration error'
      });
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('profiles').select('id').limit(1);
      
      if (error) {
        results.push({
          service: 'Database',
          status: 'error',
          message: 'Connection failed'
        });
      } else {
        results.push({
          service: 'Database',
          status: 'ok',
          message: 'Connected'
        });
      }
    }
  } catch (error) {
    results.push({
      service: 'Database',
      status: 'error',
      message: 'Service unavailable'
    });
  }

  // 3. Check AI Service (Ollama or Cloud)
  const ollamaHost = Deno.env.get('OLLAMA_HOST') || 'http://host.docker.internal:11434';
  
  try {
    const tagsResponse = await fetch(`${ollamaHost}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!tagsResponse.ok) {
      results.push({
        service: 'AI Service',
        status: 'error',
        message: 'Service unavailable'
      });
    } else {
      results.push({
        service: 'AI Service',
        status: 'ok',
        message: 'Ready'
      });
    }
  } catch (error) {
    results.push({
      service: 'AI Service',
      status: 'error',
      message: 'Service unavailable'
    });
  }

  // 4. Check configuration (minimal info)
  const hasRequiredConfig = !!Deno.env.get('SUPABASE_URL') && !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  results.push({
    service: 'Configuration',
    status: hasRequiredConfig ? 'ok' : 'error',
    message: hasRequiredConfig ? 'Valid' : 'Invalid'
  });

  // Summary - minimal information exposure
  const hasErrors = results.some(r => r.status === 'error');
  const hasWarnings = results.some(r => r.status === 'warning');
  
  const summary = {
    overall: hasErrors ? 'error' : hasWarnings ? 'warning' : 'ok',
    timestamp: new Date().toISOString(),
    results
  };

  return new Response(JSON.stringify(summary), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
