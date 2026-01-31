import { HiExclamationCircle, HiChevronDown } from 'react-icons/hi';

export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  icon: Icon,
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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Icon className={`w-5 h-5 transition-colors ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
          </div>
        )}
        <select
          className={`
            w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 rounded-xl appearance-none
            transition-all duration-200 ease-out
            focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
            hover:border-slate-300 hover:bg-white/70
            ${Icon ? 'pl-12' : ''}
            ${error
              ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-slate-200/50'
            }
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <HiChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
