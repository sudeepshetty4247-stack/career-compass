import { Lightbulb, Code, GraduationCap, Briefcase, Zap } from "lucide-react";

const explanations = [
  {
    icon: Code,
    factor: "Technical Skills",
    impact: "High Positive",
    weight: "+42%",
    description: "Python and SQL skills are highly valued in Data Analytics. Your proficiency level suggests hands-on experience.",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    icon: GraduationCap,
    factor: "Education",
    impact: "Moderate Positive",
    weight: "+15%",
    description: "BCA provides strong computing fundamentals. Complements analytical roles well.",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    icon: Briefcase,
    factor: "Experience Level",
    impact: "Neutral",
    weight: "+5%",
    description: "Fresher status matches entry-level analytics positions. Room for growth as you gain experience.",
    color: "from-amber-400 to-amber-600",
  },
];

const ExplainableAI = () => {
  return (
    <section id="explainability" className="py-24 relative">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Explainable AI Engine
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">Why</span> This Career?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent AI that explains every decision. No black boxes – understand exactly what drives your career prediction.
            </p>
          </div>

          {/* Decision factors */}
          <div className="grid gap-6 mb-12">
            {explanations.map((item, index) => (
              <div 
                key={item.factor}
                className="glass-card rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-xl font-bold">{item.factor}</h3>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-3xl font-bold text-gradient-primary">
                      {item.weight}
                    </span>
                    <p className="text-sm text-muted-foreground">Contribution</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Confidence breakdown */}
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Confidence Breakdown</h3>
                <p className="text-sm text-muted-foreground">How certain is this prediction?</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl bg-secondary/50">
                <div className="font-display text-4xl font-bold text-gradient-primary mb-2">72%</div>
                <p className="text-sm text-muted-foreground">Model Confidence</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-secondary/50">
                <div className="font-display text-4xl font-bold mb-2">High</div>
                <p className="text-sm text-muted-foreground">Data Quality</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-secondary/50">
                <div className="font-display text-4xl font-bold mb-2">3/4</div>
                <p className="text-sm text-muted-foreground">Factors Aligned</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-primary">AI Explanation:</span> Your prediction is based on 
                a weighted analysis of {explanations.length} key factors. The model identified strong alignment 
                between your Python/SQL skills and Data Analytics requirements. While Machine Learning scored 
                lower due to limited ML-specific experience, you have a solid foundation to grow into that domain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainableAI;
