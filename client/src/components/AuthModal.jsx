import { Loader2, Lock, Mail, Phone, UserRound, X } from 'lucide-react';
import { useState } from 'react';

export default function AuthModal({ open, mode, setMode, loading, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  if (!open) return null;

  const isSignup = mode === 'signup';

  return (
    <div className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-slate-950/75 px-3 py-4 backdrop-blur-sm sm:place-items-center sm:px-4 sm:py-6">
      <form
        className="glass w-full max-w-md rounded-2xl p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xl font-black text-white">{isSignup ? 'Create account' : 'Login'}</p>
            <p className="mt-1 text-sm text-slate-400">Login to manage your account and history.</p>
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:border-brand/60 hover:text-white"
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3">
          {isSignup && (
            <>
              <label className="relative block">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
                  maxLength={80}
                  minLength={2}
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label className="relative block">
                <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
                  inputMode="tel"
                  placeholder="Phone number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>
            </>
          )}
          <label className="relative block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
              inputMode={isSignup ? 'email' : 'text'}
              placeholder={isSignup ? 'Email' : 'Email or phone number'}
              required
              type={isSignup ? 'email' : 'text'}
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className="relative block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
              minLength={isSignup ? 8 : undefined}
              placeholder={isSignup ? 'Password with letter and number' : 'Password'}
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>
        </div>

        <button
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-ink transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {isSignup ? 'Sign up' : 'Login'}
        </button>

        <button
          className="mt-4 w-full text-sm font-semibold text-slate-300 transition hover:text-white"
          type="button"
          onClick={() => setMode(isSignup ? 'login' : 'signup')}
        >
          {isSignup ? 'Already have an account? Login' : 'New here? Create an account'}
        </button>
      </form>
    </div>
  );
}
