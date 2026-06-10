// pages/settings.jsx — Settings page with Profile / Security tabs
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Lock, Camera, X, LogOut } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { auth } from '../lib/firebaseClient';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import useAppStore from '../store/useAppStore';

const db = getFirestore();

export default function SettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [dark, setDark] = useState(false);
  const [is2FA, setIs2FA] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success'|'error', text }
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Profile fields (controlled)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Current user ref
  const [currentUser, setCurrentUser] = useState(null);

  const { setUserProfile, reset } = useAppStore();

  async function handleLogout() {
    try {
      await signOut(auth);
      reset();
      router.push('/?logout=true');
    } catch (err) {
      console.error('[settings] Logout failed:', err);
    }
  }

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Listen for auth state and load settings from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Pre-fill from Firebase Auth profile
        let nameVal = user.displayName || '';
        let emailVal = user.email || '';
        let photoVal = user.photoURL || null;

        // Attempt to load saved settings from Firestore
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (data.fullName) nameVal = data.fullName;
            if (data.email) emailVal = data.email;
            if (typeof data.is2FA === 'boolean') setIs2FA(data.is2FA);
            if (data.theme) {
              setGlobalTheme(data.theme);
            }
          }
        } catch (err) {
          console.warn('[settings] Failed to load user settings:', err.message);
        }

        setFullName(nameVal);
        setEmail(emailVal);
        setUserProfile({
          fullName: nameVal,
          email: emailVal,
          photoURL: photoVal
        });
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setGlobalTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    }
  }

  async function handleSave() {
    if (!currentUser) {
      setStatusMsg({ type: 'error', text: 'You must be logged in to save settings.' });
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        fullName,
        email,
        is2FA,
        theme: dark ? 'dark' : 'light',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setUserProfile({
        fullName,
        email,
        photoURL: currentUser.photoURL || null
      });

      setSaved(true);
      setStatusMsg({ type: 'success', text: 'Settings saved successfully.' });
      setTimeout(() => {
        setSaved(false);
        setStatusMsg(null);
      }, 1800);
    } catch (err) {
      console.error('[settings] Save failed:', err);
      setStatusMsg({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Head>
        <title>FundingSathi — Settings</title>
        <meta name="description" content="Manage your profile, security, and interface preferences" />
      </Head>

      <Layout pageTitle="Settings">
        <div className="glass-panel rounded-2xl shadow-glass-md dark:shadow-glass-dark-md flex flex-col overflow-hidden h-full">

          {/* Top bar */}
          <div className="h-14 shrink-0 border-b border-white/40 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">System Settings</span>
            </div>
            <button onClick={() => router.push('/dashboard')} className="p-1.5 rounded-xl hover:bg-slate-500/10 text-slate-400 dark:text-slate-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Two-column body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

            {/* Left sidebar tabs */}
            <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/40 dark:border-white/10 p-2 sm:p-3 flex md:flex-col md:justify-between gap-1.5 shrink-0 overflow-x-auto">
              <div className="flex md:flex-col gap-1.5 w-full">
                <button onClick={() => setTab('profile')}
                  className={`flex items-center justify-center md:justify-start gap-3 px-4 py-2.5
                              text-xs sm:text-sm font-bold w-full rounded-xl transition-all ${
                    tab === 'profile'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
                  }`}>
                  <User className="w-4 h-4 shrink-0" /> My Profile
                </button>
                <button onClick={() => setTab('security')}
                  className={`flex items-center justify-center md:justify-start gap-3 px-4 py-2.5
                              text-xs sm:text-sm font-bold w-full rounded-xl transition-all ${
                    tab === 'security'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
                  }`}>
                  <Lock className="w-4 h-4 shrink-0" /> Password &amp; Security
                </button>
              </div>

              <div className="w-full flex md:flex-col shrink-0">
                <div className="hidden md:block h-px bg-[#E5E7EB] dark:bg-white/10 my-2" />
                {confirmLogout ? (
                  <div className="flex flex-col gap-1.5 w-full p-2 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/50 rounded-xl">
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 text-center uppercase tracking-wider">Are you sure?</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 py-1.5 text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmLogout(false)}
                        className="flex-1 py-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmLogout(true)}
                    className="flex items-center justify-center md:justify-start gap-3 px-4 py-2.5
                               text-xs sm:text-sm font-bold w-full rounded-xl transition-all
                               text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="w-4 h-4 shrink-0 text-red-500" /> Logout
                  </button>
                )}
              </div>
            </aside>

            {/* Content area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">

              {/* ── MY PROFILE ───────────────────────── */}
              {tab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">My Profile</h2>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Manage your personal account credentials and display themes.</p>
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/5">
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xl ring-4 ring-indigo-500/20 shadow-md overflow-hidden">
                      {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        fullName ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'FS'
                      )}
                      <button className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-white/10 hover:scale-105 transition shadow-sm">
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Picture</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Supports PNG, JPEG up to 2MB.</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                    </div>
                  </div>

                  <div className="h-px bg-white/40 dark:bg-white/5" />

                  {/* Theme cards */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Choose your preferred visual mode.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      {/* Light */}
                      <button onClick={() => setGlobalTheme('light')}
                        className={`p-3 rounded-xl border-2 bg-white/30 dark:bg-white/5 flex flex-col gap-2
                                    transition hover:border-indigo-400
                                    ${!dark ? 'border-indigo-600' : 'border-transparent'}`}>
                        <div className="h-16 sm:h-20 bg-slate-100 rounded-lg p-2 flex flex-col gap-1.5 shadow-inner">
                          <div className="h-2 w-1/3 bg-slate-300 rounded" />
                          <div className="grid grid-cols-3 gap-1">
                            <div className="h-6 sm:h-8 bg-white border border-slate-200 rounded-sm" />
                            <div className="h-6 sm:h-8 bg-white border border-slate-200 rounded-sm col-span-2" />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-center text-slate-500 dark:text-slate-400">Light Mode</span>
                      </button>

                      {/* Dark */}
                      <button onClick={() => setGlobalTheme('dark')}
                        className={`p-3 rounded-xl border-2 bg-white/30 dark:bg-white/5 flex flex-col gap-2
                                    transition hover:border-indigo-400
                                    ${dark ? 'border-indigo-500' : 'border-transparent'}`}>
                        <div className="h-16 sm:h-20 bg-slate-950 rounded-lg p-2 flex flex-col gap-1.5 shadow-inner">
                          <div className="h-2 w-1/3 bg-slate-800 rounded" />
                          <div className="grid grid-cols-3 gap-1">
                            <div className="h-6 sm:h-8 bg-slate-900 border border-slate-800 rounded-sm" />
                            <div className="h-6 sm:h-8 bg-slate-900 border border-slate-800 rounded-sm col-span-2" />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-center text-slate-500 dark:text-slate-400">Dark Mode</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASSWORD & SECURITY ──────────────── */}
              {tab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Password &amp; Security</h2>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Update your login credentials and security rules.</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Password</label>
                      <input type="password" placeholder="••••••••" className="form-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Password</label>
                      <input type="password" placeholder="••••••••" className="form-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="form-input" />
                    </div>
                  </div>

                  <div className="h-px bg-white/40 dark:bg-white/5" />

                  {/* 2FA toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/5 max-w-xl">
                    <div className="pr-4">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                        Adds an extra layer of security to your account login.
                      </p>
                    </div>
                    <button onClick={() => setIs2FA(!is2FA)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 flex items-center shrink-0 ${
                        is2FA ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                      }`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-md transition-all" />
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>

          {/* Footer */}
          <footer className="h-16 shrink-0 border-t border-white/40 dark:border-white/10 px-4 sm:px-6 flex items-center justify-end gap-3">
            {/* Status message */}
            {statusMsg && (
              <span className={`text-xs font-bold mr-auto ${
                statusMsg.type === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}>
                {statusMsg.text}
              </span>
            )}

            <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed
                         ${saved ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </footer>
        </div>
      </Layout>
    </>
  );
}
