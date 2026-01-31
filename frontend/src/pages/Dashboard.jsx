import { Link } from 'react-router-dom';
import { HiUsers, HiCheck, HiX, HiClock, HiRefresh, HiArrowRight, HiCalendar, HiChartBar, HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Card, Table, Button } from '../components';
import { useDashboard } from '../hooks/useDashboard';

ChartJS.register(ArcElement, Tooltip);

export default function Dashboard() {
  const { data, loading, attendanceRate, refetch } = useDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-teal-100 p-8">
          <div className="h-8 skeleton rounded-lg w-64 mb-2"></div>
          <div className="h-4 skeleton rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/70 rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 skeleton rounded-xl"></div>
                <div className="h-4 w-16 skeleton rounded"></div>
              </div>
              <div className="h-8 skeleton rounded w-20 mb-2"></div>
              <div className="h-4 skeleton rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsColumns = [
    {
      key: 'employee_code',
      label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-teal-500/20">
            {row.employee_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{row.employee_name}</p>
            <p className="text-sm text-slate-400">{row.employee_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'present_days',
      label: 'Present Days',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <HiCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-700">{row.present_days}</span>
            <span className="text-emerald-600 text-sm">days</span>
          </div>
        </div>
      ),
    },
    {
      key: 'attendance_rate',
      label: 'Performance',
      render: (row) => {
        const rate = row.present_days > 0 ? Math.min(100, row.present_days * 5) : 0;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${rate}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-slate-600">{rate}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-2xl shadow-xl shadow-teal-500/20 p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mb-24 -ml-24"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <HiSparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <span className="text-sm font-medium text-white/90">{getGreeting()}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to HRMS Lite</h1>
            <p className="text-white/80">Manage your workforce efficiently and effectively</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-0.5">
                <HiCalendar className="w-4 h-4" />
                <span>Today</span>
              </div>
              <p className="text-lg font-bold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Button
              onClick={refetch}
              variant="secondary"
              className="!bg-white/20 !text-white hover:!bg-white/30 !border-white/20 backdrop-blur-sm"
            >
              <HiRefresh className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card
          title="Total Employees"
          value={data?.total_employees || 0}
          icon={HiUsers}
          color="teal"
        />
        <Card
          title="Present Today"
          value={data?.today?.present || 0}
          icon={HiCheck}
          color="green"
          subtitle={`${attendanceRate}% attendance rate`}
        />
        <Card
          title="Absent Today"
          value={data?.today?.absent || 0}
          icon={HiX}
          color="red"
          subtitle={`of ${data?.total_employees || 0} employees`}
        />
        <Card
          title="Not Marked"
          value={data?.today?.not_marked || 0}
          icon={HiClock}
          color="yellow"
          subtitle="Pending attendance"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-teal-500/25">
                <HiChartBar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Today's Attendance</h2>
                <p className="text-sm text-slate-500">Real-time attendance overview</p>
              </div>
            </div>
          </div>

          {data?.total_employees > 0 ? (
            <div className="space-y-5">
              {/* Present Bar */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    <span className="font-medium text-slate-700">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-800">{data?.today?.present || 0}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((data?.today?.present / data?.total_employees) * 100) || 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.round((data?.today?.present / data?.total_employees) * 100) || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Absent Bar */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-red-500"></div>
                    <span className="font-medium text-slate-700">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-800">{data?.today?.absent || 0}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((data?.today?.absent / data?.total_employees) * 100) || 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-red-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.round((data?.today?.absent / data?.total_employees) * 100) || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Not Marked Bar */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <span className="font-medium text-slate-700">Not Marked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-800">{data?.today?.not_marked || 0}</span>
                    <span className="text-sm text-slate-500">
                      ({Math.round((data?.today?.not_marked / data?.total_employees) * 100) || 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.round((data?.today?.not_marked / data?.total_employees) * 100) || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <Doughnut
                      data={{
                        datasets: [{
                          data: [attendanceRate, 100 - attendanceRate],
                          backgroundColor: ['#14b8a6', '#f1f5f9'],
                          borderWidth: 0,
                          cutout: '75%',
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: { tooltip: { enabled: false } },
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">{attendanceRate}%</span>
                      <span className="text-xs text-slate-500">Attendance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <HiUsers className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Employees Yet</h3>
              <p className="text-slate-500 mb-4">Add employees to start tracking attendance</p>
              <Link to="/employees">
                <Button variant="primary">
                  <HiUsers className="w-4 h-4" />
                  Add Employees
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/employees"
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 border border-teal-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                    <HiUsers className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Manage Employees</span>
                    <p className="text-sm text-slate-500">Add, view, or remove</p>
                  </div>
                </div>
                <HiArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/attendance"
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl hover:from-emerald-100 hover:to-green-100 transition-all duration-300 border border-emerald-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                    <HiCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Mark Attendance</span>
                    <p className="text-sm text-slate-500">Record daily status</p>
                  </div>
                </div>
                <HiArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-5 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <HiLightningBolt className="w-5 h-5 text-teal-400" />
                <h2 className="font-bold">Quick Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-slate-400">Total Employees</span>
                  <span className="text-2xl font-bold">{data?.total_employees || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-slate-400">Attendance Rate</span>
                  <span className="text-2xl font-bold text-teal-400">{attendanceRate}%</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400">Pending Actions</span>
                  <span className="text-2xl font-bold text-amber-400">{data?.today?.not_marked || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Statistics Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-teal-500/25">
                <HiChartBar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Employee Statistics</h2>
                <p className="text-sm text-slate-500">All-time attendance records</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-100">
              {data?.employee_stats?.length || 0} employees
            </span>
          </div>
        </div>
        <div className="p-6">
          <Table
            columns={statsColumns}
            data={data?.employee_stats || []}
            loading={loading}
            emptyMessage="No attendance data available yet. Start marking attendance to see statistics here."
          />
        </div>
      </div>
    </div>
  );
}
