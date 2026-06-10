// FormField.jsx — generic label + input wrapper with error display
export default function FormField({ label, required, error, helper, children, id }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider
                     text-slate-500 dark:text-slate-400"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">
          {helper}
        </p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
