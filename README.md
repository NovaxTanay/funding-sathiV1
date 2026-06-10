# FundingSathi — AI Credit Intake & Analysis Tool

An internal tool for Relationship Managers at Funding Sathi to perform 
AI-powered first-pass credit evaluation of inbound MSME loan requests.

## Live URL
https://fundingsathi.vercel.app

## Tech Stack
- Next.js 14 (React + API Routes)
- Open AI API (openai/gpt-oss-120b)
- Firebase Firestore (lead registry)
- Tailwind CSS
- Zod (validation)
- @react-pdf/renderer (PDF export)
- Vercel (deployment)

## Architecture
Browser → POST /api/analyze → Gemini API → Firestore → Response to browser
All API keys are server-side only. Browser never touches credentials.

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create `.env.local` with the required variables (see Environment Variables below)
4. Run `npm run dev`
5. Open http://localhost:3000

## Environment Variables
NVIDIA_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

## Prompt Architecture
See /prompt-documentation.md for full system prompt, user prompt template, 
and design rationale.
