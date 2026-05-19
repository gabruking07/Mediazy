import { Gauge, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';

const features = [
  { icon: Gauge, title: 'Fast processing', copy: 'yt-dlp powered extraction with FFmpeg merging.' },
  { icon: ShieldCheck, title: 'Private links', copy: 'Temporary files expire automatically after 10 minutes.' },
  { icon: Smartphone, title: 'Mobile ready', copy: 'Built for quick saves on desktop and phone screens.' },
  { icon: Trash2, title: 'Clean storage', copy: 'Old downloads are removed by a scheduled cleanup job.' }
];

export default function FeatureStrip() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <article className="glass min-w-0 rounded-xl p-4" key={feature.title}>
            <Icon className="mb-3 text-brand" size={22} />
            <h3 className="font-bold text-white">{feature.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">{feature.copy}</p>
          </article>
        );
      })}
    </section>
  );
}
