import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, TrendingUp, Play } from "lucide-react";

interface HeroProps {
  onAnalyzeClick?: () => void;
  onDemoClick?: () => void;
}

const Hero = ({ onAnalyzeClick, onDemoClick }: HeroProps) => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('resume-upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
    onAnalyzeClick?.();
  };

  const handleDemoClick = () => {
    const statsSection = document.getElementById('features-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
    onDemoClick?.();
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
      aria-labelledby="hero-heading"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">
              ML-Powered Career Intelligence
            </span>
          </div>

          {/* Main heading */}
          <h1 
            id="hero-heading"
            className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up"
          >
            Discover Your{" "}
            <span className="text-gradient-primary">Perfect Career</span>
            {" "}Path
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            AI-powered resume analysis with explainable predictions. 
            Understand <span className="text-foreground font-medium">why</span> a career suits you, 
            not just <span className="text-foreground font-medium">what</span> is suggested.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              variant="hero" 
              size="xl" 
              onClick={scrollToUpload}
              aria-label="Analyze my resume - scroll to upload section"
            >
              Analyze My Resume
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
            <Button 
              variant="glass" 
              size="xl" 
              onClick={handleDemoClick}
              aria-label="See how CareerAI works"
            >
              <Play className="w-5 h-5" aria-hidden="true" />
              See How It Works
            </Button>
          </div>

          {/* Features - No fake stats */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" 
            style={{ animationDelay: '0.4s' }}
            role="list"
            aria-label="Key features"
          >
            <FeatureCard 
              icon={Brain}
              title="AI Analysis"
              description="Deep learning models extract skills, experience, and career potential from your resume"
              ariaLabel="AI-powered resume analysis"
            />
            <FeatureCard 
              icon={Sparkles}
              title="Explainable Results"
              description="Understand why certain careers are recommended with transparent AI reasoning"
              ariaLabel="Explainable AI predictions"
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Career Roadmap"
              description="Get personalized short, mid, and long-term goals to advance your career"
              ariaLabel="Personalized career roadmaps"
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
    </section>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title,
  description,
  ariaLabel 
}: { 
  icon: React.ElementType; 
  title: string;
  description: string;
  ariaLabel?: string;
}) => (
  <div 
    className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 text-left"
    role="listitem"
    aria-label={ariaLabel}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold font-display mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Hero;