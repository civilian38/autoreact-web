import api from '@/services/api';

/**
 * 프로젝트의 Generation Session 목록을 가져옵니다.
 * @param {string|number} projectId
 */
export const getSessionList = async (projectId) => {
  const response = await api.get(`/generation/sessions/${projectId}/`);
  return response.data;
};

/**
 * 새로운 Generation Session을 생성합니다.
 * @param {string|number} projectId
 * @param {object} data - { title, related_apidocs, related_pages, related_files, related_discussions }
 */
export const createSession = async (projectId, data) => {
  const response = await api.post(`/generation/sessions/${projectId}/`, data);
  return response.data;
};
