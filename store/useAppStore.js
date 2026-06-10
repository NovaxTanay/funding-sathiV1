// store/useAppStore.js — Zustand global state
import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Analysis state
  analysis:    null,
  formData:    null,
  leadId:      null,
  isLoading:   false,
  error:       null,

  setLoading:  (v)    => set({ isLoading: v }),
  setAnalysis: (analysis, formData, leadId) => set({ analysis, formData, leadId, error: null }),
  setError:    (msg)  => set({ error: msg, isLoading: false }),
  clearResult: ()     => set({ analysis: null, formData: null, leadId: null, error: null }),

  // Leads state
  leads:       [],
  setLeads:    (leads) => set({ leads }),
  addLead:     (lead)  => set((s) => ({ leads: [lead, ...s.leads] })),
  updateLead:  (leadId, patch) => set((s) => ({
    leads: s.leads.map(l => l.leadId === leadId ? { ...l, ...patch } : l),
  })),

  // UI state
  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  reset: () => set({
    analysis: null,
    formData: null,
    leadId: null,
    isLoading: false,
    error: null,
    leads: [],
    selectedLead: null,
    userProfile: null,
  }),
}));

export default useAppStore;
