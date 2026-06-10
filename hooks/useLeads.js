// hooks/useLeads.js
import { useEffect } from 'react';
import useAppStore from '../store/useAppStore';

/**
 * Fetches all leads from /api/leads and syncs into the store.
 */
export function useLeads() {
  const { leads, setLeads, updateLead } = useAppStore();

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res  = await fetch('/api/leads');
      if (!res.ok) return;
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      // silently fail — empty state shown instead
    }
  }

  async function changeStatus(leadId, status) {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      if (res.ok) updateLead(leadId, { status });
    } catch {
      /* ignore */
    }
  }

  return { leads, changeStatus, refetch: fetchLeads };
}
