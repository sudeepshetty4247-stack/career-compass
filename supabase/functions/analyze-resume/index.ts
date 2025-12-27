import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are an expert career counselor and resume analyst.

Analyze the given resume text carefully and respond ONLY with valid JSON in the exact schema below.
Do not add any explanations. Do not wrap in markdown. Output JSON only.

Rules:
- Use resume content to determine skills, domain, scores
- Different resumes MUST produce different results
- Probabilities must sum to 100
- Be realistic (no exaggeration)

JSON schema:
{
  "skills": [
    {"name": "Skill", "category": "technical|soft", "proficiency": number}
  ],
  "experience": {
    "level": "fresher|junior|mid|senior",
    "years": number,
    "summary": "string"
  },
  "education": {
    "degree": "string",
    "field": "string",
    "institution": "string"
  },
  "careerPredictions": [
    {
      "domain": "string",
      "probability": number,
      "description": "string",
      "topRoles": ["string"]
    }
  ],
  "skillGaps": [
    {"skill": "string", "importance": "low|medium|high", "reason": "string"}
  ],
  "readinessScore": number,
  "explanation": {
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"],
    "topContributingFactors": [
      {"factor": "string", "impact": "positive|negative", "weight": number}
    ]
  },
  "roadmap": {
    "shortTerm": [{"goal": "string", "duration": "string", "priority": "high|medium|low"}],
    "midTerm": [{"goal": "string", "duration": "string", "priority": "high|medium|low"}],
    "longTerm": [{"goal": "string", "duration": "string", "priority": "high|medium|low"}]
  }
}`;

function extractJson(text: string) {
  // Prefer fenced blocks if model returns them
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    // Fallback: grab the first {...} block
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("AI response was not valid JSON");
    const slice = candidate.slice(start, end + 1);
    return JSON.parse(slice);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Resume text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prefer Lovable AI (no user API keys needed in Lovable Cloud). For fully-local dev, we fallback to Gemini if provided.
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_API_KEY");

    if (!LOVABLE_API_KEY && !GEMINI_API_KEY) {
      throw new Error("No AI key configured (set LOVABLE_API_KEY or GEMINI_API_KEY/GOOGLE_AI_API_KEY)");
    }

    let content: string | undefined;

    if (LOVABLE_API_KEY) {
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `RESUME:\n${resumeText}` },
          ],
        }),
      });

      if (!aiResp.ok) {
        const t = await aiResp.text().catch(() => "");
        console.error("AI gateway error:", aiResp.status, t);

        if (aiResp.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResp.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable AI usage." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ error: "AI gateway error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await aiResp.json();
      content = data?.choices?.[0]?.message?.content;
    } else {
      // Local fallback: direct Gemini call
      const geminiResp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: systemPrompt }, { text: `RESUME:\n${resumeText}` }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2000,
            },
          }),
        },
      );

      if (!geminiResp.ok) {
        const t = await geminiResp.text().catch(() => "");
        console.error("Gemini error:", geminiResp.status, t);
        return new Response(JSON.stringify({ error: "Gemini API error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const geminiData = await geminiResp.json();
      content = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!content || typeof content !== "string") throw new Error("Empty AI response");

    const analysis = extractJson(content);

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

