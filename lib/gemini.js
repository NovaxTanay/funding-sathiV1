// lib/gemini.js — OpenAI client via NVIDIA NIM (server-side only)
import OpenAI from "openai";
import { SYSTEM_PROMPT } from '../constants/prompts';
import { parseAnalysis } from './parseAnalysis';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export function buildUserPrompt(formData) {
  return `
Evaluate the following borrower profile and return your assessment in the required JSON format.

BORROWER PROFILE:
- Entity Type: ${formData.entityType}
- Annual Turnover: ₹${formData.annualTurnover} Crore
- Loan Requirement: ₹${formData.loanRequirement} Crore
- Loan Purpose: ${formData.loanPurpose}
- Existing Banking Relationship: ${
    formData.existingBanking === 'yes'
      ? `Yes — ${formData.bankName}`
      : 'No existing banking relationship'
  }
- GST Registration Status: ${formData.gstStatus}
- Promoter Bureau Score: ${formData.bureauScore} (CIBIL)
- Business Vintage: ${formData.businessVintage} years
- Business Location: ${formData.location}

Perform your credit evaluation now.
  `.trim();
}

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
