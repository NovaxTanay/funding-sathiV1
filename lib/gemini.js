// lib/gemini.js — OpenAI client via NVIDIA NIM (server-side only)
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt } from '../constants/prompts';
import { parseAnalysis } from './parseAnalysis';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

/**
 * Calls OpenAI via NVIDIA NIM and parses the JSON response.
 * Handles both a string prompt or a formData object.
 * 
 * @param {object|string} promptOrFormData
 * @returns {Promise<object>} Parsed analysis JSON
 */
export async function callGemini(promptOrFormData) {
  let userContent = "";
  if (typeof promptOrFormData === "string") {
    userContent = promptOrFormData;
  } else {
    userContent = buildUserPrompt(promptOrFormData);
  }

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    max_tokens: 4096,
  });

  const raw = response.choices[0].message.content;
  return parseAnalysis(raw);
}
