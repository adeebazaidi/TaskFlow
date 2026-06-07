export default function StatsCard({ label, value, icon: Icon, color }) {
  const configs = {
    indigo: {
      card: 'bg-white border-slate-200',
      iconWrap: 'bg-indigo-50',
      icon: 'text-indigo-600',
      value: 'text-slate-900',
      label: 'text-slate-500',
    },
    amber: {
      card: 'bg-white border-slate-200',
      iconWrap: 'bg-amber-50',
      icon: 'text-amber-600',
      value: 'text-slate-900',
      label: 'text-slate-500',
    },
    emerald: {
      card: 'bg-white border-slate-200',
      iconWrap: 'bg-emerald-50',
      icon: 'text-emerald-600',
      value: 'text-slate-900',
      label: 'text-slate-500',
    },
  };

  const cfg = configs[color] || configs.indigo;

  return (
    <div className={`${cfg.card} border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs sm:text-sm font-medium ${cfg.label}`}>{label}</span>
        <div className={`w-8 h-8 ${cfg.iconWrap} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon size={16} className={cfg.icon} />
        </div>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${cfg.value} tabular-nums`}>{value}</p>
    </div>
  );
}
