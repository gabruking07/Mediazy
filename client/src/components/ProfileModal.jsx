import { Loader2, Lock, Mail, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfileModal({ open, user, loading, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (!open || !user) return;

    setForm({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: ''
    });
  }, [open, user]);

  if (!open || !user) return null;

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
            <p className="text-xl font-black text-white">Profile</p>
            <p className="mt-1 text-sm text-slate-400">Update your name, email, or password.</p>
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
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
              placeholder="Email"
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className="relative block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
              placeholder="Current password for email/password change"
              type="password"
              value={form.currentPassword}
              onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
            />
          </label>
          <label className="relative block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-brand/70"
              minLength={8}
              placeholder="New password"
              type="password"
              value={form.newPassword}
              onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
            />
          </label>
        </div>

        <button
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-ink transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Save changes
        </button>
      </form>
    </div>
  );
}
