// BorrowerInputForm.jsx — 3-step borrower intake form
import { useState } from 'react';
import { CheckCircle2, RefreshCw, Settings2, Receipt, Ship } from 'lucide-react';
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

  // Step 2 fields
  const [turnover,    setTurnover]    = useState('');
  const [loanReq,     setLoanReq]     = useState('');
  const [purpose,     setPurpose]     = useState('');

  // Step 3 fields
  const [bankingRel,  setBankingRel]  = useState('');
  const [bankName,    setBankName]    = useState('');
  const [bureau,      setBureau]      = useState(650);

  /* ── Validation ────────────────────────────────── */
  function validate(s) {
    const e = {};
    if (s === 1) {
      if (!entityType)                            e.entityType = 'This field is required.';
      if (!vintage)                               e.vintage    = 'This field is required.';
      if (!state)                                 e.state      = 'This field is required.';
      if (!gstReg)                                e.gstReg     = 'This field is required.';
      if (gstReg === 'Registered' && !gstFiling)  e.gstFiling  = 'This field is required.';
    }
    if (s === 2) {
      if (!turnover)  e.turnover = 'This field is required.';
      if (!loanReq)   e.loanReq  = 'This field is required.';
      if (!purpose)   e.purpose  = 'This field is required.';
    }
    if (s === 3) {
      if (!bankingRel)                              e.bankingRel = 'This field is required.';
      if (bankingRel === 'Yes' && !bankName.trim()) e.bankName   = 'This field is required.';
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
    onSubmit({
      entityType,
      businessVintage: Number(vintage),
      location:  state,
      gstStatus: gstReg === 'Registered'
        ? `Registered — ${gstFiling}`
        : 'Not Registered',
      annualTurnover:   Number(turnover),
      loanRequirement:  Number(loanReq),
      loanPurpose:      purpose,
      existingBanking:  bankingRel === 'Yes' ? 'yes' : 'no',
      bankName:         bankingRel === 'Yes' ? bankName : '',
      bureauScore:      bureau,
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
                  setErrors(prev => ({ ...prev, gstReg: '', gstFiling: '' }));
                }}
              />
            </div>
          </FormField>

          {/* GST Filing Status — conditional */}
          <div className={`conditional-field ${gstReg === 'Registered' ? 'visible' : ''}`}>
            <FormField label="GST Filing Status" required error={errors.gstFiling}>
              <div data-error={!!errors.gstFiling} className="mt-1">
                <PillGroup
                  options={['Regular (Monthly)', 'Quarterly', 'Irregular / Lapsed']}
                  value={gstFiling}
                  onChange={v => { setGstFiling(v); setErrors(prev => ({ ...prev, gstFiling: '' })); }}
                />
              </div>
            </FormField>
          </div>
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
            <div data-error={!!errors.purpose} className="grid grid-cols-2 gap-3 mt-1">
              {PURPOSE_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setPurpose(value); setErrors(prev => ({ ...prev, purpose: '' })); }}
                  className={`border rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-200
                    flex flex-col items-center gap-1.5 ${
                    purpose === value
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-white/10 bg-transparent text-slate-500 dark:text-slate-400 hover:border-indigo-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto" />
                  <span className="text-xs font-bold">{label}</span>
                </button>
              ))}
            </div>
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
          />

          <BureauScoreIndicator
            score={bureau}
            onChange={setBureau}
            error={errors.bureau}
          />
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
