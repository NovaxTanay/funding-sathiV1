// utils/formatAnalysis.js
/**
 * Converts Gemini JSON analysis to professional plain-text
 * suitable for direct copy-paste into a lender email.
 */
export function formatAnalysis({ analysis, formData, leadId }) {
  if (!analysis) return '';
  const {
    viabilityVerdict, lenderRecommendation,
    riskFlags = [], documentChecklist = [], rmNextAction,
  } = analysis;

  const lines = [
    `FUNDING SATHI — CREDIT ASSESSMENT REPORT`,
    `Lead ID: ${leadId || 'N/A'}   |   Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    `${'─'.repeat(55)}`,
    ``,
    `BORROWER PROFILE`,
    `  Entity Type      : ${formData?.entityType || '—'}`,
    `  Annual Turnover  : ₹${formData?.annualTurnover || '—'} Crore`,
    `  Loan Required    : ₹${formData?.loanRequirement || '—'} Crore`,
    `  Loan Purpose     : ${formData?.loanPurpose || '—'}`,
    `  Banking          : ${formData?.existingBanking === 'yes' ? `Yes — ${formData?.bankName}` : 'No existing relationship'}`,
    `  GST Status       : ${formData?.gstStatus || '—'}`,
    `  Bureau Score     : ${formData?.bureauScore || '—'} (CIBIL)`,
    `  Business Vintage : ${formData?.businessVintage || '—'} years`,
    `  Location         : ${formData?.location || '—'}`,
    ``,
    `${'─'.repeat(55)}`,
    `DEAL VIABILITY: ${viabilityVerdict?.classification?.toUpperCase()}`,
    `${viabilityVerdict?.rationale || ''}`,
    ``,
    `${'─'.repeat(55)}`,
    `LENDER RECOMMENDATION`,
    `  Primary  : ${lenderRecommendation?.primaryCategory || '—'}`,
    lenderRecommendation?.secondaryCategory
      ? `  Fallback : ${lenderRecommendation.secondaryCategory}`
      : '',
    ``,
    `${lenderRecommendation?.justification || ''}`,
    ``,
    `${'─'.repeat(55)}`,
    `RISK FLAGS`,
    ...riskFlags.map((f, i) => `  ${i + 1}. ${f}`),
    ``,
    `${'─'.repeat(55)}`,
    `DOCUMENT CHECKLIST`,
    ...documentChecklist.map(d => `  □ ${d}`),
    ``,
    `${'─'.repeat(55)}`,
    `RELATIONSHIP MANAGER — NEXT ACTION`,
    `  ${rmNextAction || '—'}`,
    ``,
    `${'─'.repeat(55)}`,
    `Funding Sathi (ESSGEEI Financial Pvt Ltd) — Internal Use Only`,
  ];

  return lines.filter(l => l !== undefined).join('\n');
}
