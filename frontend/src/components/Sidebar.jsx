import { NavLink } from 'react-router-dom';
import { HiHome, HiUsers, HiCalendar, HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi';

const navItems = [
  { path: '/', icon: HiHome, label: 'Dashboard', description: 'Overview & Analytics' },
  { path: '/employees', icon: HiUsers, label: 'Employees', description: 'Team Management' },
  { path: '/attendance', icon: HiCalendar, label: 'Attendance', description: 'Track Records' },
];

export default function Sidebar({ isOpen, width, onToggle }) {
  return (
    <aside
      style={{ width: `${width}px` }}
      className="fixed left-0 top-0 h-full transition-all duration-500 ease-out z-50"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-110 transition-all duration-300 z-50"
      >
        {isOpen ? (
          <HiChevronLeft className="w-4 h-4" />
        ) : (
          <HiChevronRight className="w-4 h-4" />
        )}
      </button>

      <div className="relative h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div className="animate-fadeIn">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  HRMS <span className="text-teal-400">Lite</span>
                </h1>
                <p className="text-xs text-slate-500">Workforce Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1.5">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ animationDelay: `${index * 50}ms` }}
                className={({ isActive }) =>
                  `flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-300 group relative animate-fadeIn ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-white border border-teal-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-r-full" />
                    )}

                    <div className={`${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-400'} transition-colors`}>
                      <item.icon className={`w-5 h-5 ${isOpen ? 'mr-3' : ''}`} />
                    </div>

                    {isOpen && (
                      <div className="animate-fadeIn flex-1">
                        <span className="font-semibold text-sm block">{item.label}</span>
                        <p className={`text-xs ${isActive ? 'text-teal-400/70' : 'text-slate-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-slate-700 z-50">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.description}</div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700" />
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 transition-all cursor-pointer group`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                A
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            {isOpen && (
              <div className="animate-fadeIn flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">Super Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
