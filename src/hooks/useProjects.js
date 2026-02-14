import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

/**
 * Custom hook to fetch the list of projects.
 * It handles loading, error, and data states internally.
 * @returns {{projects: Array, loading: boolean, error: object|null}}
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/project/');
      setProjects(response.data.results || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error };
};
