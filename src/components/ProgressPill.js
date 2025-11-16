export default function ProgressPill({ percent=0 }) {
  const color = percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-400' : 'bg-sky-400';
  return (
    <div className="text-xs inline-flex items-center gap-2">
      <div className={`w-20 h-2 rounded ${color}`} style={{ width: `${Math.min(100, percent)}%` }} />
      <div className="text-slate-600">{percent}%</div>
    </div>
  );
}
