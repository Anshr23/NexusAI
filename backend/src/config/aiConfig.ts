import OpenAI from "openai";

export interface AIProvider {
  name: string;
  client: OpenAI;
  model: string;
}

export const getAIProviders = (): AIProvider[] => {
  const providers: AIProvider[] = [];

  // 1. Primary: Groq (Ultra-fast inference with gpt-oss-120b)
  if (process.env.GROQ_API_KEY) {
    const groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    providers.push({
      name: "Groq (GPT-OSS 120B)",
      client: groqClient,
      model: "openai/gpt-oss-120b",
    });

    providers.push({
      name: "Groq (Compound Mini)",
      client: groqClient,
      model: "groq/compound-mini",
    });

    providers.push({
      name: "Groq (Qwen 3.6 27B)",
      client: groqClient,
      model: "qwen/qwen3.6-27b",
    });
  }

  // 2. Secondary: Google Gemini (Gemini 3.6 Flash via OpenAI-compatible endpoint)
  if (process.env.GEMINI_API_KEY) {
    providers.push({
      name: "Google Gemini (Gemini 3.6 Flash)",
      client: new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }),
      model: "gemini-3.6-flash",
    });
  }

  // 3. Tertiary: OpenAI (GPT-3.5 Turbo / GPT-4o-mini)
  if (process.env.OPEN_AI_SECRET) {
    providers.push({
      name: "OpenAI (GPT-3.5 Turbo)",
      client: new OpenAI({
        apiKey: process.env.OPEN_AI_SECRET,
        organization: process.env.OPENAI_ORGANIZATION_ID,
      }),
      model: "gpt-3.5-turbo",
    });
  }

  return providers;
};