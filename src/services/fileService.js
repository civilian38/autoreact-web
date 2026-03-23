import api from '@/services/api';

/**
 * 프로젝트에서 다루는 새로운 파일을 생성합니다.
 * @param {object} data - { name: string, folder: number, content: string, project_under: number }
 */
export const createFile = async (data) => {
  try {
    const response = await api.post(`/frontfiles/projectfile/create/`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
};

/**
 * 특정 파일의 상세 정보를 가져옵니다.
 * @param {string|number} fileId 
 */
export const getFileDetail = async (fileId) => {
  try {
    const response = await api.get(`/frontfiles/projectfile/${fileId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching file detail for ${fileId}:`, error);
    throw error;
  }
};

/**
 * 특정 파일을 수정합니다. (PATCH 활용)
 * @param {string|number} fileId 
 * @param {object} data - { name?: string, folder?: number, content?: string, is_required?: boolean }
 */
export const updateFile = async (fileId, data) => {
  try {
    const response = await api.patch(`/frontfiles/projectfile/${fileId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating file ${fileId}:`, error);
    throw error;
  }
};

/**
 * 특정 파일을 삭제합니다.
 * @param {string|number} fileId 
 */
export const deleteFile = async (fileId) => {
  try {
    await api.delete(`/frontfiles/projectfile/${fileId}/`);
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    throw error;
  }
};
