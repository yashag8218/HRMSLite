import { useState } from 'react';
import { HiCheck, HiX, HiCalendar, HiRefresh, HiClipboardList, HiUserGroup, HiClock } from 'react-icons/hi';
import { Button, Table, Modal, Card } from '../components';
import { useEmployees } from '../hooks/useEmployees';
import { useAttendance, useEmployeeHistory, useMarkAttendance } from '../hooks/useAttendance';

export default function Attendance() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState('');

  const { employees, loading: employeesLoading } = useEmployees();
  const { attendanceRecords, loading: attendanceLoading, refetch: refetchAttendance } = useAttendance(filterDate);
  const { employeeHistory, historyLoading, isOpen: isHistoryModalOpen, fetchHistory, closeHistory } = useEmployeeHistory();
  const { markAttendance: submitAttendance, submitting } = useMarkAttendance(() => {
    setSelectedEmployee('');
    refetchAttendance();
  });

  const loading = employeesLoading || attendanceLoading;

  const handleMarkAttendance = (status) => {
    submitAttendance(selectedEmployee, selectedDate, status);
  };

  const getStatusBadge = (status) => {
    if (status === 'Present') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Present
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        Absent
      </span>
    );
  };

  const attendanceColumns = [
    {
      key: 'employee_code',
      label: 'Employee ID',
      render: (row) => (
        <span className="font-mono text-sm bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">
          {row.employee_code}
        </span>
      ),
    },
    {
      key: 'employee_name',
      label: 'Employee Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-teal-500/20">
            {row.employee_name?.charAt(0) || '?'}
          </div>
          <span className="font-semibold text-slate-800">{row.employee_name}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-600">
          <HiCalendar className="w-4 h-4 text-slate-400" />
          {new Date(row.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
  ];

  const employeeColumns = [
    {
      key: 'employee_id',
      label: 'Employee ID',
      render: (row) => (
        <span className="font-mono text-sm bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">
          {row.employee_id}
        </span>
      ),
    },
    {
      key: 'full_name',
      label: 'Full Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-violet-500/20">
            {row.full_name?.charAt(0) || '?'}
          </div>
          <span className="font-semibold text-slate-800">{row.full_name}</span>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          {row.department}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => fetchHistory(row.id)}>
          <HiClipboardList className="w-4 h-4" />
          View History
        </Button>
      ),
    },
  ];

  const selectedEmp = employees.find(e => e.id === selectedEmployee);

  return (
    <div className="space-y-8">
      {/* Mark Attendance Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <HiCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mark Attendance</h2>
              <p className="text-teal-100 text-sm">Record daily attendance for employees</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Employee Select */}
            <div className="lg:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Employee <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-700 font-medium"
              >
                <option value="">Choose an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_id} - {emp.full_name}
                  </option>
                ))}
              </select>
              {selectedEmp && (
                <div className="mt-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-teal-500/25">
                      {selectedEmp.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{selectedEmp.full_name}</p>
                      <p className="text-sm text-slate-500">{selectedEmp.department}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date Select */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-700 font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-4 flex items-end gap-3">
              <Button
                variant="success"
                size="lg"
                onClick={() => handleMarkAttendance('Present')}
                loading={submitting}
                disabled={!selectedEmployee || !selectedDate}
                className="flex-1"
              >
                <HiCheck className="w-5 h-5" />
                Present
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={() => handleMarkAttendance('Absent')}
                loading={submitting}
                disabled={!selectedEmployee || !selectedDate}
                className="flex-1"
              >
                <HiX className="w-5 h-5" />
                Absent
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-teal-500/25">
              <HiClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Attendance Records</h2>
              <p className="text-slate-500 text-sm">View and filter attendance history</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-medium text-slate-700"
                placeholder="Filter by date"
              />
            </div>
            {filterDate && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setFilterDate('')}
              >
                <HiRefresh className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
        <Table
          columns={attendanceColumns}
          data={attendanceRecords}
          loading={loading}
          emptyMessage="No attendance records found. Start by marking attendance above."
        />
      </div>

      {/* Employee Attendance History Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white shadow-lg shadow-violet-500/25">
            <HiUserGroup className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Employee History</h2>
            <p className="text-slate-500 text-sm">View detailed attendance history per employee</p>
          </div>
        </div>
        <Table
          columns={employeeColumns}
          data={employees}
          loading={loading}
          emptyMessage="No employees found. Add employees first to track attendance."
        />
      </div>

      {/* Employee History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={closeHistory}
        title="Attendance History"
        size="lg"
        icon={HiClipboardList}
      >
        {historyLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl mb-4 border border-teal-100">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-200 border-t-teal-600"></div>
            </div>
            <p className="text-slate-500 font-medium">Loading attendance history...</p>
          </div>
        ) : employeeHistory ? (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/25">
                  {employeeHistory.employee.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {employeeHistory.employee.full_name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">
                      {employeeHistory.employee.employee_id}
                    </span>
                    <span>•</span>
                    <span>{employeeHistory.employee.department}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card
                title="Total Days"
                value={employeeHistory.stats.total_days}
                icon={HiCalendar}
                color="blue"
              />
              <Card
                title="Present"
                value={employeeHistory.stats.present_days}
                icon={HiCheck}
                color="green"
              />
              <Card
                title="Absent"
                value={employeeHistory.stats.absent_days}
                icon={HiX}
                color="red"
              />
            </div>

            {/* Attendance Records */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <HiClock className="w-5 h-5 text-slate-400" />
                Recent Records
              </h4>
              {employeeHistory.records.length > 0 ? (
                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                      {employeeHistory.records.map((record) => (
                        <tr key={record.id} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100">
                  <HiClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No attendance records found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="secondary" onClick={closeHistory}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
