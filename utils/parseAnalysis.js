// utils/parseAnalysis.js — Transforms validated Gemini output into a frontend-ready shape

/**
 * Transforms a validated Gemini analysis object into a clean,
 * frontend-ready structure with renamed fields and metadata.
 *
 * @param {object} analysis — The validated analysis object from validateAnalysis.
 * @returns {object} A re-shaped object ready for UI consumption.
 */
export function parseAnalysis(analysis) {
  return {
    dealViability: {
      verdict:   analysis.viabilityVerdict.classification,
      rationale: analysis.viabilityVerdict.rationale,
    },
    lenderRecommendation: {
      primary:       analysis.lenderRecommendation.primaryCategory,
      secondary:     analysis.lenderRecommendation.secondaryCategory ?? null,
      justification: analysis.lenderRecommendation.justification,
    },
    riskFlags:         analysis.riskFlags,
    documentChecklist: analysis.documentChecklist,
    rmNextAction:      analysis.rmNextAction,
    metadata: {
      parsedAt:       new Date().toISOString(),
      classification: analysis.viabilityVerdict.classification,
    },
  };
}
