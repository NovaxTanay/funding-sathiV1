// utils/parseAnalysis.js — Transforms validated Gemini/NIM output into a frontend-ready shape

/**
 * Transforms a validated analysis object into a clean,
 * frontend-ready structure with renamed fields and metadata.
 *
 * @param {object} analysis — The validated analysis object from validateAnalysis.
 * @returns {object} A re-shaped object ready for UI consumption.
 */
export function parseAnalysis(analysis) {
  // Map rmNextActions array to single string if it's an array, otherwise default to rmNextAction string
  let rmNextActionStr = "";
  if (Array.isArray(analysis.rmNextActions)) {
    rmNextActionStr = analysis.rmNextActions.join('\n');
  } else if (typeof analysis.rmNextAction === 'string') {
    rmNextActionStr = analysis.rmNextAction;
  } else if (typeof analysis.rmNextActions === 'string') {
    rmNextActionStr = analysis.rmNextActions;
  }

  return {
    dealViability: {
      verdict:    analysis.viabilityVerdict.classification,
      rationale:  analysis.viabilityVerdict.rationale,
      conditions: analysis.viabilityVerdict.conditions || [],
    },
    lenderRecommendation: {
      primary:       analysis.lenderRecommendation.primaryCategory,
      secondary:     analysis.lenderRecommendation.secondaryCategory ?? null,
      justification: analysis.lenderRecommendation.justification,
    },
    riskFlags:         analysis.riskFlags || [],
    documentChecklist: analysis.documentChecklist || [],
    rmNextAction:      rmNextActionStr,
    
    // Additional assessment details for any future reference or detailed displays
    assessmentConfidence:     analysis.assessmentConfidence || null,
    borrowerClassification:   analysis.borrowerClassification || null,
    workingCapitalAssessment: analysis.workingCapitalAssessment || null,
    foirAssessment:           analysis.foirAssessment || null,
    dataGaps:                 analysis.dataGaps || [],
    
    metadata: {
      parsedAt:       new Date().toISOString(),
      classification: analysis.viabilityVerdict.classification,
    },
  };
}

