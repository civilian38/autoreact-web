import { useState, useEffect, useCallback } from 'react';
import { getProjectDetail, updateProject as updateProjectService, deleteProject as deleteProjectService } from '@/services/projectService';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to fetch and manage the state for a single project's details.
 * @param {string | number} projectId - The ID of the project to fetch.
 * @returns {{project: object | null, loading: boolean, error: Error | null, refetch: function, updateProject: function, deleteProject: function}}
 */
export const useProjectDetail = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const updateProject = async (projectData) => {
    try {
      const updatedProject = await updateProjectService(projectId, projectData);
      setProject(updatedProject);
      return updatedProject;
    } catch (e) {
      console.error('Failed to update project:', e);
      throw e; // Re-throw to be caught in the component
    }
  };

  const deleteProject = async () => {
    try {
      await deleteProjectService(projectId);
      navigate('/home');
    } catch (e) {
      console.error('Failed to delete project:', e);
      throw e; // Re-throw to be caught in the component
    }
  };

  return { project, loading, error, refetch: fetchProject, updateProject, deleteProject };
};
