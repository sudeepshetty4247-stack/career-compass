import { AnalysisResult } from "@/hooks/useResumeAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileSearch, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";

interface ATSScoreProps {
  data: AnalysisResult;
}

const ATSScore = ({ data }: ATSScoreProps) => {
  // Calculate ATS score based on resume analysis
  const calculateATSScore = () => {
    let score = 0;
    const checks: { label: string; passed: boolean; tip: string }[] = [];

    // Check 1: Has quantifiable skills (proficiency levels)
    const hasQuantifiableSkills = data.skills?.some(s => s.proficiency > 0);
    if (hasQuantifiableSkills) {
      score += 15;
      checks.push({ label: 'Quantifiable skills present', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Add quantifiable skills', passed: false, tip: 'Include specific technologies and rate your proficiency' });
    }

    // Check 2: Has technical skills
    const technicalSkills = data.skills?.filter(s => s.category === 'technical') || [];
    if (technicalSkills.length >= 3) {
      score += 15;
      checks.push({ label: 'Technical skills (3+)', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Add more technical skills', passed: false, tip: 'Include relevant technologies, tools, and programming languages' });
    }

    // Check 3: Has soft skills
    const softSkills = data.skills?.filter(s => s.category === 'soft') || [];
    if (softSkills.length >= 2) {
      score += 10;
      checks.push({ label: 'Soft skills included', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Add soft skills', passed: false, tip: 'Include communication, leadership, teamwork skills' });
    }

    // Check 4: Has education info
    if (data.education?.degree && data.education.degree !== 'Not specified') {
      score += 15;
      checks.push({ label: 'Education details present', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Add education details', passed: false, tip: 'Include your degree, field of study, and institution' });
    }

    // Check 5: Has experience summary
    if (data.experience?.summary && data.experience.summary.length > 20) {
      score += 15;
      checks.push({ label: 'Experience summary included', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Add experience summary', passed: false, tip: 'Include a brief summary of your work experience' });
    }

    // Check 6: Experience level clarity
    if (data.experience?.level && data.experience.level !== 'fresher') {
      score += 10;
      checks.push({ label: 'Clear experience level', passed: true, tip: '' });
    } else if (data.experience?.years > 0) {
      score += 10;
      checks.push({ label: 'Clear experience level', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Clarify experience level', passed: false, tip: 'Highlight years of experience and seniority level' });
    }

    // Check 7: Few skill gaps for target role
    const highPriorityGaps = data.skillGaps?.filter(g => g.importance === 'high') || [];
    if (highPriorityGaps.length <= 2) {
      score += 10;
      checks.push({ label: 'Well-aligned skill set', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Address skill gaps', passed: false, tip: 'Consider adding skills marked as high importance gaps' });
    }

    // Check 8: Good readiness score
    if (data.readinessScore >= 60) {
      score += 10;
      checks.push({ label: 'Strong career readiness', passed: true, tip: '' });
    } else {
      checks.push({ label: 'Improve career readiness', passed: false, tip: 'Work on the areas identified in the skill gaps section' });
    }

    return { score: Math.min(score, 100), checks };
  };

  const { score, checks } = calculateATSScore();

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const passedChecks = checks.filter(c => c.passed);
  const failedChecks = checks.filter(c => !c.passed);

  return (
    <section className="container px-4 py-16" aria-labelledby="ats-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <FileSearch className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">ATS Optimization</span>
          </div>
          <h2 id="ats-heading" className="font-display text-3xl md:text-4xl font-bold mb-4">
            Resume <span className="text-gradient-primary">ATS Score</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            How well your resume is optimized for Applicant Tracking Systems
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Score Card */}
          <Card className="glass-card border-border/50 md:col-span-1">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-secondary"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(score / 100) * 352} 352`}
                    className={getScoreColor()}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <span className={`text-4xl font-bold font-display ${getScoreColor()}`}>
                    {score}
                  </span>
                  <span className="text-muted-foreground text-lg">/100</span>
                </div>
              </div>
              <p className={`text-xl font-semibold ${getScoreColor()}`}>{getScoreLabel()}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {passedChecks.length} of {checks.length} checks passed
              </p>
            </CardContent>
          </Card>

          {/* Checks */}
          <Card className="glass-card border-border/50 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-display">ATS Compatibility Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checks.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    check.passed ? 'bg-emerald-500/5' : 'bg-amber-500/5'
                  }`}
                >
                  {check.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${check.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {check.label}
                    </p>
                    {check.tip && (
                      <p className="text-sm text-muted-foreground mt-1">{check.tip}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        {failedChecks.length > 0 && (
          <Card className="glass-card border-border/50 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <Lightbulb className="w-5 h-5 text-primary" />
                Quick Wins to Improve Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {failedChecks.slice(0, 3).map((check, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </span>
                    <span className="text-muted-foreground">{check.tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ATSScore;