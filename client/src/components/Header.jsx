import { DownloadCloud, HelpCircle, Home, Instagram, LogOut, Mail, UserRound } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'stories', label: 'Stories', icon: Instagram },
  { id: 'how-to-use', label: 'How to use', icon: HelpCircle },
  { id: 'contact', label: 'Contact us', icon: Mail }
];

export default function Header({
  user,
  quota,
  activePage,
  onNavigate,
  onAuthClick,
  onLogout,
  onProfileClick
}) {
  return (
    <header className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl flex-col gap-3 border-b border-white/10 bg-slate-950/90 px-3 py-3 backdrop-blur-xl sm:px-5 md:static md:border-b-0 md:bg-transparent md:py-6 md:backdrop-blur-0">
      <div className="flex w-full min-w-0 flex-row items-center justify-between gap-3">
        <button className="flex min-w-0 items-center gap-3 text-left" type="button" onClick={() => onNavigate('home')}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-ink shadow-glow sm:h-10 sm:w-10">
            <DownloadCloud size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black tracking-wide text-white sm:text-xl">Mediazy</p>
            <p className="truncate text-[10px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs sm:tracking-[0.32em]">Downloader</p>
          </div>
        </button>
        {user ? (
          <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 md:max-w-[620px] md:flex-wrap md:gap-3">
            {quota && (
              <div className="rounded-lg border border-white/10 bg-white/8 px-2 py-2 text-center text-[11px] font-semibold text-slate-300 sm:px-3 sm:text-left sm:text-xs">
                <span className="text-brand">Unlimited</span> downloads
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
          <div className="flex shrink-0 items-center justify-end gap-2">
            {quota && (
              <div className="rounded-lg border border-white/10 bg-white/8 px-2 py-2 text-[11px] font-semibold text-slate-300 sm:px-3 sm:text-xs">
                <span className="text-brand">Unlimited</span> downloads
              </div>
            )}
            <button
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-3 text-sm font-bold text-ink transition hover:bg-emerald-300 sm:h-10 sm:px-4"
              type="button"
              onClick={onAuthClick}
            >
              <UserRound size={17} />
              Login
            </button>
          </div>
        )}
      </div>
      <nav className="-mx-3 flex w-[calc(100%+1.5rem)] min-w-0 gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:w-full sm:px-0">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${
              activePage === id
                ? 'border-brand/60 bg-brand/15 text-white'
                : 'border-white/10 bg-white/8 text-slate-300 hover:border-brand/50 hover:text-white'
            }`}
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
