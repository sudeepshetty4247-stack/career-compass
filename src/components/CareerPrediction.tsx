import { TrendingUp, Award, Target } from "lucide-react";

const predictions = [
  { domain: "Data Analytics", probability: 72, color: "from-cyan-400 to-cyan-600" },
  { domain: "Machine Learning", probability: 18, color: "from-violet-400 to-violet-600" },
  { domain: "Software Development", probability: 10, color: "from-emerald-400 to-emerald-600" },
];

const CareerPrediction = () => {
  return (
    <section id="prediction" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                AI Prediction Results
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-gradient-primary">Career Match</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on your skills, experience, and education, here's your career domain analysis
            </p>
          </div>

          {/* Main prediction card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 shadow-elevated animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side - Top prediction */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Award className="w-4 h-4" />
                  Best Match
                </div>
                <h3 className="font-display text-4xl md:text-5xl font-bold text-gradient-primary mb-4">
                  Data Analytics
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Your profile strongly aligns with data analytics roles. Your Python and SQL skills 
                  are highly valued in this domain.
                </p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-semibold">High Demand</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <span className="text-muted-foreground">Entry-Level Friendly</span>
                </div>
              </div>

              {/* Right side - Circular progress */}
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${72 * 5.02} 502`}
                    className="transition-all duration-1000 ease-out"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(174 72% 56%)" />
                      <stop offset="100%" stopColor="hsl(192 91% 47%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-5xl font-bold text-gradient-primary">72%</span>
                    <p className="text-sm text-muted-foreground">Match Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All predictions */}
          <div className="grid md:grid-cols-3 gap-4">
            {predictions.map((prediction, index) => (
              <div 
                key={prediction.domain}
                className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-semibold text-lg">{prediction.domain}</h4>
                  <span className="font-display font-bold text-2xl">{prediction.probability}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${prediction.color} rounded-full progress-animate`}
                    style={{ width: `${prediction.probability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPrediction;
