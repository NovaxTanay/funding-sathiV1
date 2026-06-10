import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard, FileText, Users, Settings,
  Menu, X, Sun, Moon,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/form',      label: 'Forms',     icon: FileText },
  { href: '/leads',     label: 'Leads',     icon: Users },
];

export default function Layout({ children, pageTitle = 'Dashboard' }) {
  const router   = useRouter();
  const [dark,        setDark]        = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Theme bootstrap ─────────────────────────── */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function isActive(href) {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  }

  return (
    <div className="h-screen w-screen overflow-hidden text-slate-800 dark:text-slate-200
                    antialiased font-sans relative bg-slate-100 dark:bg-slate-950
                    transition-colors duration-300">

      {/* Ambient blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none
                      mix-blend-multiply dark:mix-blend-normal opacity-80 dark:opacity-100">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full
                        bg-gradient-to-tr from-indigo-400/30 dark:from-indigo-950/40
                        to-purple-400/20 dark:to-purple-900/30 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full
                        bg-gradient-to-br from-emerald-400/20 dark:from-emerald-950/20
                        to-teal-400/20 dark:to-teal-900/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-full w-full overflow-hidden p-2 sm:p-4 gap-3 md:gap-4">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 w-64 my-2 ml-2 z-50
          lg:my-0 lg:ml-0 lg:static lg:translate-x-0
          flex flex-col justify-between
          h-[calc(100%-16px)] lg:h-full
          glass-panel rounded-2xl shadow-glass-md dark:shadow-glass-dark-md
          transition-transform duration-300 ease-out shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div>
            {/* Brand */}
            <div className="flex items-center justify-between px-4 py-3
                            border-b border-white/40 dark:border-white/10">
              <img
                src="/logo.png"
                alt="Funding Sathi"
                className="h-12 w-auto object-contain rounded-lg"
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-500/10
                           text-slate-500 dark:text-slate-400"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="p-3 space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl
                              border transition-all ${
                    isActive(href)
                      ? 'font-semibold bg-white/70 dark:bg-slate-800/60 text-indigo-950 dark:text-white shadow-sm border-white/40 dark:border-white/5'
                      : 'font-medium text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive(href) ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Settings at bottom */}
          <div className="p-3 border-t border-white/40 dark:border-white/10">
            <Link
              href="/settings"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl
                          border transition-all ${
                router.pathname === '/settings'
                  ? 'font-semibold bg-white/70 dark:bg-slate-800/60 text-indigo-950 dark:text-white shadow-sm border-white/40 dark:border-white/5'
                  : 'font-medium text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings className={`w-4 h-4 ${router.pathname === '/settings' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
              Settings
            </Link>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden gap-3 md:gap-4">

          {/* Header */}
          <header className="h-16 shrink-0 glass-panel rounded-2xl shadow-glass-md
                             dark:shadow-glass-dark-md flex items-center justify-between
                             px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
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
                onClick={toggleTheme}
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
              <button
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr
                           from-indigo-600 to-violet-600 text-white flex items-center
                           justify-center text-xs sm:text-sm font-bold shadow-md
                           hover:scale-105 active:scale-95 transition-all duration-200
                           ring-2 ring-white/50 dark:ring-slate-800/50"
                aria-label="User profile"
              >
                JD
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto pr-0.5 pb-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
