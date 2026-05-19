import { DownloadCloud, LogOut, UserRound } from 'lucide-react';

export default function Header({ user, quota, onAuthClick, onLogout, onProfileClick }) {
  return (
    <header className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl flex-row items-center justify-between gap-3 overflow-hidden border-b border-white/10 bg-slate-950/82 px-3 py-3 backdrop-blur-xl sm:px-5 md:static md:border-b-0 md:bg-transparent md:py-6 md:backdrop-blur-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-ink shadow-glow sm:h-10 sm:w-10">
          <DownloadCloud size={20} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-wide text-white sm:text-xl">Mediazy</p>
          <p className="truncate text-[10px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs sm:tracking-[0.32em]">Downloader</p>
        </div>
      </div>
      {user ? (
        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 md:max-w-[620px] md:flex-wrap md:gap-3">
          {quota && (
            <div className="hidden rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-center text-xs font-semibold text-slate-300 sm:block sm:text-left">
              <span className="text-white">{quota.used}</span> used / <span className="text-brand">{quota.available}</span> left today
            </div>
          )}
          <button
            className="inline-flex h-9 min-w-0 max-w-28 items-center justify-center gap-2 rounded-lg border border-white/15 px-2 text-sm font-semibold text-slate-200 transition hover:border-brand/70 hover:text-white sm:h-10 sm:max-w-56 sm:px-3"
            type="button"
            onClick={onProfileClick}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
              <UserRound size={16} />
            </span>
            <span className="truncate">{user.name}</span>
          </button>
          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/15 text-slate-200 transition hover:border-brand/70 hover:text-white sm:inline-flex sm:h-10 sm:w-auto sm:gap-2 sm:px-3"
            type="button"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      ) : (
        <button
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-3 text-sm font-bold text-ink transition hover:bg-emerald-300 sm:h-10 sm:px-4"
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
