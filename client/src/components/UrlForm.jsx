import { Clipboard, Link, Loader2, Search } from 'lucide-react';
import { useRef } from 'react';

export default function UrlForm({
  url,
  setUrl,
  onSubmit,
  loading,
  selectedPlatform,
  isPlatformUrl,
  onInvalidPlatformUrl,
  onPasteUnavailable
}) {
  const inputRef = useRef(null);
  const platformName = selectedPlatform.label;

  const setPlatformUrl = (text) => {
    const nextUrl = text.trim();

    if (nextUrl && !isPlatformUrl(nextUrl)) {
      onInvalidPlatformUrl();
      return false;
    }

    setUrl(text);
    return true;
  };

  const pasteFromClipboard = async () => {
    if (!navigator.clipboard?.readText) {
      inputRef.current?.focus();
      onPasteUnavailable();
      return;
    }

    try {
      const text = await navigator.clipboard.readText();

      if (!text.trim()) {
        inputRef.current?.focus();
        onPasteUnavailable();
        return;
      }

      setPlatformUrl(text);
    } catch {
      inputRef.current?.focus();
      onPasteUnavailable();
    }
  };

  return (
    <form className="glass grid gap-3 rounded-2xl p-3 sm:grid-cols-[1fr_auto_auto] sm:gap-4 sm:p-5" id="download" onSubmit={onSubmit}>
      <label className="relative block min-w-0">
        <Link className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          ref={inputRef}
          className="h-12 w-full rounded-xl border border-white/10 bg-white/8 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-brand/70 focus:bg-white/10 sm:h-14"
          placeholder={`Paste a ${platformName} link`}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onPaste={(event) => {
            const text = event.clipboardData.getData('text');

            if (text) {
              event.preventDefault();
              setPlatformUrl(text);
            }
          }}
        />
      </label>
      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 font-semibold text-slate-200 transition hover:border-brand/60 hover:text-white sm:h-14"
        type="button"
        onClick={pasteFromClipboard}
      >
        <Clipboard size={18} />
        Paste
      </button>
      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 font-bold text-ink transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14"
        disabled={loading}
        type="submit"
      >
        {loading ? <Loader2 className="animate-spin" size={19} /> : <Search size={19} />}
        Analyze
      </button>
    </form>
  );
}
