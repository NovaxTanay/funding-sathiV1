# FundingSathi — AI Credit Intake & Analysis Tool
## Complete Project Documentation

**Project:** AI-Powered Credit Pre-Screening Tool  
**Client:** Funding Sathi (ESSGEEI Financial Pvt Ltd)  
**Candidate:** Tanay Dawoor  
**Reference:** FS/HR/R2/2026/TD-01  

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Tech Stack](#3-tech-stack)
4. [Environment Variables](#4-environment-variables)
5. [Prompt Documentation](#5-prompt-documentation)
6. [API Routes](#6-api-routes)
7. [Component Architecture](#7-component-architecture)
8. [Lib Files](#8-lib-files)
9. [Zod Schemas](#9-zod-schemas)
10. [Firebase Firestore](#10-firebase-firestore)
11. [PDF Export](#11-pdf-export)
12. [UI Design System](#12-ui-design-system)
13. [Deployment](#13-deployment)
14. [README Template](#14-readme-template)
15. [Evaluation Checklist](#15-evaluation-checklist)

---

## 1. PROJECT OVERVIEW

### What This Tool Does
An internal web tool for Funding Sathi's Relationship Managers. The Relationship Manager enters a borrower's financial details into a form. The tool sends those details to an AI (Google Gemini) that is instructed to behave like a senior Indian MSME credit analyst. Within seconds, the Relationship Manager receives a structured credit assessment — ready to copy-paste into a lender email or download as a PDF.

### What This Tool Does NOT Do
- It does not talk to the borrower directly
- It does not send automated emails to the borrower
- It is not a public-facing product
- It is not a chatbot

### The 6-Step Working Flow
```
Step 1 → Relationship Manager fills 9-field borrower form → hits Submit
Step 2 → Browser sends data to Next.js backend API route (/api/analyze)
Step 3 → API route reads Gemini API key from environment variables
Step 4 → Builds two-layer prompt + calls Gemini API
Step 5 → Gemini returns structured JSON → optionally saved to Firestore
Step 6 → Browser renders analysis → RM copies text or downloads PDF
```

---

## 2. FOLDER STRUCTURE

```
fundingsathi/
│
├── pages/
│   ├── index.jsx                   ← Main page (form + output panel)
│   ├── leads.jsx                   ← Lead registry list view (Module D)
│   └── api/
│       ├── analyze.js              ← POST: calls Gemini, saves to Firestore
│       └── leads/
│           ├── index.js            ← GET: fetch all leads / POST: create lead
│           └── [id].js             ← PATCH: update lead status
│
├── components/
│   ├── BorrowerForm.jsx            ← 9-field input form with Zod validation
│   ├── AnalysisOutput.jsx          ← Renders the 5-section AI output
│   ├── ExportToolbar.jsx           ← Copy to clipboard + Download PDF buttons
│   ├── LeadListTable.jsx           ← Table view of saved leads
│   ├── LeadDetailModal.jsx         ← Modal to view full lead analysis
│   ├── StatusBadge.jsx             ← Bankable / Conditionally Bankable / Substandard badge
│   └── LoadingState.jsx            ← Spinner shown while Gemini processes
│
├── lib/
│   ├── gemini.js                   ← Gemini client + buildUserPrompt()
│   ├── firestore.js                ← Firebase Admin SDK (server-side only)
│   ├── schemas.js                  ← Zod schemas (borrowerSchema + analysisSchema)
│   ├── formatAnalysis.js           ← Converts JSON output to plain text for clipboard
│   └── generateLeadId.js           ← Auto-generates Lead ID (FS-2026-NNNN format)
│
├── constants/
│   └── prompts.js                  ← SYSTEM_PROMPT constant (never changes)
│
├── styles/
│   └── globals.css                 ← Tailwind base + custom CSS variables
│
├── .env.local                      ← All API keys (never committed to Git)
├── .gitignore                      ← Must include .env.local
├── next.config.js                  ← Next.js configuration
├── tailwind.config.js              ← Tailwind configuration
├── package.json                    ← Dependencies
└── README.md                       ← Setup + architecture + environment variables
```

---

## 3. TECH STACK

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend Framework | React (Next.js 14) | Full-stack in one project, API routes built-in |
| Styling | Tailwind CSS | Utility-first, fast to build professional UI |
| Form Validation | Zod | Strict schema validation on both client and server |
| State Management | Zustand | Lightweight global state for output panel |
| AI / LLM | Google Gemini API (gemini-2.0-flash) | Required by assessment brief |
| Backend | Next.js API Routes | Serverless, handles all secrets server-side |
| Database | Firebase Firestore | Lead registry persistence (Module D) |
| PDF Export | @react-pdf/renderer | Structured single-page PDF export |
| Deployment | Vercel | One-command deploy, environment variable management |

---

## 4. ENVIRONMENT VARIABLES

### .env.local (never commit this file)
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Admin SDK (server-side only)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### How These Are Used
- `GEMINI_API_KEY` → read in `pages/api/analyze.js` via `process.env.GEMINI_API_KEY`
- Firebase keys → read in `lib/firestore.js` via `process.env.FIREBASE_*`
- **None of these ever reach the browser.** They only exist in Next.js API routes (server-side).

### Setting on Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each key manually
3. Redeploy

---

## 5. PROMPT DOCUMENTATION

### Architecture: Two-Layer Prompt

```
Layer 1: SYSTEM_PROMPT (static)     → defines who Gemini is
Layer 2: buildUserPrompt(formData)  → injects borrower data per submission
```

---

### Layer 1 — System Prompt
**File:** `constants/prompts.js`  
**Type:** Static. Never changes between submissions.

```javascript
export const SYSTEM_PROMPT = `
You are a senior credit analyst with 15 years of experience in the Indian MSME 
lending ecosystem. You work for a financial intermediary that connects small and 
medium businesses with appropriate lenders — including PSU banks, private banks, 
NBFCs, and fintech lending platforms.

Your role is to perform a first-pass credit evaluation of an inbound borrower 
profile submitted by a Relationship Manager. You do not speak conversationally. 
You do not ask questions. You analyze the data provided and return a structured 
credit assessment.

TERMINOLOGY STANDARDS:
- Classify borrowers as NTB (New to Bank) or ETB (Existing to Bank) relative to 
  the target lender
- Use bureau score bands: 750+ (Prime), 700–750 (Near Prime), sub-700 (Substandard)
- Reference FOIR (Fixed Obligation to Income Ratio) where relevant
- Reference FLDG (First Loss Default Guarantee) exposure for fintech recommendations
- Correlate GST filing consistency with revenue reliability
- Assess working capital cycle relative to loan purpose
- Differentiate promoter bureau from company bureau where applicable

LENDER CATEGORIES:
- PSU Bank: Requires bureau 750+, strong GST history, audited financials
- Private Bank: Requires bureau 720+, stable turnover, clean repayment track
- NBFC: Accepts bureau 680+, higher interest rate, faster processing
- Fintech Lender: Accepts bureau 650+, GST-based underwriting, short tenure
- SCF Platform: Invoice discounting / supply chain finance for B2B businesses

DEAL VIABILITY CLASSIFICATIONS:
- Bankable: Strong profile, clear lender fit, minimal conditions
- Conditionally Bankable: Viable with stated conditions or documentation requirements
- Substandard: Significant risk flags, limited lender appetite, recommend remediation

OUTPUT FORMAT:
You must return a valid JSON object with exactly this structure. 
Do not return any text outside the JSON object. Do not use markdown code blocks.

{
  "viabilityVerdict": {
    "classification": "Bankable | Conditionally Bankable | Substandard",
    "rationale": "2-3 sentence explanation referencing specific input values"
  },
  "lenderRecommendation": {
    "primaryCategory": "PSU Bank | Private Bank | NBFC | Fintech | SCF Platform",
    "secondaryCategory": "optional fallback lender category",
    "justification": "explanation tied to bureau band, turnover, and loan purpose"
  },
  "riskFlags": [
    "Risk flag 1 — specific, quantified where possible",
    "Risk flag 2 — specific, quantified where possible",
    "Risk flag 3 — specific, quantified where possible"
  ],
  "documentChecklist": [
    "Document 1",
    "Document 2",
    "Document 3",
    "Document 4",
    "Document 5"
  ],
  "rmNextAction": "Specific, actionable instruction for the Relationship Manager. 
  Reference what to verify, which bureau to pull, or what condition to confirm 
  before submitting to lender."
}

CRITICAL RULES:
1. Always return valid JSON. Never return conversational text.
2. Risk flags must be minimum 3. Be specific — reference actual input values.
3. Document checklist must match the borrower profile — do not return a generic list.
4. If inputs are incomplete or borderline, produce a qualified assessment — 
   do not refuse or return an error.
5. Never invent data not provided. If a field is missing, note it as a risk flag.
`;
```

**Why this works:**
- Establishes domain persona before the model sees any borrower data
- Enforces exact JSON schema — no free-form text possible
- Embeds all required terminology so the model uses it without being prompted
- Handles edge cases (incomplete inputs) with a clear instruction

---

### Layer 2 — User Prompt
**File:** `lib/gemini.js`  
**Type:** Dynamic. Built fresh per form submission.

```javascript
export function buildUserPrompt(formData) {
  return `
Evaluate the following borrower profile and return your assessment in the 
required JSON format.

BORROWER PROFILE:
- Entity Type: ${formData.entityType}
- Annual Turnover: ₹${formData.annualTurnover} Crore
- Loan Requirement: ₹${formData.loanRequirement} Crore
- Loan Purpose: ${formData.loanPurpose}
- Existing Banking Relationship: ${formData.existingBanking === 'yes' 
    ? `Yes — ${formData.bankName}` 
    : 'No existing banking relationship'}
- GST Registration Status: ${formData.gstStatus}
- Promoter Bureau Score: ${formData.bureauScore} (CIBIL)
- Business Vintage: ${formData.businessVintage} years
- Business Location: ${formData.location}

Perform your credit evaluation now.
  `.trim();
}
```

**Why this works:**
- Contextual framing — not just raw values, each field is labeled
- Bureau score explicitly labeled as CIBIL — model understands the band
- Existing banking relationship framed as NTB/ETB signal
- Ends with a direct instruction to avoid the model adding preamble

---

### How Both Layers Are Combined in the API Call

```javascript
// pages/api/analyze.js

const result = await callGemini({
  systemPrompt: SYSTEM_PROMPT,
  userPrompt: buildUserPrompt(validatedFormData)
});
```

---

## 6. API ROUTES

### POST /api/analyze
**File:** `pages/api/analyze.js`

**What it does:**
1. Receives form data from browser via POST
2. Validates with Zod (borrowerSchema)
3. Builds two-layer prompt
4. Calls Gemini API
5. Validates Gemini response with Zod (analysisSchema)
6. Optionally saves to Firestore
7. Returns analysis JSON to browser

**Request body:**
```json
{
  "entityType": "Manufacturer",
  "annualTurnover": 42,
  "loanRequirement": 5,
  "loanPurpose": "Working Capital",
  "existingBanking": "yes",
  "bankName": "SBI",
  "gstStatus": "Registered, filing regularly for 3+ years",
  "bureauScore": 722,
  "businessVintage": 8,
  "location": "Pune, Maharashtra"
}
```

**Response body:**
```json
{
  "leadId": "FS-2026-0042",
  "analysis": {
    "viabilityVerdict": { ... },
    "lenderRecommendation": { ... },
    "riskFlags": [ ... ],
    "documentChecklist": [ ... ],
    "rmNextAction": "..."
  }
}
```

---

### GET /api/leads
**File:** `pages/api/leads/index.js`  
Returns all saved leads from Firestore for the lead registry page.

### PATCH /api/leads/[id]
**File:** `pages/api/leads/[id].js`  
Updates the status field of a lead (New → Under Review → Submitted to Lender → Closed).

---

## 7. COMPONENT ARCHITECTURE

### BorrowerForm.jsx
- 9 input fields with labels in plain business English
- Inline Zod validation — red border + error message on invalid input
- Dropdowns for: Entity Type, Loan Purpose, Existing Banking, GST Status
- Number inputs for: Turnover, Loan Requirement, Bureau Score, Business Vintage
- Text input for: Location, Bank Name (conditional — shows only if existing banking = Yes)
- Submit button triggers POST to /api/analyze
- Shows LoadingState while waiting

### AnalysisOutput.jsx
- Renders only after API returns successfully
- 5 sections as separate cards:
  1. Viability Verdict — large StatusBadge + rationale text
  2. Lender Recommendation — primary + secondary category + justification
  3. Risk Flags — numbered list, each flag on its own row
  4. Document Checklist — checkbox-style list (visual only)
  5. Relationship Manager Next Action — highlighted action block
- ExportToolbar rendered below the output

### ExportToolbar.jsx
- Copy to Clipboard button — calls formatAnalysis() to convert JSON to plain text
- Download PDF button — triggers @react-pdf/renderer to generate and download

### StatusBadge.jsx
```
Bankable          → green background
Conditionally Bankable → amber background  
Substandard       → red background
```

---

## 8. LIB FILES

### lib/gemini.js
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '../constants/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function buildUserPrompt(formData) { ... }

export async function callGemini(formData) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const result = await model.generateContent({
    systemInstruction: SYSTEM_PROMPT,
    contents: [{ role: 'user', parts: [{ text: buildUserPrompt(formData) }] }]
  });

  return JSON.parse(result.response.text());
}
```

### lib/firestore.js
- Firebase Admin SDK — server-side only, never imported in browser
- `saveLead(leadData)` — writes to `leads` collection
- `getLeads()` — reads all leads
- `updateLeadStatus(leadId, status)` — patches status field

### lib/schemas.js
- `borrowerSchema` — validates form input (9 fields)
- `analysisSchema` — validates Gemini JSON output before touching DB

### lib/formatAnalysis.js
- Takes the analysis JSON object
- Returns a formatted plain-text string
- Used by the clipboard copy button
- Output is professional enough to paste directly into a lender email

### lib/generateLeadId.js
- Generates IDs in format: `FS-2026-NNNN`
- Uses timestamp + random suffix to avoid collisions

---

## 9. ZOD SCHEMAS

### Borrower Input Schema
```javascript
import { z } from 'zod';

export const borrowerSchema = z.object({
  entityType: z.enum(['Manufacturer', 'Trader', 'Service Provider']),
  annualTurnover: z.number().positive().max(10000),
  loanRequirement: z.number().positive().max(1000),
  loanPurpose: z.enum([
    'Working Capital', 
    'Equipment Finance', 
    'Invoice Discounting', 
    'Trade Finance'
  ]),
  existingBanking: z.enum(['yes', 'no']),
  bankName: z.string().optional(),
  gstStatus: z.string().min(1),
  bureauScore: z.number().min(300).max(900),
  businessVintage: z.number().min(0).max(100),
  location: z.string().min(1)
});
```

### Analysis Output Schema
```javascript
export const analysisSchema = z.object({
  viabilityVerdict: z.object({
    classification: z.enum(['Bankable', 'Conditionally Bankable', 'Substandard']),
    rationale: z.string()
  }),
  lenderRecommendation: z.object({
    primaryCategory: z.string(),
    secondaryCategory: z.string().optional(),
    justification: z.string()
  }),
  riskFlags: z.array(z.string()).min(3),
  documentChecklist: z.array(z.string()).min(3),
  rmNextAction: z.string()
});
```

---

## 10. FIREBASE FIRESTORE

### Collection: `leads`

**Document Structure:**
```json
{
  "leadId": "FS-2026-0042",
  "createdAt": "2026-06-06T10:30:00Z",
  "status": "New",
  "inputSnapshot": {
    "entityType": "Manufacturer",
    "annualTurnover": 42,
    "loanRequirement": 5,
    "loanPurpose": "Working Capital",
    "existingBanking": "yes",
    "bankName": "SBI",
    "gstStatus": "Registered, filing regularly for 3+ years",
    "bureauScore": 722,
    "businessVintage": 8,
    "location": "Pune, Maharashtra"
  },
  "analysisOutput": {
    "viabilityVerdict": { ... },
    "lenderRecommendation": { ... },
    "riskFlags": [ ... ],
    "documentChecklist": [ ... ],
    "rmNextAction": "..."
  }
}
```

### Status Field Values
```
New → Under Review → Submitted to Lender → Closed
```

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // Block all direct client access
    }
  }
}
// Only Firebase Admin SDK (server-side) can read/write
```

---

## 11. PDF EXPORT

### Layout (single page)
```
┌─────────────────────────────────────┐
│  FUNDING SATHI                      │
│  Credit Assessment Report           │
│  Generated: 06 Jun 2026, 10:30 AM   │
├─────────────────────────────────────┤
│  BORROWER PROFILE                   │
│  Entity: Manufacturer               │
│  Turnover: ₹42 Cr  Loan: ₹5 Cr     │
│  Bureau: 722  Vintage: 8 yrs        │
│  Location: Pune, Maharashtra        │
├─────────────────────────────────────┤
│  DEAL VIABILITY                     │
│  [CONDITIONALLY BANKABLE]           │
│  Rationale: ...                     │
├─────────────────────────────────────┤
│  LENDER RECOMMENDATION              │
│  Primary: NBFC / Fintech            │
│  Justification: ...                 │
├─────────────────────────────────────┤
│  RISK FLAGS                         │
│  1. ...                             │
│  2. ...                             │
│  3. ...                             │
├─────────────────────────────────────┤
│  DOCUMENT CHECKLIST                 │
│  □ GST Returns (24 months)          │
│  □ Audited Financials (2 years)     │
│  □ Bank Statements (12 months)      │
│  □ KYC Documents                    │
│  □ Existing Sanction Letter (SBI)   │
├─────────────────────────────────────┤
│  RELATIONSHIP MANAGER — NEXT ACTION │
│  ...                                │
└─────────────────────────────────────┘
```

---

## 12. UI DESIGN SYSTEM

### Color Palette
```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F4F6F8;
  --bg-card: #FFFFFF;
  --border: #E2E8F0;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --accent-blue: #2563EB;
  --status-bankable: #16A34A;
  --status-conditional: #D97706;
  --status-substandard: #DC2626;
  --nav-bg: #0F172A;
}
```

### Typography
```
Font: DM Sans (Google Fonts)
Heading: 700 weight
Labels: 500 weight, 0.75rem, uppercase tracking
Body: 400 weight
```

### Layout
```
Desktop: Two-column layout
  Left column (40%): Borrower intake form
  Right column (60%): Analysis output panel

Mobile: Single column, form above output
```

### Form Field Labels (Plain Business English)
```
❌ "entityType"          → ✅ "Type of Business"
❌ "annualTurnover"      → ✅ "Annual Turnover (₹ Crore)"
❌ "loanRequirement"     → ✅ "Loan Amount Required (₹ Crore)"
❌ "loanPurpose"         → ✅ "What is the Loan For?"
❌ "existingBanking"     → ✅ "Does the Borrower Have an Existing Bank Relationship?"
❌ "gstStatus"           → ✅ "GST Registration & Filing Status"
❌ "bureauScore"         → ✅ "Promoter Credit Score (CIBIL)"
❌ "businessVintage"     → ✅ "How Many Years Has the Business Been Operating?"
❌ "location"            → ✅ "Business Location (City, State)"
```

---

## 13. DEPLOYMENT

### Step-by-Step Vercel Deployment

```bash
# Step 1 — Push to GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/yourusername/fundingsathi.git
git push -u origin main

# Step 2 — Connect to Vercel
# Go to vercel.com → New Project → Import from GitHub → Select repo

# Step 3 — Set Environment Variables in Vercel Dashboard
# Settings → Environment Variables → Add:
# GEMINI_API_KEY
# FIREBASE_PROJECT_ID
# FIREBASE_CLIENT_EMAIL
# FIREBASE_PRIVATE_KEY

# Step 4 — Deploy
# Vercel auto-deploys on every git push to main

# Step 5 — Verify live URL
# Test with the reference scenario (Pune manufacturer, CIBIL 722)
```

### .gitignore (critical)
```
.env.local
.env
node_modules/
.next/
```

---

## 14. README TEMPLATE

```markdown
# FundingSathi — AI Credit Intake & Analysis Tool

An internal tool for Relationship Managers at Funding Sathi to perform 
AI-powered first-pass credit evaluation of inbound MSME loan requests.

## Live URL
https://fundingsathi.vercel.app

## Tech Stack
- Next.js 14 (React + API Routes)
- Google Gemini API (gemini-2.0-flash)
- Firebase Firestore (lead registry)
- Tailwind CSS
- Zod (validation)
- @react-pdf/renderer (PDF export)
- Vercel (deployment)

## Architecture
Browser → POST /api/analyze → Gemini API → Firestore → Response to browser
All API keys are server-side only. Browser never touches credentials.

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create `.env.local` with the required variables (see Environment Variables below)
4. Run `npm run dev`
5. Open http://localhost:3000

## Environment Variables
GEMINI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

## Prompt Architecture
See /prompt-documentation.md for full system prompt, user prompt template, 
and design rationale.
```

---

## 15. EVALUATION CHECKLIST

### Before Submission — Verify Every Item

**Prompt Engineering (30%)**
- [ ] System prompt establishes senior Indian MSME credit analyst persona
- [ ] System prompt enforces exact JSON schema
- [ ] Output uses NTB/ETB classification
- [ ] Output uses bureau bands (750+, 700–750, sub-700)
- [ ] Output references FOIR, FLDG where relevant
- [ ] Output correlates GST filing with revenue reliability
- [ ] Reference scenario (Pune manufacturer, CIBIL 722) produces correct output
- [ ] Prompt documentation file submitted separately

**Product Functionality (25%)**
- [ ] Form submits successfully end-to-end
- [ ] Gemini returns valid structured JSON
- [ ] Output panel renders all 5 sections
- [ ] Copy to clipboard works
- [ ] PDF export downloads correctly
- [ ] No console errors on happy path

**Domain Knowledge (20%)**
- [ ] Viability verdict is contextually accurate for reference scenario
- [ ] Lender recommendation is appropriate (NBFC/fintech for CIBIL 722)
- [ ] Risk flags are specific, not generic
- [ ] Document checklist matches the borrower profile

**Code Quality (15%)**
- [ ] No API keys in client-side code
- [ ] No API keys committed to Git
- [ ] Modular component structure
- [ ] Zod validation on both client and server
- [ ] README covers setup, architecture, environment variables

**UI/UX (10%)**
- [ ] Form labels in plain business English
- [ ] Output is copy-paste ready without editing
- [ ] Status badge clearly visible
- [ ] Interface looks like a B2B ops tool, not a consumer app

---

*Document prepared for: Tanay Dawoor | FundingSathi Assessment | FS/HR/R2/2026/TD-01*
