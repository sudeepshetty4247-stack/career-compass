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

// Call local Ollama instance
async function callOllama(resumeText: string, ollamaUrl: string, model: string): Promise<string> {
  console.log(`Calling Ollama at ${ollamaUrl} with model ${model}`);
  
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model,
      prompt: `${systemPrompt}\n\nRESUME:\n${resumeText}`,
      stream: false,
      options: {
        temperature: 0.4,
        num_predict: 2000,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Ollama error:", response.status, errorText);
    throw new Error(`Ollama error: ${response.status} - ${errorText || "Unknown error"}`);
  }

  const data = await response.json();
  console.log("Ollama response received");
  return data.response;
}

// Call Lovable AI gateway
async function callLovableAI(resumeText: string, apiKey: string): Promise<string> {
  console.log("Calling Lovable AI gateway");
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Lovable AI error:", response.status, errorText);
    
    if (response.status === 429) {
      throw { status: 429, message: "Rate limit exceeded. Please try again in a moment." };
    }
    if (response.status === 402) {
      throw { status: 402, message: "AI credits exhausted. Please add credits to your Lovable AI usage." };
    }
    throw new Error(`Lovable AI error: ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content;
}

// Call Gemini API directly
async function callGemini(resumeText: string, apiKey: string): Promise<string> {
  console.log("Calling Gemini API directly");
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Gemini error:", response.status, errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText || "Unknown error"}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
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

    // Environment variables
    const USE_LOCAL_OLLAMA = Deno.env.get("USE_LOCAL_OLLAMA") === "true";
    const OLLAMA_URL = Deno.env.get("OLLAMA_URL") || "http://host.docker.internal:11434";
    const OLLAMA_MODEL = Deno.env.get("OLLAMA_MODEL") || "llama3.2";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("GOOGLE_AI_API_KEY");

    let content: string | undefined;
    let providerUsed = "";

    // Priority: 1. Ollama (if enabled) → 2. Lovable AI → 3. Gemini
    try {
      if (USE_LOCAL_OLLAMA) {
        providerUsed = "Ollama";
        content = await callOllama(resumeText, OLLAMA_URL, OLLAMA_MODEL);
      } else if (LOVABLE_API_KEY) {
        providerUsed = "Lovable AI";
        content = await callLovableAI(resumeText, LOVABLE_API_KEY);
      } else if (GEMINI_API_KEY) {
        providerUsed = "Gemini";
        content = await callGemini(resumeText, GEMINI_API_KEY);
      } else {
        throw new Error(
          "No AI provider configured. Set USE_LOCAL_OLLAMA=true for local Ollama, " +
          "or provide LOVABLE_API_KEY or GEMINI_API_KEY for cloud AI."
        );
      }
    } catch (err: unknown) {
      // Handle rate limit / payment errors from Lovable AI
      if (typeof err === "object" && err !== null && "status" in err) {
        const typedErr = err as { status: number; message: string };
        return new Response(JSON.stringify({ error: typedErr.message }), {
          status: typedErr.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw err;
    }

    console.log(`Successfully got response from ${providerUsed}`);

    if (!content || typeof content !== "string") {
      throw new Error(`Empty response from ${providerUsed}`);
    }

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
