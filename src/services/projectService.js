import api from '@/services/api';

/**
 * Fetches the details for a specific project by its ID.
 * @param {string | number} projectId - The ID of the project to fetch.
 * @returns {Promise<object>} The project data.
 * @throws Will throw an error if the API request fails.
 */
export const getProjectDetail = async (projectId) => {
  try {
    const response = await api.get(`/project/${projectId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project detail for ID ${projectId}:`, error);
    throw error;
  }
};
