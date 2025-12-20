import { Rocket, BookOpen, Target, Trophy, ArrowRight } from "lucide-react";

const roadmapSteps = [
  {
    phase: "Short-Term",
    duration: "0-3 Months",
    icon: BookOpen,
    color: "from-cyan-400 to-cyan-600",
    goals: [
      "Complete Statistics fundamentals course",
      "Learn Power BI basics",
      "Build 2-3 data analysis projects",
      "Create GitHub portfolio",
    ],
  },
  {
    phase: "Mid-Term",
    duration: "3-6 Months",
    icon: Target,
    color: "from-violet-400 to-violet-600",
    goals: [
      "Advanced Excel & Power BI",
      "Learn basic Machine Learning",
      "Complete 1 real-world project",
      "Earn relevant certification",
    ],
  },
  {
    phase: "Long-Term",
    duration: "6-12 Months",
    icon: Trophy,
    color: "from-emerald-400 to-emerald-600",
    goals: [
      "Apply for Data Analyst roles",
      "Build domain expertise",
      "Contribute to open-source",
      "Target: Business Analyst / Data Analyst",
    ],
  },
];

const CareerRoadmap = () => {
  return (
    <section id="roadmap" className="py-24 relative bg-card/30">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Personalized Roadmap
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-gradient-primary">Career Path</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A customized learning roadmap to reach your career goals in Data Analytics
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20 hidden md:block" />

            <div className="space-y-8 md:space-y-0">
              {roadmapSteps.map((step, index) => (
                <div 
                  key={step.phase}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-16 animate-slide-up ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`glass-card rounded-2xl p-6 md:p-8 inline-block ${
                      index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                    }`}>
                      <div className={`flex items-center gap-3 mb-4 ${
                        index % 2 === 0 ? "md:justify-end" : ""
                      }`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                          <step.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className={index % 2 === 0 ? "md:order-first md:text-right" : ""}>
                          <h3 className="font-display text-xl font-bold">{step.phase}</h3>
                          <p className="text-sm text-muted-foreground">{step.duration}</p>
                        </div>
                      </div>

                      <ul className={`space-y-3 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                        {step.goals.map((goal, goalIndex) => (
                          <li 
                            key={goalIndex}
                            className={`flex items-center gap-2 text-muted-foreground ${
                              index % 2 === 0 ? "md:flex-row-reverse" : ""
                            }`}
                          >
                            <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 hidden md:flex">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} ring-4 ring-background`} />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="mt-16 glass-card rounded-3xl p-8 md:p-10 text-center">
            <h3 className="font-display text-2xl font-bold mb-4">
              🎯 Target Role: <span className="text-gradient-primary">Data Analyst</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Following this roadmap, you can be job-ready for entry-level Data Analyst positions 
              within 6-9 months. Focus on consistent learning and building a strong portfolio.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Python • SQL • Power BI
              </span>
              <span className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                Statistics • Data Visualization
              </span>
              <span className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                Problem Solving
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerRoadmap;
