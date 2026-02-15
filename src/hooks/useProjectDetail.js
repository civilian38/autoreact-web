import { useState, useEffect, useCallback } from 'react';
import { getProjectDetail } from '@/services/projectService';

/**
 * Custom hook to fetch and manage the state for a single project's details.
 * @param {string | number} projectId - The ID of the project to fetch.
 * @returns {{project: object | null, loading: boolean, error: Error | null}}
 */
export const useProjectDetail = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getProjectDetail(projectId);
      setProject(data);
    } catch (e) {
      setError(e);
      console.error('Failed to fetch project details:', e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error };
};
