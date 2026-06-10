// pages/api/leads/[id].js — PATCH /api/leads/:id
import { updateLeadStatus } from '../../../lib/firestore';
import { LEAD_STATUSES } from '../../../constants/options';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { status } = req.body;
  if (!status || !LEAD_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${LEAD_STATUSES.join(', ')}` });
  }

  try {
    await updateLeadStatus(id, status);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[leads/[id]] Update error:', err);
    return res.status(500).json({ error: 'Failed to update lead status.' });
  }
}
