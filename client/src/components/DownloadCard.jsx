import { BadgeCheck, Clock, FileAudio, FileText, ImageDown, Loader2, Music, Video } from 'lucide-react';
import { formatBytes } from '../utils/format.js';
import ProgressBar from './ProgressBar.jsx';

export default function DownloadCard({
  info,
  quality,
  setQuality,
  type,
  setType,
  onDownload,
  downloading,
  progress,
  result
}) {
  if (!info) return null;

  return (
    <section className="glass grid min-w-0 gap-4 rounded-2xl p-3 sm:p-4 md:grid-cols-[minmax(220px,320px)_1fr] md:gap-5 md:p-5">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        {info.thumbnail ? (
          <img className="aspect-video h-full w-full object-cover" src={info.thumbnail} alt={info.title} />
        ) : (
          <div className="grid aspect-video place-items-center text-slate-500">No preview</div>
        )}
      </div>

      <div className="grid min-w-0 gap-4 md:gap-5">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
              <BadgeCheck size={14} />
              {info.platform}
            </span>
            {info.isShortForm && (
              <span className="rounded-full bg-ember/15 px-3 py-1 text-xs font-semibold text-orange-200">
                Reel / Short
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
              <Clock size={14} />
              {info.durationText}
            </span>
          </div>
          <h2 className="break-words text-lg font-black leading-tight text-white sm:text-xl md:text-2xl">{info.title}</h2>
          {info.uploader && <p className="mt-2 break-words text-sm text-slate-400">{info.uploader}</p>}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-300">
            Format
            <select
              className="h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-brand/70"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="video">MP4 video</option>
              <option value="audio">MP3 audio</option>
              <option value="subtitles">Subtitles</option>
              <option value="thumbnail">Thumbnail image</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-300">
            Quality
            <select
              className="h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-brand/70 disabled:opacity-50"
              value={quality}
              disabled={type !== 'video'}
              onChange={(event) => setQuality(event.target.value)}
            >
              <option value="best">Best available</option>
              {info.qualities.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {downloading && <ProgressBar progress={progress} label="Preparing secure download" />}

        {result && (
          <div className="min-w-0 rounded-xl border border-brand/25 bg-brand/10 p-3 sm:p-4">
            <p className="font-semibold text-white">Ready to download</p>
            <p className="mt-1 break-words text-sm text-slate-300">
              {result.fileName} · {formatBytes(result.fileSize)} · expires in {result.expiresInMinutes} minutes
            </p>
            <a
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-ink transition hover:bg-emerald-300 sm:w-auto"
              href={result.downloadUrl}
              download
            >
              <FileText size={18} />
              Save file
            </a>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-4">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-ink transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
            disabled={downloading}
            onClick={onDownload}
            type="button"
          >
            {downloading ? <Loader2 className="animate-spin" size={18} /> : <Video size={18} />}
            Download
          </button>
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-slate-200" type="button" onClick={() => setType('audio')}>
            <Music size={17} />
            MP3
          </button>
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-slate-200" type="button" onClick={() => setType('thumbnail')}>
            <ImageDown size={17} />
            Image
          </button>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <FileAudio size={14} />
            Audio extraction
          </span>
          <span className="inline-flex items-center gap-1">
            <FileText size={14} />
            Subtitles {info.hasSubtitles || info.automaticCaptions ? 'available' : 'checked automatically'}
          </span>
        </div>
      </div>
    </section>
  );
}
