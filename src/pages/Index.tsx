import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeUpload from "@/components/ResumeUpload";
import CareerPrediction from "@/components/CareerPrediction";
import SkillAnalysis from "@/components/SkillAnalysis";
import ExplainableAI from "@/components/ExplainableAI";
import CareerRoadmap from "@/components/CareerRoadmap";
import AnalysisHistory from "@/components/AnalysisHistory";
import Footer from "@/components/Footer";
import PDFExport from "@/components/PDFExport";
import { useResumeAnalysis, AnalysisResult } from "@/hooks/useResumeAnalysis";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Save, History } from "lucide-react";

const Index = () => {
  const { analyzeResume, isAnalyzing, result, reset, lastResumeText, setResultFromHistory } = useResumeAnalysis();
  const { saveAnalysis, refreshHistory, history } = useAnalysisHistory();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Reset saved state when result changes
  useEffect(() => {
    setIsSaved(false);
  }, [result]);

  const handleAnalyze = async (resumeText: string) => {
    setShowHistory(false);
    const analysisResult = await analyzeResume(resumeText);
    if (analysisResult) {
      setTimeout(() => {
        const element = document.getElementById("prediction");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleSaveAnalysis = async () => {
    if (result && lastResumeText) {
      const saved = await saveAnalysis(lastResumeText, result);
      if (saved) {
        setIsSaved(true);
      }
    }
  };

  const handleLoadFromHistory = (analysisResult: AnalysisResult) => {
    setResultFromHistory(analysisResult);
    setIsSaved(true); // Already saved since it's from history
    setShowHistory(false);
    setTimeout(() => {
      const element = document.getElementById("prediction");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleReset = () => {
    reset();
    setIsSaved(false);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      refreshHistory();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ResumeUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      
      {/* History toggle button for logged-in users */}
      {user && !result && (
        <div className="container px-4 py-6">
          <div className="max-w-5xl mx-auto">
            <Button
              onClick={toggleHistory}
              variant={showHistory ? "default" : "outline"}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              {showHistory ? "Hide History" : `View History ${history.length > 0 ? `(${history.length})` : ""}`}
            </Button>
          </div>
        </div>
      )}
      
      {/* Show history when toggled */}
      {user && !result && showHistory && (
        <AnalysisHistory onLoadAnalysis={handleLoadFromHistory} />
      )}
      
      {result && (
        <div className="animate-fade-in">
          <CareerPrediction data={result} />
          <SkillAnalysis data={result} />
          <ExplainableAI data={result} />
          <CareerRoadmap data={result} />
          
          {/* Action buttons */}
          <div className="container px-4 pb-12">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
              {/* PDF Export button */}
              <PDFExport data={result} />
              
              {user && !isSaved && lastResumeText && (
                <Button
                  onClick={handleSaveAnalysis}
                  variant="default"
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save to History
                </Button>
              )}
              {user && isSaved && (
                <span className="px-4 py-2 text-sm text-primary bg-primary/10 rounded-xl">
                  ✓ Saved to History
                </span>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
