import { Gauge, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';

const features = [
  { icon: Gauge, title: 'Fast processing', copy: 'yt-dlp powered extraction with FFmpeg merging.' },
  { icon: ShieldCheck, title: 'Private links', copy: 'Temporary files expire automatically after 10 minutes.' },
  { icon: Smartphone, title: 'Mobile ready', copy: 'Built for quick saves on desktop and phone screens.' },
  { icon: Trash2, title: 'Clean storage', copy: 'Old downloads are removed by a scheduled cleanup job.' }
];

export default function FeatureStrip() {
  return (
    <section className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <article className="glass flex min-w-0 items-start gap-3 rounded-xl p-3 sm:block sm:p-4" key={feature.title}>
            <Icon className="mt-0.5 shrink-0 text-brand sm:mb-3 sm:mt-0" size={20} />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white sm:text-base">{feature.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">{feature.copy}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
