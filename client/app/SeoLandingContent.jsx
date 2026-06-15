export default function SeoLandingContent({ page }) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-3 pb-12 sm:px-5">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <div className="grid gap-3">
          <h2 className="text-2xl font-black leading-tight text-white">{page.title}</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            {page.description}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <h3 className="font-bold text-white">Paste a public link</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Mediazy reads supported public media URLs and prepares available download options.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <h3 className="font-bold text-white">Choose the output</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Select video, MP3 audio, subtitles, thumbnail, or the best available quality.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <h3 className="font-bold text-white">Save and share</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Save the prepared file and share Mediazy with friends who need a simple downloader.
            </p>
          </div>
        </div>
        <div className="grid gap-3">
          <h2 className="text-xl font-black text-white">Frequently asked questions</h2>
          <details className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <summary className="cursor-pointer font-bold text-white">Which links work with Mediazy?</summary>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Mediazy supports public links from platforms handled by the configured extractors, including common social video, reel, audio, subtitle, and thumbnail sources.
            </p>
          </details>
          <details className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
            <summary className="cursor-pointer font-bold text-white">Why do some links fail?</summary>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Some platforms block automated requests, require login cookies, restrict private media, or remove formats. Public, accessible links work best.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
