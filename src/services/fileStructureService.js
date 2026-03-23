import api from '@/services/api';

/**
 * 프로젝트의 폴더 및 파일 구조를 가져옵니다.
 * @param {string|number} projectId 
 */
export const getFolderStructure = async (projectId) => {
  try {
    const response = await api.get(`/frontfiles/${projectId}/folders/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching folder structure for project ${projectId}:`, error);
    throw error;
  }
};

/**
 * 새 폴더를 생성합니다.
 * @param {string|number} projectId 
 * @param {object} data - { name: string, parent_folder: number }
 */
export const createFolder = async (projectId, data) => {
  try {
    const response = await api.post(`/frontfiles/${projectId}/folders/`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

/**
 * 폴더의 이름이나 위치를 수정합니다. (PATCH 활용)
 * @param {string|number} folderId 
 * @param {object} data - { name?: string, parent_folder?: number }
 */
export const updateFolder = async (folderId, data) => {
  try {
    const response = await api.patch(`/frontfiles/folder/${folderId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating folder ${folderId}:`, error);
    throw error;
  }
};

/**
 * 폴더를 삭제합니다.
 * @param {string|number} folderId 
 */
export const deleteFolder = async (folderId) => {
  try {
    await api.delete(`/frontfiles/folder/${folderId}/`);
  } catch (error) {
    console.error(`Error deleting folder ${folderId}:`, error);
    throw error;
  }
};
