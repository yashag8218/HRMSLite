import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { dashboardAPI } from '../services/api';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getSummary();
      setData(response.data);
    } catch {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const attendanceRate = data?.total_employees > 0
    ? Math.round((data?.today?.present / data?.total_employees) * 100) || 0
    : 0;

  return { data, loading, attendanceRate, refetch: fetchDashboard };
}
