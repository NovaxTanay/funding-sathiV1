// lib/validateEnv.js — validates required environment variables at startup
const REQUIRED = [
  'GEMINI_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

export function validateEnv() {
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
      `Create a .env.local file — see .env.example for reference.`
    );
  }
}
