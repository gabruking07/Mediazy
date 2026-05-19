export default function ProgressBar({ progress, label }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="text-slate-400">{Math.min(progress, 100)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-900">
        <div
          className="progress-stripe h-full rounded-full bg-gradient-to-r from-brand via-electric to-ember transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
