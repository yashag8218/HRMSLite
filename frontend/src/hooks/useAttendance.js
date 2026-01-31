import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { attendanceAPI } from '../services/api';

export function useAttendance(filterDate = '') {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await attendanceAPI.getAll(filterDate || null);
      setAttendanceRecords(response.data || []);
    } catch {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return { attendanceRecords, loading, refetch: fetchAttendance };
}

export function useEmployeeHistory() {
  const [employeeHistory, setEmployeeHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchHistory = useCallback(async (employeeId) => {
    setHistoryLoading(true);
    setIsOpen(true);
    try {
      const response = await attendanceAPI.getByEmployee(employeeId);
      setEmployeeHistory(response.data);
    } catch {
      toast.error('Failed to fetch attendance history');
      setIsOpen(false);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const closeHistory = useCallback(() => {
    setIsOpen(false);
    setEmployeeHistory(null);
  }, []);

  return { employeeHistory, historyLoading, isOpen, fetchHistory, closeHistory };
}

export function useMarkAttendance(onSuccess) {
  const [submitting, setSubmitting] = useState(false);

  const markAttendance = useCallback(async (employeeId, date, status) => {
    if (!employeeId) {
      toast.error('Please select an employee');
      return false;
    }
    if (!date) {
      toast.error('Please select a date');
      return false;
    }

    setSubmitting(true);
    try {
      await attendanceAPI.markAttendance({
        employee_id: employeeId,
        date,
        status,
      });
      toast.success(`Attendance marked as ${status}`);
      onSuccess?.();
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to mark attendance');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  return { markAttendance, submitting };
}
