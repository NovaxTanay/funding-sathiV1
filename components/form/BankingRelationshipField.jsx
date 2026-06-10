// BankingRelationshipField.jsx — "Yes/No" pill selector + conditional Bank Name input
import FormField from './FormField';

export default function BankingRelationshipField({
  bankingRel, onBankingRelChange,
  bankName,   onBankNameChange,
  errors = {},
}) {
  return (
    <div className="space-y-4">
      {/* Yes / No pills */}
      <FormField
        label="Do you have an existing banking relationship?"
        required
        error={errors.bankingRel}
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

      {/* Conditional Bank Name */}
      <div className={`conditional-field ${bankingRel === 'Yes' ? 'visible' : ''}`}>
        <FormField
          id="bank-name"
          label="Bank Name"
          required
          error={errors.bankName}
        >
          <input
            id="bank-name"
            type="text"
            value={bankName}
            onChange={e => onBankNameChange(e.target.value)}
            placeholder="e.g. HDFC Bank, SBI, ICICI Bank"
            className="form-input"
          />
        </FormField>
      </div>
    </div>
  );
}
