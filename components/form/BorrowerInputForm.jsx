// BorrowerInputForm.jsx — 3-step borrower intake form with optional fields & pre-computations
import { useState } from 'react';
import { CheckCircle2, RefreshCw, Settings2, Receipt, Ship, HelpCircle } from 'lucide-react';
import FormField from './FormField';
import SelectField from './SelectField';
import BankingRelationshipField from './BankingRelationshipField';
import BureauScoreIndicator from './BureauScoreIndicator';
import FormSubmitButton from './FormSubmitButton';

const TOTAL_STEPS = 3;

const PURPOSE_OPTIONS = [
  { value: 'Working Capital',     label: 'Working Capital',     Icon: RefreshCw },
  { value: 'Equipment Finance',   label: 'Equipment Finance',   Icon: Settings2  },
  { value: 'Invoice Discounting', label: 'Invoice Discounting', Icon: Receipt    },
  { value: 'Trade Finance',       label: 'Trade Finance',       Icon: Ship       },
  { value: 'other_mixed',         label: 'Other / Mixed',       Icon: HelpCircle },
];

/* ── Step indicator ──────────────────────────────── */
function StepIndicator({ current }) {
  return (
    <div className="flex items-center mb-8">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                             text-xs font-black shadow-md transition-all duration-300 ${
              n < current
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : n === current
                  ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                  : 'border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
            }`}>
              {n < current
                ? <CheckCircle2 className="w-4 h-4" />
                : n}
            </div>
            <span className={`text-[10px] font-bold hidden sm:block ${
              n < current  ? 'text-emerald-600 dark:text-emerald-400' :
              n === current? 'text-indigo-600 dark:text-indigo-400'  :
                             'text-slate-400 dark:text-slate-500'
            }`}>
              {n === 1 ? 'Business Profile' : n === 2 ? 'Financial Details' : 'Banking & Bureau'}
            </span>
          </div>
          {i < 2 && (
            <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
              n < current ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Pill group (single-select) ──────────────────── */
function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`pill-btn ${value === opt ? 'selected' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────── */
export default function BorrowerInputForm({ onSubmit, loading }) {
  const [step,   setStep]   = useState(1);
  const [errors, setErrors] = useState({});

  // Step 1 fields
  const [entityType,  setEntityType]  = useState('');
  const [vintage,     setVintage]     = useState('');
  const [state,       setState]       = useState('');
  const [gstReg,      setGstReg]      = useState('');
  const [gstFiling,   setGstFiling]   = useState('');
  const [gstNonRegReason, setGstNonRegReason] = useState('');
  const [gstImpliedRevenue, setGstImpliedRevenue] = useState('');

  // Step 2 fields
  const [turnover,    setTurnover]    = useState('');
  const [loanReq,     setLoanReq]     = useState('');
  const [purpose,     setPurpose]     = useState('');
  const [loanTenure,  setLoanTenure]  = useState('');
  const [existingCCLimit, setExistingCCLimit] = useState('');
  const [existingCCUtilisation, setExistingCCUtilisation] = useState('');
  const [promoterMonthlyIncome, setPromoterMonthlyIncome] = useState('');
  const [existingEMI, setExistingEMI] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 3 fields
  const [bankingRel,  setBankingRel]  = useState('');
  const [bankName,    setBankName]    = useState('');
  const [bureau,      setBureau]      = useState('');
  const [companyBureau, setCompanyBureau] = useState('');
  const [coApplicant,   setCoApplicant]   = useState('');
  const [coApplicantBureau, setCoApplicantBureau] = useState('');

  /* ── Validation ────────────────────────────────── */
  function validate(s) {
    const e = {};
    if (s === 1) {
      if (!entityType)                            e.entityType = 'This field is required.';
      if (!vintage)                               e.vintage    = 'This field is required.';
      if (!gstReg)                                e.gstReg     = 'This field is required.';
    }
    if (s === 2) {
      if (!turnover)  e.turnover = 'This field is required.';
      if (!loanReq)   e.loanReq  = 'This field is required.';
      if (!purpose)   e.purpose  = 'This field is required.';
    }
    return e;
  }

  function handleNext() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstErr = document.querySelector('[data-error="true"]');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setErrors({});
    setStep(s => s - 1);
  }

  function handleSubmit() {
    const e = validate(3);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    // Pre-computation logic
    const turnoverToLoanRatio = (Number(turnover) / Number(loanReq)).toFixed(2);
    const loanToTurnoverPct = ((Number(loanReq) / Number(turnover)) * 100).toFixed(2);
    const foirPct = (promoterMonthlyIncome && existingEMI)
      ? ((Number(existingEMI) / Number(promoterMonthlyIncome)) * 100).toFixed(2)
      : "Not provided";

    onSubmit({
      entityType,
      businessVintage: Number(vintage),
      location:  state,
      gstStatus: gstReg === 'Registered'
        ? (gstFiling ? `Registered — ${gstFiling}` : 'Registered')
        : 'Not Registered',
      gstNonRegReason: gstReg === 'Not Registered' ? gstNonRegReason : '',
      gstImpliedRevenue: gstImpliedRevenue !== '' ? Number(gstImpliedRevenue) : null,
      annualTurnover:   Number(turnover),
      loanRequirement:  Number(loanReq),
      loanPurpose:      purpose,
      loanTenure:       loanTenure !== '' ? Number(loanTenure) : null,
      existingCCLimit:  existingCCLimit !== '' ? Number(existingCCLimit) : null,
      existingCCUtilisation: existingCCUtilisation !== '' ? Number(existingCCUtilisation) : null,
      promoterMonthlyIncome: promoterMonthlyIncome !== '' ? Number(promoterMonthlyIncome) : null,
      existingEMI:      existingEMI !== '' ? Number(existingEMI) : null,
      additionalNotes,
      existingBanking:  bankingRel === 'Yes' ? 'yes' : 'no',
      bankName:         bankingRel === 'Yes' ? bankName : '',
      bureauScore:      bureau !== '' ? Number(bureau) : null,
      promoterBureau:   bureau !== '' ? Number(bureau) : null,
      companyBureau:    companyBureau !== '' ? Number(companyBureau) : null,
      coApplicant,
      coApplicantBureau: coApplicantBureau !== '' ? Number(coApplicantBureau) : null,
      turnoverToLoanRatio,
      loanToTurnoverPct,
      foirPct
    });
  }

  /* ── Render ────────────────────────────────────── */
  return (
    <div className="glass-panel rounded-2xl shadow-glass-md dark:shadow-glass-dark-md p-6 sm:p-8">
      <StepIndicator current={step} />

      {/* ── STEP 1 ─────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Entity Type */}
          <FormField label="Type of Business" required error={errors.entityType}>
            <div data-error={!!errors.entityType}>
              <PillGroup
                options={['Manufacturer', 'Trader', 'Service Provider']}
                value={entityType}
                onChange={v => { setEntityType(v); setErrors(prev => ({ ...prev, entityType: '' })); }}
              />
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vintage */}
            <FormField id="vintage" label="How Many Years Has the Business Been Operating?" required error={errors.vintage}>
              <input
                id="vintage"
                data-error={!!errors.vintage}
                type="number" min={0} max={100}
                placeholder="e.g. 8"
                value={vintage}
                onChange={e => { setVintage(e.target.value); setErrors(prev => ({ ...prev, vintage: '' })); }}
                className="form-input"
              />
            </FormField>

            {/* State */}
            <div data-error={!!errors.state}>
              <SelectField
                value={state}
                onChange={v => { setState(v); setErrors(prev => ({ ...prev, state: '' })); }}
                error={errors.state}
                required={false}
                helper="More details = more accurate assessment. Leave blank if unavailable."
              />
            </div>
          </div>

          {/* GST Registration */}
          <FormField label="GST Registration & Filing Status" required error={errors.gstReg}>
            <div data-error={!!errors.gstReg}>
              <PillGroup
                options={['Registered', 'Not Registered']}
                value={gstReg}
                onChange={v => {
                  setGstReg(v);
                  setGstFiling('');
                  setGstNonRegReason('');
                  setErrors(prev => ({ ...prev, gstReg: '', gstFiling: '', gstNonRegReason: '' }));
                }}
              />
            </div>
          </FormField>

          {/* GST Filing Status — conditional */}
          <div className={`conditional-field ${gstReg === 'Registered' ? 'visible' : ''}`}>
            <FormField
              label="GST Filing Status"
              error={errors.gstFiling}
              helper="More details = more accurate assessment. Leave blank if unavailable."
            >
              <div data-error={!!errors.gstFiling} className="mt-1">
                <PillGroup
                  options={['Regular (Monthly)', 'Quarterly', 'Irregular / Lapsed', 'Recently Registered (< 12 months)']}
                  value={gstFiling}
                  onChange={v => { setGstFiling(v); setErrors(prev => ({ ...prev, gstFiling: '' })); }}
                />
              </div>
            </FormField>
          </div>

          {/* GST Non-Registration Reason — conditional */}
          <div className={`conditional-field ${gstReg === 'Not Registered' ? 'visible' : ''}`}>
            <FormField
              id="gstNonRegReason"
              label="REASON FOR NO GST REGISTRATION"
              error={errors.gstNonRegReason}
              helper="Optional. Helps the AI give a more accurate assessment. More details = more accurate assessment. Leave blank if unavailable."
            >
              <select
                id="gstNonRegReason"
                value={gstNonRegReason}
                onChange={e => { setGstNonRegReason(e.target.value); setErrors(prev => ({ ...prev, gstNonRegReason: '' })); }}
                className="form-input appearance-none cursor-pointer"
              >
                <option value="">Select reason</option>
                <option value="Turnover below registration threshold">Turnover below registration threshold</option>
                <option value="Registration currently in progress">Registration currently in progress</option>
                <option value="Business is export / GST-exempt">Business is export / GST-exempt</option>
                <option value="Unknown / Not provided">Unknown / Not provided</option>
              </select>
            </FormField>
          </div>

          {/* GST-Implied Annual Revenue */}
          <FormField
            id="gstImpliedRevenue"
            label="GST-IMPLIED ANNUAL REVENUE (₹ CRORE)"
            error={errors.gstImpliedRevenue}
            helper="Revenue as implied by GST returns. Leave blank if unknown. More details = more accurate assessment. Leave blank if unavailable."
          >
            <input
              id="gstImpliedRevenue"
              type="number"
              min={0}
              step={0.01}
              placeholder="e.g. 5.50"
              value={gstImpliedRevenue}
              onChange={e => setGstImpliedRevenue(e.target.value)}
              className="form-input"
            />
          </FormField>
        </div>
      )}

      {/* ── STEP 2 ─────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Annual Turnover */}
            <FormField
              id="turnover"
              label="Annual Turnover (₹ Crore)"
              required
              error={errors.turnover}
              helper="Enter last financial year turnover in Crores."
            >
              <input
                id="turnover"
                type="number" min={0} step={0.01}
                placeholder="e.g. 12.50"
                value={turnover}
                onChange={e => { setTurnover(e.target.value); setErrors(prev => ({ ...prev, turnover: '' })); }}
                className="form-input"
              />
            </FormField>

            {/* Loan Requirement */}
            <FormField id="loanReq" label="Loan Amount Required (₹ Crore)" required error={errors.loanReq}>
              <input
                id="loanReq"
                type="number" min={0} step={0.01}
                placeholder="e.g. 2.00"
                value={loanReq}
                onChange={e => { setLoanReq(e.target.value); setErrors(prev => ({ ...prev, loanReq: '' })); }}
                className="form-input"
              />
            </FormField>
          </div>

          {/* Purpose of Financing */}
          <FormField label="What is the Loan For?" required error={errors.purpose}>
            <div data-error={!!errors.purpose} className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-1">
              {PURPOSE_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setPurpose(value); setErrors(prev => ({ ...prev, purpose: '' })); }}
                  className={`border rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center gap-1.5 ${
                    purpose === value
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-white/10 bg-transparent text-slate-500 dark:text-slate-400 hover:border-indigo-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto" />
                  <span className="text-xs font-bold leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Loan Tenure */}
            <FormField
              id="loanTenure"
              label="PREFERRED LOAN TENURE (MONTHS)"
              error={errors.loanTenure}
              helper="e.g. 12, 24, 36. Leave blank if not yet decided. More details = more accurate assessment. Leave blank if unavailable."
            >
              <input
                id="loanTenure"
                type="number" min={6} max={120}
                placeholder="e.g. 36"
                value={loanTenure}
                onChange={e => setLoanTenure(e.target.value)}
                className="form-input"
              />
            </FormField>

            {/* Existing CC / OD Limit */}
            <FormField
              id="existingCCLimit"
              label="EXISTING CC / OD LIMIT (₹ CRORE)"
              error={errors.existingCCLimit}
              helper="Leave blank if no existing credit facility. More details = more accurate assessment. Leave blank if unavailable."
            >
              <input
                id="existingCCLimit"
                type="number" min={0} step={0.01}
                placeholder="e.g. 1.50"
                value={existingCCLimit}
                onChange={e => setExistingCCLimit(e.target.value)}
                className="form-input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Existing CC Utilisation */}
            <FormField
              id="existingCCUtilisation"
              label="EXISTING CC UTILISATION (%)"
              error={errors.existingCCUtilisation}
              helper="Approximate % of CC limit currently used. More details = more accurate assessment. Leave blank if unavailable."
            >
              <input
                id="existingCCUtilisation"
                type="number" min={0} max={100}
                placeholder="e.g. 65"
                value={existingCCUtilisation}
                onChange={e => setExistingCCUtilisation(e.target.value)}
                className="form-input"
              />
            </FormField>

            {/* Promoter Net Monthly Income */}
            <FormField
              id="promoterMonthlyIncome"
              label="PROMOTER NET MONTHLY INCOME (₹)"
              error={errors.promoterMonthlyIncome}
              helper="Used to compute debt service capacity (FOIR). More details = more accurate assessment. Leave blank if unavailable."
            >
              <input
                id="promoterMonthlyIncome"
                type="number" min={0}
                placeholder="e.g. 150000"
                value={promoterMonthlyIncome}
                onChange={e => setPromoterMonthlyIncome(e.target.value)}
                className="form-input"
              />
            </FormField>
          </div>

          {/* Existing Monthly EMI Obligations */}
          <FormField
            id="existingEMI"
            label="EXISTING MONTHLY EMI OBLIGATIONS (₹)"
            error={errors.existingEMI}
            helper="Total of all existing loan EMIs per month. More details = more accurate assessment. Leave blank if unavailable."
          >
            <input
              id="existingEMI"
              type="number" min={0}
              placeholder="e.g. 45000"
              value={existingEMI}
              onChange={e => setExistingEMI(e.target.value)}
              className="form-input"
            />
          </FormField>

          {/* Additional Notes */}
          <FormField
            id="additionalNotes"
            label="ADDITIONAL NOTES"
            error={errors.additionalNotes}
            helper="Any context for the AI analyst. Leave blank if not needed. More details = more accurate assessment. Leave blank if unavailable."
          >
            <textarea
              id="additionalNotes"
              maxLength={300}
              rows={3}
              placeholder="e.g. Seeking loan for business expansion..."
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              className="form-input py-2 resize-none"
            />
          </FormField>
        </div>
      )}

      {/* ── STEP 3 ─────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5">
          <BankingRelationshipField
            bankingRel={bankingRel}
            onBankingRelChange={v => { setBankingRel(v); setBankName(''); setErrors(prev => ({ ...prev, bankingRel: '', bankName: '' })); }}
            bankName={bankName}
            onBankNameChange={v => { setBankName(v); setErrors(prev => ({ ...prev, bankName: '' })); }}
            errors={{ bankingRel: errors.bankingRel, bankName: errors.bankName }}
            bankingRelRequired={false}
            bankingRelHelper="More details = more accurate assessment. Leave blank if unavailable."
            bankNameRequired={false}
            bankNameHelper="More details = more accurate assessment. Leave blank if unavailable."
          />

          <BureauScoreIndicator
            score={bureau}
            onChange={setBureau}
            error={errors.bureau}
            required={false}
            helper="Enter the approximate score. Exact figure not required. More details = more accurate assessment. Leave blank if unavailable."
          />

          {/* Company / Entity Bureau Score */}
          <FormField
            id="companyBureau"
            label="COMPANY / ENTITY BUREAU SCORE"
            error={errors.companyBureau}
            helper="Separate from promoter score. Leave blank if unavailable. More details = more accurate assessment. Leave blank if unavailable."
          >
            <input
              id="companyBureau"
              type="number" min={300} max={900}
              placeholder="e.g. 700"
              value={companyBureau}
              onChange={e => setCompanyBureau(e.target.value)}
              className="form-input"
            />
          </FormField>

          {/* Co-applicant Name & Relation */}
          <FormField
            id="coApplicant"
            label="CO-APPLICANT NAME & RELATION"
            error={errors.coApplicant}
            helper="Required by lenders for loans above ₹2 Crore. More details = more accurate assessment. Leave blank if unavailable."
          >
            <input
              id="coApplicant"
              type="text"
              placeholder="e.g. Priya Shah — Spouse"
              value={coApplicant}
              onChange={e => setCoApplicant(e.target.value)}
              className="form-input"
            />
          </FormField>

          {/* Co-applicant Bureau Score */}
          <FormField
            id="coApplicantBureau"
            label="CO-APPLICANT BUREAU SCORE"
            error={errors.coApplicantBureau}
            helper="Leave blank if unavailable. More details = more accurate assessment. Leave blank if unavailable."
          >
            <input
              id="coApplicantBureau"
              type="number" min={300} max={900}
              placeholder="e.g. 740"
              value={coApplicantBureau}
              onChange={e => setCoApplicantBureau(e.target.value)}
              className="form-input"
            />
          </FormField>
        </div>
      )}

      <FormSubmitButton
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
