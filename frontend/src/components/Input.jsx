import { HiExclamationCircle } from 'react-icons/hi';

export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  icon: Icon,
  helper,
  required,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 transition-colors ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
          </div>
        )}
        <input
          type={type}
          className={`
            w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl
            transition-all duration-200 ease-out
            placeholder:text-slate-400
            focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
            hover:border-slate-300 hover:bg-white/70
            ${Icon ? 'pl-12' : ''}
            ${error
              ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-slate-200/50'
            }
          `}
          {...props}
        />
        {/* Focus glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/0 via-teal-500/0 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ filter: 'blur(8px)', transform: 'scale(1.02)' }} />
      </div>
      {error && (
        <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="mt-2 text-sm text-slate-500">{helper}</p>
      )}
    </div>
  );
}
