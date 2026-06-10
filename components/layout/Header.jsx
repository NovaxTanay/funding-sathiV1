// Header.jsx — standalone header bar (re-exported from Layout, or used independently)
import { useState } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

function AvatarButton({ profile }) {
  const [imgError, setImgError] = useState(false);
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <button
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr
                 from-indigo-600 to-violet-600 text-white flex items-center
                 justify-center text-xs sm:text-sm font-bold shadow-md
                 hover:scale-105 active:scale-95 transition-all duration-200
                 ring-2 ring-white/50 dark:ring-slate-800/50 overflow-hidden cursor-default"
      aria-label="User profile"
    >
      {profile?.photoURL && !imgError ? (
        <img
          src={profile.photoURL}
          alt={profile.fullName || "User"}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      ) : (
        getInitials(profile?.fullName)
      )}
    </button>
  );
}

export default function Header({ pageTitle, dark, onToggleTheme, onOpenSidebar }) {
  const { userProfile } = useAppStore();

  return (
    <header className="h-16 shrink-0 glass-panel rounded-2xl shadow-glass-md
                       dark:shadow-glass-dark-md flex items-center justify-between
                       px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-slate-500/10
                     text-slate-700 dark:text-slate-300 transition"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl hover:bg-slate-500/10 text-slate-600
                     dark:text-slate-300 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {dark
            ? <Moon className="w-[18px] h-[18px]" />
            : <Sun  className="w-[18px] h-[18px]" />
          }
        </button>
        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
        <AvatarButton profile={userProfile} />
      </div>
    </header>
  );
}
