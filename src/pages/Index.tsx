import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeUpload from "@/components/ResumeUpload";
import CareerPrediction from "@/components/CareerPrediction";
import SkillAnalysis from "@/components/SkillAnalysis";
import ExplainableAI from "@/components/ExplainableAI";
import CareerRoadmap from "@/components/CareerRoadmap";
import Footer from "@/components/Footer";
import { useResumeAnalysis, AnalysisResult } from "@/hooks/useResumeAnalysis";

const Index = () => {
  const { analyzeResume, isAnalyzing, result, reset } = useResumeAnalysis();

  const handleAnalyze = async (resumeText: string) => {
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

  const handleReset = () => {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ResumeUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      
      {result && (
        <div className="animate-fade-in">
          <CareerPrediction data={result} />
          <SkillAnalysis data={result} />
          <ExplainableAI data={result} />
          <CareerRoadmap data={result} />
          
          {/* Reset button */}
          <div className="container px-4 pb-12">
            <div className="max-w-5xl mx-auto text-center">
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
