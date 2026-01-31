import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

export default function Card({ title, value, icon: Icon, color = 'teal', subtitle, trend, trendUp }) {
  const colorStyles = {
    teal: {
      gradient: 'from-teal-500 to-cyan-500',
      bg: 'bg-teal-500',
      light: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
      shadow: 'shadow-teal-500/20',
    },
    green: {
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      shadow: 'shadow-emerald-500/20',
    },
    red: {
      gradient: 'from-rose-500 to-red-500',
      bg: 'bg-rose-500',
      light: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      shadow: 'shadow-rose-500/20',
    },
    yellow: {
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      shadow: 'shadow-amber-500/20',
    },
    blue: {
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      shadow: 'shadow-blue-500/20',
    },
    indigo: {
      gradient: 'from-indigo-500 to-purple-500',
      bg: 'bg-indigo-500',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      shadow: 'shadow-indigo-500/20',
    },
  };

  const styles = colorStyles[color] || colorStyles.teal;

  return (
    <div className={`relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border ${styles.border} p-5 card-hover group`}>
      {/* Decorative gradient orb */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${styles.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1.5">{subtitle}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {trendUp ? <HiArrowUp className="w-3 h-3" /> : <HiArrowDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <div className={`bg-gradient-to-br ${styles.gradient} p-3.5 rounded-xl shadow-lg ${styles.shadow} group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>
    </div>
  );
}
