import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface ResumeUploadProps {
  onAnalyze: () => void;
}

const ResumeUpload = ({ onAnalyze }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyze();
    }, 2500);
  };

  return (
    <section id="upload" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Upload Your <span className="text-gradient-primary">Resume</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI will analyze your skills, experience, and education to predict your ideal career path
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            className={`
              relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
              ${dragActive 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : file 
                  ? "border-primary/50 bg-card" 
                  : "border-border bg-card/50 hover:border-primary/30 hover:bg-card"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="animate-scale-in">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">{file.name}</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-secondary mx-auto mb-6 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag and drop your resume here
                </p>
                <p className="text-muted-foreground mb-6">
                  Supports PDF and DOCX files up to 10MB
                </p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileSelect}
                  />
                  <Button variant="glass" size="lg" asChild>
                    <span className="cursor-pointer">Browse Files</span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {/* Processing steps indicator */}
          {isAnalyzing && (
            <div className="mt-8 glass-card rounded-xl p-6 animate-fade-in">
              <div className="space-y-4">
                <ProcessStep step={1} label="Parsing resume structure" active />
                <ProcessStep step={2} label="Extracting skills & experience" />
                <ProcessStep step={3} label="Running ML prediction model" />
                <ProcessStep step={4} label="Generating explanations" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ProcessStep = ({ step, label, active = false }: { step: number; label: string; active?: boolean }) => (
  <div className={`flex items-center gap-4 ${active ? "opacity-100" : "opacity-40"}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${active ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
      {step}
    </div>
    <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    {active && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
  </div>
);

export default ResumeUpload;
