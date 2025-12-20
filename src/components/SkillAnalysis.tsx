import { CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

const skills = [
  { name: "Python", level: 85, category: "strong", contribution: "+24%" },
  { name: "SQL", level: 78, category: "strong", contribution: "+18%" },
  { name: "Data Analysis", level: 72, category: "strong", contribution: "+15%" },
  { name: "Excel", level: 65, category: "moderate", contribution: "+8%" },
  { name: "Statistics", level: 35, category: "gap", contribution: "-5%" },
  { name: "Power BI", level: 20, category: "gap", contribution: "-3%" },
];

const SkillAnalysis = () => {
  const strongSkills = skills.filter(s => s.category === "strong");
  const gapSkills = skills.filter(s => s.category === "gap");

  return (
    <section id="skills" className="py-24 relative bg-card/30">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Skill <span className="text-gradient-primary">Analysis</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Detailed breakdown of your skills and their contribution to career predictions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Your Strengths</h3>
                  <p className="text-sm text-muted-foreground">Skills driving your prediction</p>
                </div>
              </div>

              <div className="space-y-5">
                {strongSkills.map((skill, index) => (
                  <div 
                    key={skill.name}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {skill.contribution}
                        </span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-success rounded-full progress-animate"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gaps */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Skill Gaps</h3>
                  <p className="text-sm text-muted-foreground">Areas to improve for career growth</p>
                </div>
              </div>

              <div className="space-y-5">
                {gapSkills.map((skill, index) => (
                  <div 
                    key={skill.name}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-accent">{skill.contribution}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-accent rounded-full progress-animate"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {skill.name === "Statistics" && "Essential for advanced data analysis roles"}
                      {skill.name === "Power BI" && "Popular visualization tool in industry"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  💡 <span className="text-foreground font-medium">Tip:</span> Focus on Statistics first - 
                  it provides the foundation for many data analytics concepts.
                </p>
              </div>
            </div>
          </div>

          {/* Readiness Score */}
          <div className="mt-8 glass-card rounded-3xl p-8 text-center">
            <h3 className="font-display text-xl font-bold mb-4">Career Readiness Score</h3>
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#readinessGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${63 * 3.52} 352`}
                  />
                  <defs>
                    <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(174 72% 56%)" />
                      <stop offset="100%" stopColor="hsl(166 72% 50%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold">63%</span>
                </div>
              </div>
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  Moderate Readiness
                </div>
                <p className="text-muted-foreground max-w-xs">
                  You're on the right track! Improve skill gaps to increase your readiness to 80%+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillAnalysis;
