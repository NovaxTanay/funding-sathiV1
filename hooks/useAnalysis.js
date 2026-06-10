// hooks/useAnalysis.js
import useAppStore from '../store/useAppStore';

/**
 * Submits borrower form data to /api/analyze and updates global store.
 */
export function useAnalysis() {
  const { setLoading: setIsLoading, setAnalysis, setError } = useAppStore();

  async function runAnalysis(formData) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('[useAnalysis] raw response:', data);
      console.log('[useAnalysis] analysis:', data.analysis);
      console.log('[useAnalysis] leadId:', data.leadId);
      const { leadId, analysis } = data;
      setAnalysis(analysis, formData, leadId);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return { runAnalysis };
}
