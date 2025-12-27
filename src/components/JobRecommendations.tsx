import { AnalysisResult } from "@/hooks/useResumeAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink, MapPin, Building2, TrendingUp } from "lucide-react";

interface JobRecommendationsProps {
  data: AnalysisResult;
}

const JobRecommendations = ({ data }: JobRecommendationsProps) => {
  const topPrediction = data.careerPredictions?.[0];
  
  if (!topPrediction) return null;

  // Generate job recommendations based on career predictions
  const generateJobRecommendations = () => {
    const recommendations = [];
    
    for (const prediction of data.careerPredictions.slice(0, 2)) {
      for (const role of prediction.topRoles.slice(0, 2)) {
        recommendations.push({
          title: role,
          domain: prediction.domain,
          match: prediction.probability,
          salaryRange: getSalaryRange(role),
          demandLevel: getDemandLevel(prediction.probability),
        });
      }
    }
    
    return recommendations.slice(0, 4);
  };

  const getSalaryRange = (role: string): string => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('senior') || roleLower.includes('lead') || roleLower.includes('manager')) {
      return '$120K - $180K';
    }
    if (roleLower.includes('junior') || roleLower.includes('associate') || roleLower.includes('entry')) {
      return '$50K - $80K';
    }
    return '$80K - $120K';
  };

  const getDemandLevel = (probability: number): 'High' | 'Medium' | 'Low' => {
    if (probability >= 40) return 'High';
    if (probability >= 25) return 'Medium';
    return 'Low';
  };

  const demandColors = {
    High: 'bg-emerald-500/10 text-emerald-600',
    Medium: 'bg-amber-500/10 text-amber-600',
    Low: 'bg-muted text-muted-foreground',
  };

  const jobs = generateJobRecommendations();

  const getJobSearchUrl = (title: string) => {
    const query = encodeURIComponent(title);
    return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
  };

  const getIndeedUrl = (title: string) => {
    const query = encodeURIComponent(title);
    return `https://www.indeed.com/jobs?q=${query}`;
  };

  return (
    <section className="container px-4 py-16" aria-labelledby="jobs-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Briefcase className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">Job Recommendations</span>
          </div>
          <h2 id="jobs-heading" className="font-display text-3xl md:text-4xl font-bold mb-4">
            Matching <span className="text-gradient-primary">Opportunities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your skills and career predictions, here are roles that match your profile
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <Card key={index} className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-display mb-1">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Building2 className="w-4 h-4" />
                      {job.domain}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${demandColors[job.demandLevel]}`}>
                    {job.demandLevel} Demand
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Profile Match</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{job.match}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Salary Range</span>
                    </div>
                    <span className="text-sm font-medium">{job.salaryRange}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => window.open(getJobSearchUrl(job.title), '_blank')}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => window.open(getIndeedUrl(job.title), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Indeed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobRecommendations;