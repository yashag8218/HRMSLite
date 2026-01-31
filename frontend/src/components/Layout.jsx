import { Outlet, useLocation } from 'react-router-dom';
import { HiMenuAlt2, HiBell, HiSearch } from 'react-icons/hi';
import { useState } from 'react';
import Sidebar from './Sidebar';

const getPageTitle = (pathname) => {
  const titles = {
    '/': 'Dashboard',
    '/employees': 'Employees',
    '/attendance': 'Attendance',
  };
  return titles[pathname] || 'Dashboard';
};

const getPageSubtitle = (pathname) => {
  const subtitles = {
    '/': 'Welcome back! Here\'s your workforce overview',
    '/employees': 'Manage your organization\'s workforce',
    '/attendance': 'Track and manage attendance records',
  };
  return subtitles[pathname] || '';
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const sidebarWidth = sidebarOpen ? 280 : 80;

  return (
    <div className="min-h-screen">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} width={sidebarWidth} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        style={{ marginLeft: `${sidebarWidth}px` }}
        className="min-h-screen transition-all duration-500 ease-out"
      >
        {/* Header */}
        <header className="glass sticky top-0 z-20 page-padding-x border-b border-white/20">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-200 group"
              >
                <HiMenuAlt2 className="w-5 h-5 text-slate-600 group-hover:text-teal-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{getPageTitle(location.pathname)}</h2>
                <p className="text-sm text-slate-500">
                  {getPageSubtitle(location.pathname)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
             

              {/* Date Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-teal-700">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-padding animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
