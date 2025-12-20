import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ResumeUpload from "@/components/ResumeUpload";
import CareerPrediction from "@/components/CareerPrediction";
import SkillAnalysis from "@/components/SkillAnalysis";
import ExplainableAI from "@/components/ExplainableAI";
import CareerRoadmap from "@/components/CareerRoadmap";
import Footer from "@/components/Footer";

const Index = () => {
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setShowResults(true);
    // Scroll to prediction section
    setTimeout(() => {
      const element = document.getElementById("prediction");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ResumeUpload onAnalyze={handleAnalyze} />
      
      {showResults && (
        <div className="animate-fade-in">
          <CareerPrediction />
          <SkillAnalysis />
          <ExplainableAI />
          <CareerRoadmap />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
