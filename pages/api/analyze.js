// pages/api/analyze.js — POST /api/analyze
import { borrowerSchema } from '../../constants/schema';
import { validateAnalysis } from '../../utils/validateAnalysis';
import { parseAnalysis } from '../../utils/parseAnalysis';
import { callGemini } from '../../lib/gemini';
import { saveLead } from '../../lib/firestore';
import { generateLeadId } from '../../utils/generateLeadId';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Validate input
  const parsed = borrowerSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return res.status(400).json({ error: `Validation failed: ${msg}` });
  }
  const formData = parsed.data;

  // 2. Call Gemini
  let rawAnalysis;
  try {
    rawAnalysis = await callGemini(formData);
  } catch (err) {
    console.error('[analyze] Gemini error:', err);
    return res.status(502).json({ error: 'AI service unavailable. Please try again.' });
  }

  // 3. Validate AI output
  const { success, data: analysis, error: validErr } = validateAnalysis(rawAnalysis);
  console.log('[validate] result:', success, validErr);
  if (!success) {
    console.error('[analyze] Invalid AI output:', validErr);
    return res.status(502).json({ error: 'AI returned an unexpected response format.' });
  }

  // 4. Transform for frontend
  const parsedAnalysis = parseAnalysis(analysis);
  console.log('[parse] parsedAnalysis:', JSON.stringify(parsedAnalysis).slice(0, 200));

  // 5. Generate lead ID
  const leadId = generateLeadId();

  // 6. Save to Firestore (best-effort — don't fail the request if this fails)
  try {
    await saveLead({
      leadId,
      status:         'New',
      inputSnapshot:  formData,
      analysisOutput: analysis,
    });
  } catch (err) {
    console.warn('[analyze] Firestore save failed (non-fatal):', err.message);
  }

  // 7. Return to client
  console.log('[analyze] Returning response for leadId:', leadId);
  return res.status(200).json({ leadId, analysis: parsedAnalysis });
}
