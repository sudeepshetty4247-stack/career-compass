import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisResult } from "@/hooks/useResumeAnalysis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PDFExportProps {
  data: AnalysisResult;
}

const PDFExport = ({ data }: PDFExportProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleExport = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsExporting(true);

    try {
      // Dynamic import for html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      // Create a styled HTML content for PDF
      const content = generatePDFContent(data);

      // Create a visible container for proper rendering
      const container = document.createElement("div");
      container.innerHTML = content;
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "210mm"; // A4 width
      container.style.minHeight = "297mm"; // A4 height
      container.style.background = "white";
      container.style.color = "#000";
      container.style.padding = "20px";
      document.body.appendChild(container);

      // Wait for content to fully render
      await new Promise(resolve => setTimeout(resolve, 1000));

      const opt = {
        margin: [15, 15, 15, 15],
        filename: `CareerAI_Analysis_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowWidth: 800
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(container).save();

      document.body.removeChild(container);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = (result: AnalysisResult): string => {
    const topCareer = result.careerPredictions?.[0];

    // Flatten roadmap items for display
    const allRoadmapItems = [
      ...(result.roadmap?.shortTerm?.map(item => ({ ...item, phase: "Short Term (0-6 months)" })) || []),
      ...(result.roadmap?.midTerm?.map(item => ({ ...item, phase: "Mid Term (6-18 months)" })) || []),
      ...(result.roadmap?.longTerm?.map(item => ({ ...item, phase: "Long Term (18+ months)" })) || []),
    ];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, Helvetica, sans-serif; color: #1a1a2e; line-height: 1.6; }
          .container { padding: 20px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
          .header h1 { margin: 0; font-size: 28px; color: #6366f1; font-weight: bold; }
          .header p { color: #666; margin-top: 8px; font-size: 14px; }
          .score-box { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center; }
          .score-box h2 { margin: 0 0 10px 0; font-size: 18px; font-weight: 600; }
          .score-box .score { font-size: 56px; font-weight: bold; line-height: 1; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .section h2 { color: #1a1a2e; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; font-size: 18px; }
          .career-card { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #6366f1; }
          .career-card h3 { margin: 0; font-size: 20px; color: #6366f1; }
          .career-card .probability { display: inline-block; background: #6366f1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-top: 8px; }
          .career-card p { color: #555; margin: 10px 0 0 0; font-size: 14px; }
          .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill-tag { background: #eef2ff; color: #6366f1; padding: 6px 14px; border-radius: 20px; font-size: 13px; display: inline-block; margin: 4px; }
          .gap-item { padding: 15px; margin: 10px 0; background: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b; }
          .gap-item.high { border-left-color: #ef4444; }
          .gap-item.low { border-left-color: #22c55e; }
          .gap-item strong { font-size: 15px; }
          .gap-item .priority { font-size: 12px; margin-left: 10px; }
          .gap-item p { color: #666; margin: 8px 0 0 0; font-size: 13px; }
          .two-col { display: flex; gap: 20px; }
          .two-col > div { flex: 1; }
          .two-col h3 { font-size: 16px; margin-bottom: 10px; }
          .two-col ul { margin: 0; padding-left: 20px; }
          .two-col li { margin: 6px 0; font-size: 13px; color: #444; }
          .roadmap-item { padding: 15px; margin: 10px 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; }
          .roadmap-item .phase { color: #6366f1; font-weight: 600; font-size: 14px; }
          .roadmap-item .goal { font-size: 15px; font-weight: 600; margin: 5px 0; }
          .roadmap-item .duration { color: #666; font-size: 13px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #666; font-size: 12px; }
          .career-list-item { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .career-list-item:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CareerAI Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div class="score-box">
            <h2>Career Readiness Score</h2>
            <div class="score">${result.readinessScore || 0}%</div>
          </div>

          ${topCareer ? `
          <div class="section">
            <div class="career-card">
              <h3>🎯 Top Career Match: ${topCareer.domain}</h3>
              <span class="probability">${topCareer.probability}% Match</span>
              <p>${topCareer.description || ''}</p>
              ${topCareer.topRoles?.length ? `
                <p style="margin-top: 10px;"><strong>Top Roles:</strong> ${topCareer.topRoles.join(", ")}</p>
              ` : ""}
            </div>
          </div>
          ` : ""}

          <div class="section">
            <h2>📊 All Career Predictions</h2>
            ${result.careerPredictions?.map((career, idx) => `
              <div class="career-list-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="font-size: 15px;">${idx + 1}. ${career.domain}</strong>
                  <span style="background: #6366f1; color: white; padding: 3px 10px; border-radius: 20px; font-size: 13px;">${career.probability}%</span>
                </div>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">${career.description || ''}</p>
              </div>
            `).join("") || "<p>No predictions available</p>"}
          </div>

          <div class="section">
            <h2>💡 Skills Analysis</h2>
            <div class="skill-tags">
              ${result.skills?.map(skill => `
                <span class="skill-tag">${skill.name} (${skill.proficiency}%)</span>
              `).join("") || "<p>No skills data</p>"}
            </div>
          </div>

          <div class="section">
            <h2>🎯 Skill Gaps to Address</h2>
            ${result.skillGaps?.map((gap, idx) => `
              <div class="gap-item ${gap.importance}">
                <strong>${idx + 1}. ${gap.skill}</strong>
                <span class="priority" style="color: ${gap.importance === 'high' ? '#ef4444' : gap.importance === 'medium' ? '#f59e0b' : '#22c55e'};">(${gap.importance} priority)</span>
                <p>${gap.reason || ''}</p>
              </div>
            `).join("") || "<p>No skill gaps identified</p>"}
          </div>

          <div class="section">
            <h2>⚡ Strengths & Areas for Improvement</h2>
            <div class="two-col">
              <div>
                <h3 style="color: #22c55e;">✅ Strengths</h3>
                <ul>
                  ${result.explanation?.strengths?.map(s => `<li>${s}</li>`).join("") || "<li>No data</li>"}
                </ul>
              </div>
              <div>
                <h3 style="color: #f59e0b;">🔧 Improvements</h3>
                <ul>
                  ${result.explanation?.improvements?.map(i => `<li>${i}</li>`).join("") || "<li>No data</li>"}
                </ul>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>🗺️ Career Roadmap</h2>
            ${allRoadmapItems.length > 0 ? allRoadmapItems.map((item) => `
              <div class="roadmap-item">
                <div class="phase">${item.phase}</div>
                <div class="goal">${item.goal}</div>
                <div class="duration">Duration: ${item.duration} | Priority: ${item.priority}</div>
              </div>
            `).join("") : "<p>No roadmap data available</p>"}
          </div>

          <div class="footer">
            <p><strong>CareerAI</strong> - ML-Powered Career Intelligence</p>
            <p>Built by Sudesh, Sudeep, Shankar & Vipin</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <>
      <Button
        onClick={handleExport}
        variant="outline"
        className="gap-2"
        disabled={isExporting}
        aria-label="Export analysis results as PDF"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <FileDown className="w-4 h-4" aria-hidden="true" />
        )}
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Sign In Required</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please sign in to export your career analysis report as a PDF. This helps us personalize and save your reports.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => {
                setShowAuthDialog(false);
                navigate("/auth");
              }}
              className="w-full"
            >
              Sign In / Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PDFExport;
