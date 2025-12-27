import { Skeleton } from "@/components/ui/skeleton";

export const CareerPredictionSkeleton = () => (
  <section className="py-16 container px-4" aria-label="Loading career predictions">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      {/* Score Card */}
      <div className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 text-center md:text-left space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* Career Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const SkillAnalysisSkeleton = () => (
  <section className="py-16 container px-4" aria-label="Loading skill analysis">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Skills */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-32 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
        
        {/* Skill Gaps */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-32 mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-secondary/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const RoadmapSkeleton = () => (
  <section className="py-16 container px-4" aria-label="Loading roadmap">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-56 mx-auto mb-4" />
        <Skeleton className="h-6 w-72 mx-auto" />
      </div>
      
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FullAnalysisSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading analysis results">
    <span className="sr-only">Loading analysis results...</span>
    <CareerPredictionSkeleton />
    <SkillAnalysisSkeleton />
    <RoadmapSkeleton />
  </div>
);

export default FullAnalysisSkeleton;
