// DocumentChecklistSection.jsx
import { FileCheck } from 'lucide-react';

export default function DocumentChecklistSection({ documentChecklist = [] }) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-glass-sm space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
          <FileCheck className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Document Checklist</h3>
      </div>
      <ul className="space-y-2">
        {documentChecklist.map((doc, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className="w-4 h-4 mt-0.5 shrink-0 rounded border-2
                            border-slate-300 dark:border-slate-600
                            flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-sm bg-transparent" />
            </div>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {doc}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
