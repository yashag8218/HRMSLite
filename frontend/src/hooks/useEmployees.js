import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../services/api';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data || []);
    } catch {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, loading, refetch: fetchEmployees };
}

export function useCreateEmployee(onSuccess) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const createEmployee = useCallback(async (formData) => {
    setSubmitting(true);
    try {
      await employeeAPI.create(formData);
      toast.success('Employee added successfully');
      setErrors({});
      onSuccess?.();
      return true;
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      }
      toast.error(error.message || 'Failed to add employee');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  const clearErrors = useCallback(() => setErrors({}), []);

  return { createEmployee, submitting, errors, setErrors, clearErrors };
}

export function useDeleteEmployee(onSuccess) {
  const [submitting, setSubmitting] = useState(false);

  const deleteEmployee = useCallback(async (employeeId) => {
    setSubmitting(true);
    try {
      await employeeAPI.delete(employeeId);
      toast.success('Employee deleted successfully');
      onSuccess?.();
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to delete employee');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  return { deleteEmployee, submitting };
}
