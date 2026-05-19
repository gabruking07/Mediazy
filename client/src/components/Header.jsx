import { DownloadCloud, LogOut, UserRound } from 'lucide-react';

export default function Header({ user, quota, onAuthClick, onLogout, onProfileClick }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-hidden px-4 py-5 sm:px-5 md:flex-row md:items-center md:justify-between md:py-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand text-ink shadow-glow">
          <DownloadCloud size={21} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-black tracking-wide text-white">Mediazy</p>
          <p className="truncate text-xs uppercase tracking-[0.28em] text-slate-400 sm:tracking-[0.32em]">Downloader</p>
        </div>
      </div>
      {user ? (
        <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:grid-cols-[auto_1fr_auto] md:w-auto md:max-w-[620px] md:flex md:flex-wrap md:items-center md:justify-end md:gap-3">
          {quota && (
            <div className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-center text-xs font-semibold text-slate-300 min-[430px]:col-span-2 sm:col-span-1 sm:text-left">
              <span className="text-white">{quota.used}</span> used / <span className="text-brand">{quota.available}</span> left today
            </div>
          )}
          <button
            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-slate-200 transition hover:border-brand/70 hover:text-white md:max-w-56"
            type="button"
            onClick={onProfileClick}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
              <UserRound size={16} />
            </span>
            <span className="truncate">{user.name}</span>
          </button>
          <button
            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-slate-200 transition hover:border-brand/70 hover:text-white"
            type="button"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold text-ink transition hover:bg-emerald-300 sm:w-auto"
          type="button"
          onClick={onAuthClick}
        >
          <UserRound size={17} />
          Login
        </button>
      )}
    </header>
  );
}
