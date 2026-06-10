// BankingRelationshipField.jsx — "Yes/No" pill selector + conditional Bank Name dropdown select
import FormField from './FormField';

const BANKS = [
  'SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'PNB', 'Bank of Baroda', 'Canara Bank', 'Union Bank', 'Other'
];

export default function BankingRelationshipField({
  bankingRel, onBankingRelChange,
  bankName,   onBankNameChange,
  errors = {},
  bankingRelRequired, bankingRelHelper,
  bankNameRequired, bankNameHelper
}) {
  return (
    <div className="space-y-4">
      {/* Yes / No pills */}
      <FormField
        label="Does the Borrower Have an Existing Bank Relationship?"
        required={bankingRelRequired}
        error={errors.bankingRel}
        helper={bankingRelHelper}
      >
        <div className="flex gap-2 mt-1">
          {['Yes', 'No'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onBankingRelChange(opt)}
              className={`pill-btn ${bankingRel === opt ? 'selected' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </FormField>

      {/* Conditional Bank Name Dropdown */}
      <div className={`conditional-field ${bankingRel === 'Yes' ? 'visible' : ''}`}>
        <FormField
          id="bank-select"
          label="BANK NAME"
          required={bankNameRequired}
          error={errors.bankName}
          helper={bankNameHelper}
        >
          <select
            id="bank-select"
            value={bankName}
            onChange={e => onBankNameChange(e.target.value)}
            className="form-input appearance-none cursor-pointer"
          >
            <option value="">Select bank name</option>
            {BANKS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
}
