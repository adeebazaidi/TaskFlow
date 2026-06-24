import { CheckSquare } from 'lucide-react';

export default function StatsCard({ label, value, icon: Icon, color, isCompletion }) {
  // Configs for standard vibrant gradient stats cards
  const configs = {
    coral: { // Card 1: Deep Blue (replacing coral key)
      card: 'bg-gradient-to-br from-[#1E5387] to-[#153B60] text-white border-transparent shadow-[0_10px_25px_rgba(30,83,135,0.15)]',
      iconWrap: 'bg-white/20 backdrop-blur-md text-white',
      value: 'text-white',
      label: 'text-white/80',
    },
    teal: { // Card 2: Teal/Cyan
      card: 'bg-gradient-to-br from-[#0C8F8F] to-[#086E6E] text-white border-transparent shadow-[0_10px_25px_rgba(12,143,143,0.15)]',
      iconWrap: 'bg-white/20 backdrop-blur-md text-white',
      value: 'text-white',
      label: 'text-white/80',
    },
    blue: { // Card 3: Dark Navy (replacing blue key)
      card: 'bg-gradient-to-br from-[#144272] to-[#0E3052] text-white border-transparent shadow-[0_10px_25px_rgba(20,66,114,0.15)]',
      iconWrap: 'bg-white/20 backdrop-blur-md text-white',
      value: 'text-white',
      label: 'text-white/80',
    },
  };

  const cfg = configs[color] || configs.coral;

  if (isCompletion) {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (numericValue / 100) * circumference;

    return (
      <div className="bg-card border border-border/80 rounded-[22px] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex justify-between gap-4 animate-fade-in relative overflow-hidden group h-[115px] sm:h-[125px]">
        {/* Left side: Label text (z-10 so it overlays the circle) */}
        <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
          <span className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider block">
            {label}
          </span>
          <span />
        </div>

        {/* Small floating blue icon wrap in top right (z-10) */}
        <div className="absolute top-4 right-4 z-10 w-7 h-7 bg-blue-50 dark:bg-slate-800 border border-border/60 text-[#1E5387] rounded-lg flex items-center justify-center shadow-sm">
          <CheckSquare size={14} className="stroke-[2.5]" />
        </div>

        {/* Right side: Circular Progress Ring (z-0, absolute positioned behind/below the text elements) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-0 w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-[#1E5387] transition-all duration-700 ease-out"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Centered percentage text inside the circle */}
          <div className="absolute flex flex-col items-center justify-center select-none">
            <span className="text-lg font-extrabold text-text tracking-tight">{numericValue}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cfg.card} border rounded-[22px] p-4 sm:p-5 animate-fade-in flex flex-col justify-between h-[115px] sm:h-[125px]`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${cfg.label}`}>{label}</span>
        <div className={`w-8 h-8 ${cfg.iconWrap} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon size={16} className="stroke-[2.5]" />
        </div>
      </div>
      <p className={`text-3xl sm:text-4xl font-bold tracking-tight ${cfg.value} tabular-nums`}>{value}</p>
    </div>
  );
}
