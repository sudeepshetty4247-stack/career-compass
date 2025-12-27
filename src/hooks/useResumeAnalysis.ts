import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  name: string;
  category: 'technical' | 'soft';
  proficiency: number;
}

export interface CareerPrediction {
  domain: string;
  probability: number;
  description: string;
  topRoles: string[];
}

export interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  reason: string;
}

export interface ContributingFactor {
  factor: string;
  impact: 'positive' | 'negative';
  weight: number;
}

export interface RoadmapItem {
  goal: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  skills: Skill[];
  experience: {
    level: string;
    years: number;
    summary: string;
  };
  education: {
    degree: string;
    field: string;
    institution: string;
  };
  careerPredictions: CareerPrediction[];
  skillGaps: SkillGap[];
  readinessScore: number;
  explanation: {
    summary: string;
    strengths: string[];
    improvements: string[];
    topContributingFactors: ContributingFactor[];
  };
  roadmap: {
    shortTerm: RoadmapItem[];
    midTerm: RoadmapItem[];
    longTerm: RoadmapItem[];
  };
}

export const useResumeAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResumeText, setLastResumeText] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeResume = async (resumeText: string, retryCount = 0) => {
    const maxRetries = 1;
    setIsAnalyzing(true);
    setError(null);
    setLastResumeText(resumeText);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText }
      });

      if (fnError) {
        const details = (fnError as any)?.details ?? (fnError as any)?.context ?? null;
        const extra = details ? ` (${typeof details === 'string' ? details : JSON.stringify(details)})` : '';
        const errorMsg = fnError.message || 'Failed to analyze resume';
        
        // Check for timeout/connection errors and retry once
        const isTimeoutError = errorMsg.includes('status code') || 
                               errorMsg.includes('timeout') || 
                               errorMsg.includes('0)');
        
        if (isTimeoutError && retryCount < maxRetries) {
          console.log(`Retrying analysis (attempt ${retryCount + 2})...`);
          toast({
            title: "Retrying...",
            description: "The AI is taking longer than expected. Retrying once more.",
          });
          return analyzeResume(resumeText, retryCount + 1);
        }
        
        throw new Error(`${errorMsg}${extra}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      
      // Provide helpful error messages based on error type
      let description = message;
      if (message.includes('OLLAMA_TIMEOUT') || message.includes('too slow')) {
        description = "Local AI is too slow. Switch to 'tinyllama' model or enable cloud fallback.";
      } else if (message.includes('status code (0)') || message.includes('Failed to fetch')) {
        description = "Cannot connect to AI. Make sure Ollama is running: 'ollama serve'";
      } else if (message.includes('model') && message.includes('not found')) {
        description = "Model not found. Run: ollama pull tinyllama";
      }
      
      toast({
        title: "Analysis Failed",
        description,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setResultFromHistory = (analysisResult: AnalysisResult) => {
    setResult(analysisResult);
    setError(null);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLastResumeText(null);
  };

  return {
    analyzeResume,
    isAnalyzing,
    result,
    error,
    reset,
    lastResumeText,
    setResultFromHistory,
  };
};
