import { AnalysisResult } from "@/hooks/useResumeAnalysis";
import { AnalysisHistoryItem } from "@/hooks/useAnalysisHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, GitCompare, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ResumeComparisonProps {
  current: AnalysisResult;
  previous: AnalysisHistoryItem;
}

const ResumeComparison = ({ current, previous }: ResumeComparisonProps) => {
  const prevResult = previous.analysis_result as AnalysisResult;
  
  const scoreDiff = current.readinessScore - prevResult.readinessScore;
  const currentSkillCount = current.skills?.length || 0;
  const prevSkillCount = prevResult.skills?.length || 0;
  const skillDiff = currentSkillCount - prevSkillCount;
  
  const currentGapCount = current.skillGaps?.length || 0;
  const prevGapCount = prevResult.skillGaps?.length || 0;
  const gapDiff = prevGapCount - currentGapCount; // Positive is good (fewer gaps)

  // Find new skills
  const prevSkillNames = new Set(prevResult.skills?.map(s => s.name.toLowerCase()) || []);
  const newSkills = current.skills?.filter(s => !prevSkillNames.has(s.name.toLowerCase())) || [];

  // Find improved skills
  const improvedSkills = current.skills?.filter(skill => {
    const prevSkill = prevResult.skills?.find(ps => ps.name.toLowerCase() === skill.name.toLowerCase());
    return prevSkill && skill.proficiency > prevSkill.proficiency;
  }) || [];

  const DiffIndicator = ({ value, inverted = false }: { value: number; inverted?: boolean }) => {
    const isPositive = inverted ? value < 0 : value > 0;
    const isNegative = inverted ? value > 0 : value < 0;
    
    if (value === 0) {
      return (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Minus className="w-4 h-4" />
          No change
        </span>
      );
    }
    
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {value > 0 ? '+' : ''}{value}
      </span>
    );
  };

  return (
    <section className="container px-4 py-16" aria-labelledby="comparison-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <GitCompare className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">Resume Progress</span>
          </div>
          <h2 id="comparison-heading" className="font-display text-3xl md:text-4xl font-bold mb-4">
            Your <span className="text-gradient-primary">Improvement</span> Over Time
          </h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Compared with analysis from {format(new Date(previous.created_at), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Readiness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold font-display">{current.readinessScore}%</span>
                <DiffIndicator value={scoreDiff} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Previous: {prevResult.readinessScore}%
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold font-display">{currentSkillCount}</span>
                <DiffIndicator value={skillDiff} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Previous: {prevSkillCount}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Skill Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold font-display">{currentGapCount}</span>
                <DiffIndicator value={gapDiff} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Previous: {prevGapCount} gaps
              </div>
            </CardContent>
          </Card>
        </div>

        {(newSkills.length > 0 || improvedSkills.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {newSkills.length > 0 && (
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </span>
                    New Skills Added
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {newSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {improvedSkills.length > 0 && (
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </span>
                    Skills Improved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {improvedSkills.map((skill, i) => {
                      const prevSkill = prevResult.skills?.find(ps => ps.name.toLowerCase() === skill.name.toLowerCase());
                      const improvement = prevSkill ? skill.proficiency - prevSkill.proficiency : 0;
                      return (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                          {skill.name} (+{improvement}%)
                        </span>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeComparison;