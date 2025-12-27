import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeUpload from "@/components/ResumeUpload";
import CareerPrediction from "@/components/CareerPrediction";
import SkillAnalysis from "@/components/SkillAnalysis";
import ExplainableAI from "@/components/ExplainableAI";
import CareerRoadmap from "@/components/CareerRoadmap";
import AnalysisHistory from "@/components/AnalysisHistory";
import ResumeComparison from "@/components/ResumeComparison";
import JobRecommendations from "@/components/JobRecommendations";
import ATSScore from "@/components/ATSScore";
import Footer from "@/components/Footer";

import SocialShare from "@/components/SocialShare";
import { FullAnalysisSkeleton } from "@/components/LoadingSkeleton";
import { useResumeAnalysis, AnalysisResult } from "@/hooks/useResumeAnalysis";
import { useAnalysisHistory, AnalysisHistoryItem } from "@/hooks/useAnalysisHistory";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Save, History, GitCompare } from "lucide-react";

const Index = () => {
  const { analyzeResume, isAnalyzing, result, reset, lastResumeText, setResultFromHistory } = useResumeAnalysis();
  const { saveAnalysis, refreshHistory, history } = useAnalysisHistory();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [compareWith, setCompareWith] = useState<AnalysisHistoryItem | null>(null);

  useEffect(() => {
    setIsSaved(false);
    setCompareWith(null);
  }, [result]);

  const handleAnalyze = async (resumeText: string) => {
    setShowHistory(false);
    const analysisResult = await analyzeResume(resumeText);
    if (analysisResult) {
      setTimeout(() => {
        document.getElementById("prediction")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleSaveAnalysis = async () => {
    if (result && lastResumeText) {
      const saved = await saveAnalysis(lastResumeText, result);
      if (saved) {
        setIsSaved(true);
        refreshHistory();
      }
    }
  };

  const handleLoadFromHistory = (analysisResult: AnalysisResult) => {
    setResultFromHistory(analysisResult);
    setIsSaved(true);
    setShowHistory(false);
    setTimeout(() => {
      document.getElementById("prediction")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCompare = () => {
    if (history.length > 0 && result) {
      // Find a different analysis to compare with
      const previousAnalysis = history.find(h => {
        const historyResult = h.analysis_result as AnalysisResult;
        return historyResult.readinessScore !== result.readinessScore || 
               historyResult.skills?.length !== result.skills?.length;
      }) || history[0];
      setCompareWith(previousAnalysis);
    }
  };

  const handleReset = () => {
    reset();
    setIsSaved(false);
    setShowHistory(false);
    setCompareWith(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) refreshHistory();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <div id="resume-upload-section">
        <ResumeUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>
      
      <section id="features-section" className="container px-4 py-16" aria-labelledby="how-it-works">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 id="how-it-works" className="font-display text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your resume and get AI-powered career insights with explainable predictions
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" role="list">
          {[
            { emoji: "📄", title: "1. Upload Resume", desc: "Upload your PDF resume and our AI will extract key information" },
            { emoji: "🧠", title: "2. AI Analysis", desc: "ML algorithms analyze your skills, experience, and career potential" },
            { emoji: "🎯", title: "3. Get Insights", desc: "Receive career predictions, skill gaps, and a personalized roadmap" }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl text-center" role="listitem">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
              </div>
              <h3 className="font-display font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {user && !result && (
        <div className="container px-4 py-6">
          <div className="max-w-5xl mx-auto">
            <Button onClick={toggleHistory} variant={showHistory ? "default" : "outline"} className="gap-2">
              <History className="w-4 h-4" aria-hidden="true" />
              {showHistory ? "Hide History" : `View History ${history.length > 0 ? `(${history.length})` : ""}`}
            </Button>
          </div>
        </div>
      )}
      
      {user && !result && showHistory && <AnalysisHistory onLoadAnalysis={handleLoadFromHistory} />}
      
      {isAnalyzing && <FullAnalysisSkeleton />}
      
      {result && !isAnalyzing && (
        <div className="animate-fade-in">
          <CareerPrediction data={result} />
          <ATSScore data={result} />
          <JobRecommendations data={result} />
          <SkillAnalysis data={result} />
          <ExplainableAI data={result} />
          <CareerRoadmap data={result} />
          
          {compareWith && <ResumeComparison current={result} previous={compareWith} />}
          
          <div className="container px-4 pb-12">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
              
              <SocialShare 
                score={result.readinessScore} 
                topCareer={result.careerPredictions?.[0]?.domain} 
              />
              {user && !isSaved && lastResumeText && (
                <Button onClick={handleSaveAnalysis} variant="default" className="gap-2">
                  <Save className="w-4 h-4" aria-hidden="true" />
                  Save to History
                </Button>
              )}
              {user && isSaved && (
                <span className="px-4 py-2 text-sm text-primary bg-primary/10 rounded-xl">✓ Saved</span>
              )}
              {user && history.length > 0 && !compareWith && (
                <Button onClick={handleCompare} variant="outline" className="gap-2">
                  <GitCompare className="w-4 h-4" aria-hidden="true" />
                  Compare with Previous
                </Button>
              )}
              <Button onClick={handleReset} variant="outline">Analyze Another Resume</Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;