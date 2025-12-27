import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Server, 
  Cpu, 
  Settings,
  ArrowLeft,
  Copy,
  Terminal,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface HealthResult {
  service: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: Record<string, unknown>;
  fix?: string;
}

interface HealthResponse {
  overall: 'ok' | 'error' | 'warning';
  timestamp: string;
  results: HealthResult[];
}

const Setup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runHealthCheck = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: funcError } = await supabase.functions.invoke('health-check');
      
      if (funcError) {
        throw new Error(funcError.message);
      }
      
      setHealthData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to run health check';
      setError(message);
      toast.error('Health check failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>;
      default:
        return null;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Edge Function':
        return <Server className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'Ollama':
        return <Cpu className="w-5 h-5" />;
      case 'Configuration':
        return <Settings className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const setupSteps = [
    {
      step: 1,
      title: "Install Prerequisites",
      commands: [
        "# Install Docker Desktop",
        "# https://docker.com/products/docker-desktop",
        "",
        "# Install Supabase CLI",
        "npm install -g supabase",
        "",
        "# Install Ollama",
        "# https://ollama.ai/download"
      ]
    },
    {
      step: 2,
      title: "Start Ollama",
      commands: [
        "# Pull a fast model",
        "ollama pull tinyllama",
        "",
        "# Warm up the model",
        "ollama run tinyllama \"Say OK\"",
        "",
        "# Keep Ollama running",
        "ollama serve"
      ]
    },
    {
      step: 3,
      title: "Start Local Supabase",
      commands: [
        "# Start Docker Desktop first!",
        "",
        "# Start Supabase",
        "supabase start",
        "",
        "# Apply migrations",
        "supabase db push"
      ]
    },
    {
      step: 4,
      title: "Configure Environment",
      commands: [
        "# Create supabase/.env.local file:",
        "USE_LOCAL_OLLAMA=true",
        "OLLAMA_HOST=http://host.docker.internal:11434",
        "OLLAMA_MODEL=tinyllama",
        "OLLAMA_TIMEOUT_MS=120000",
        "OLLAMA_NUM_PREDICT=500"
      ]
    },
    {
      step: 5,
      title: "Start Edge Functions",
      commands: [
        "# In a new terminal",
        "supabase functions serve --env-file supabase/.env.local"
      ]
    },
    {
      step: 6,
      title: "Start Frontend",
      commands: [
        "npm run dev"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              System Diagnostics
            </h1>
            <p className="text-muted-foreground">
              Check the status of all services and get setup guidance
            </p>
          </div>

          {/* Health Status */}
          <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {healthData && getStatusIcon(healthData.overall)}
                  Service Status
                </CardTitle>
                <CardDescription>
                  {healthData?.timestamp 
                    ? `Last checked: ${new Date(healthData.timestamp).toLocaleTimeString()}`
                    : 'Running health check...'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runHealthCheck}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Health check failed</p>
                      <p className="text-sm text-muted-foreground mt-1">{error}</p>
                      <p className="text-sm mt-2">
                        Make sure edge functions are running: <code className="bg-muted px-1 rounded">supabase functions serve</code>
                      </p>
                    </div>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : healthData ? (
                <div className="space-y-4">
                  {healthData.results.map((result, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border border-border/50 bg-background/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getServiceIcon(result.service)}
                          <span className="font-medium">{result.service}</span>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.message}
                      </p>
                      
                      {result.details && (
                        <div className="text-xs bg-muted/50 rounded p-2 mb-2 font-mono overflow-x-auto">
                          {Object.entries(result.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground">{key}:</span>{' '}
                              <span className="text-foreground">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {result.fix && (
                        <div className="flex items-center gap-2 mt-2">
                          <Terminal className="w-4 h-4 text-primary" />
                          <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {result.fix}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(result.fix!)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Setup Guide */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Local Setup Guide</CardTitle>
              <CardDescription>
                Follow these steps to set up local AI resume analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {setupSteps.map((step) => (
                  <div key={step.step} className="relative pl-8">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                      {step.step}
                    </div>
                    
                    <h3 className="font-medium mb-2">{step.title}</h3>
                    
                    <div className="relative">
                      <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto font-mono">
                        {step.commands.join('\n')}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(step.commands.filter(c => !c.startsWith('#') && c.trim()).join('\n'))}
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button variant="hero" onClick={() => navigate('/')}>
              Start Analyzing Resumes
            </Button>
            <Button variant="outline" onClick={runHealthCheck} disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Re-run Diagnostics'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Setup;
