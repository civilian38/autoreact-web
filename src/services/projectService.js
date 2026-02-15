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

/**
 * Creates a new project.
 * @param {object} projectData - The data for the new project.
 * @returns {Promise<object>} The created project data.
 * @throws Will throw an error if the API request fails.
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/project/', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Updates an existing project.
 * @param {string | number} projectId - The ID of the project to update.
 * @param {object} projectData - The data to update.
 * @returns {Promise<object>} The updated project data.
 * @throws Will throw an error if the API request fails.
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/project/${projectId}/`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project for ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Deletes a project.
 * @param {string | number} projectId - The ID of the project to delete.
 * @returns {Promise<void>}
 * @throws Will throw an error if the API request fails.
 */
export const deleteProject = async (projectId) => {
  try {
    await api.delete(`/project/${projectId}/`);
  } catch (error) {
    console.error(`Error deleting project for ID ${projectId}:`, error);
    throw error;
  }
};
