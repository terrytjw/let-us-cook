import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

// note: functions are set up this way because we want to track the user id via helicone.ai
// use user id from auth or user's email to track
export const createOpenAIProvider = (userId: string) => {
  return createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://oai.hconeai.com/v1",
    headers: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-User-Id": userId,
    },
  });
};

export const createAnthropicProvider = (userId: string) => {
  return createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: "https://anthropic.hconeai.com/v1",
    headers: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-User-Id": userId,
    },
  });
};

export const createGroqProvider = (userId: string) => {
  return createOpenAI({
    apiKey: process.env.GROQ_API_KEY || "",
    baseURL: "https://gateway.hconeai.com/openai/v1",
    headers: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-User-Id": userId,
      "Helicone-Target-Url": "https://api.groq.com",
    },
  });
};
