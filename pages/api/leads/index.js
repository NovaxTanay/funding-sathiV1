// pages/api/leads/index.js — GET /api/leads
import { getLeads } from '../../../lib/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leads = await getLeads();
    return res.status(200).json({ leads });
  } catch (err) {
    console.error('[leads] Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch leads.' });
  }
}
