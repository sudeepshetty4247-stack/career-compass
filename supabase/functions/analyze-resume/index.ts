import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an expert career counselor and resume analyst with deep knowledge of various industries and career paths. Your task is to analyze resumes and provide comprehensive career guidance.

When analyzing a resume, you must:
1. Extract all skills mentioned (technical and soft skills)
2. Identify the experience level (fresher, junior, mid-level, senior)
3. Analyze education background
4. Predict the best-suited career domains with probability scores
5. Explain WHY each domain is recommended based on the candidate's profile
6. Identify skill gaps and provide a learning roadmap

You MUST respond with valid JSON in exactly this format:
{
  "skills": [
    {"name": "Python", "category": "technical", "proficiency": 85},
    {"name": "Communication", "category": "soft", "proficiency": 70}
  ],
  "experience": {
    "level": "fresher|junior|mid|senior",
    "years": 0,
    "summary": "Brief experience summary"
  },
  "education": {
    "degree": "Degree name",
    "field": "Field of study",
    "institution": "Institution name if mentioned"
  },
  "careerPredictions": [
    {
      "domain": "Data Analytics",
      "probability": 72,
      "description": "Brief description of why this domain suits the candidate",
      "topRoles": ["Data Analyst", "Business Analyst", "BI Developer"]
    }
  ],
  "skillGaps": [
    {"skill": "Statistics", "importance": "high", "reason": "Essential for data analytics roles"}
  ],
  "readinessScore": 65,
  "explanation": {
    "summary": "Overall assessment summary",
    "strengths": ["List of key strengths"],
    "improvements": ["Areas for improvement"],
    "topContributingFactors": [
      {"factor": "Python proficiency", "impact": "positive", "weight": 25},
      {"factor": "SQL knowledge", "impact": "positive", "weight": 20}
    ]
  },
  "roadmap": {
    "shortTerm": [{"goal": "Learn Power BI", "duration": "1 month", "priority": "high"}],
    "midTerm": [{"goal": "Complete a data analytics project", "duration": "3 months", "priority": "high"}],
    "longTerm": [{"goal": "Pursue certification", "duration": "6 months", "priority": "medium"}]
  }
}

Be thorough but realistic in your assessment. The probabilities should add up to 100% across all career predictions. Provide at least 3 career domain predictions.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("Resume text is required");
    }

    console.log("Analyzing resume with length:", resumeText.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Using Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please analyze this resume and provide comprehensive career guidance:\n\n${resumeText}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response received, parsing JSON...");

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const analysis = JSON.parse(jsonStr);
    console.log("Analysis parsed successfully");

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
