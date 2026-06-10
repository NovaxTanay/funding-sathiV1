// constants/schema.js — Zod validation schemas
import { z } from 'zod';

export const borrowerSchema = z.object({
  entityType:            z.enum(['Manufacturer', 'Trader', 'Service Provider']),
  annualTurnover:        z.number().positive().max(10000),
  loanRequirement:       z.number().positive().max(1000),
  loanPurpose:           z.enum(['Working Capital', 'Equipment Finance', 'Invoice Discounting', 'Trade Finance', 'other_mixed']),
  gstStatus:             z.string().min(1),
  businessVintage:       z.number().min(0).max(100),
  
  // Optional fields
  location:              z.string().optional().nullable(),
  gstNonRegReason:       z.string().optional().nullable(),
  gstFiling:             z.string().optional().nullable(),
  gstImpliedRevenue:     z.number().optional().nullable(),
  loanTenure:            z.number().optional().nullable(),
  existingCCLimit:       z.number().optional().nullable(),
  existingCCUtilisation: z.number().optional().nullable(),
  promoterMonthlyIncome: z.number().optional().nullable(),
  existingEMI:           z.number().optional().nullable(),
  additionalNotes:       z.string().optional().nullable(),
  existingBanking:       z.enum(['yes', 'no']).optional().nullable(),
  bankName:              z.string().optional().nullable(),
  bureauScore:           z.number().min(300).max(900).optional().nullable(),
  promoterBureau:        z.number().min(300).max(900).optional().nullable(),
  companyBureau:         z.number().min(300).max(900).optional().nullable(),
  coApplicant:           z.string().optional().nullable(),
  coApplicantBureau:     z.number().min(300).max(900).optional().nullable(),
  turnoverToLoanRatio:   z.string().optional().nullable(),
  loanToTurnoverPct:     z.string().optional().nullable(),
  foirPct:               z.string().optional().nullable(),
});

export const analysisSchema = z.object({
  viabilityVerdict: z.object({
    classification: z.enum(['Bankable', 'Conditionally Bankable', 'Substandard']),
    rationale:      z.string(),
    conditions:     z.array(z.string()).optional().nullable(),
  }),
  assessmentConfidence: z.object({
    level:          z.enum(['High', 'Medium', 'Low']),
    rationale:      z.string(),
  }).optional().nullable(),
  borrowerClassification: z.object({
    ntbOrEtb:       z.enum(['NTB', 'ETB', 'Cannot Determine']),
    relativeTo:     z.string(),
    implication:    z.string(),
  }).optional().nullable(),
  workingCapitalAssessment: z.object({
    cycleType:             z.enum(['Manufacturer', 'Trader', 'Service Provider']),
    estimatedCycleDays:    z.string(),
    loanTenureFit:         z.enum(['Aligned', 'Mismatched', 'Cannot Determine']),
    tenureMismatchFlag:    z.boolean(),
    recommendedMinTenure:  z.string(),
    observation:           z.string(),
  }).optional().nullable(),
  lenderRecommendation: z.object({
    primaryCategory:   z.string(),
    secondaryCategory: z.string().optional().nullable(),
    justification:     z.string(),
  }),
  foirAssessment: z.object({
    computed:          z.boolean(),
    value:             z.string().optional().nullable(),
    verdict:           z.enum(['Healthy', 'Strained', 'Critical', 'Cannot Determine']),
    observation:       z.string(),
  }).optional().nullable(),
  riskFlags:         z.array(z.string()).min(3),
  documentChecklist: z.array(z.string()).min(3),
  rmNextActions:     z.array(z.string()).min(1),
  dataGaps:          z.array(z.string()).optional().nullable(),
});

