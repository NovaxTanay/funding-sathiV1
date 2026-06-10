// constants/schema.js — Zod validation schemas
import { z } from 'zod';

export const borrowerSchema = z.object({
  entityType:       z.enum(['Manufacturer', 'Trader', 'Service Provider']),
  annualTurnover:   z.number().positive().max(10000),
  loanRequirement:  z.number().positive().max(1000),
  loanPurpose:      z.enum(['Working Capital', 'Equipment Finance', 'Invoice Discounting', 'Trade Finance']),
  existingBanking:  z.enum(['yes', 'no']),
  bankName:         z.string().optional(),
  gstStatus:        z.string().min(1),
  bureauScore:      z.number().min(300).max(900),
  businessVintage:  z.number().min(0).max(100),
  location:         z.string().min(1),
});

export const analysisSchema = z.object({
  viabilityVerdict: z.object({
    classification: z.enum(['Bankable', 'Conditionally Bankable', 'Substandard']),
    rationale:      z.string(),
  }),
  lenderRecommendation: z.object({
    primaryCategory:   z.string(),
    secondaryCategory: z.string().optional(),
    justification:     z.string(),
  }),
  riskFlags:         z.array(z.string()).min(3),
  documentChecklist: z.array(z.string()).min(3),
  rmNextAction:      z.string(),
});
