// SelectField.jsx — styled <select> for state / UT dropdown
import FormField from './FormField';

const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function SelectField({ value, onChange, error }) {
  return (
    <FormField
      id="state-select"
      label="State / Region"
      required
      error={error}
    >
      <select
        id="state-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="form-input appearance-none cursor-pointer"
      >
        <option value="" disabled>Select state or UT</option>
        {STATES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </FormField>
  );
}
