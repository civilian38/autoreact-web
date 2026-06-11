import api from '@/services/api';

/**
 * 프로젝트의 Generation Session 목록을 가져옵니다.
 * @param {string|number} projectId
 * @param {string|null} cursorUrl - 다음 페이지 로드를 위한 커서 URL
 */
export const getSessionList = async (projectId, cursorUrl = null) => {
  if (cursorUrl) {
    const urlObj = new URL(cursorUrl);
    let path = urlObj.pathname + urlObj.search;
    if (path.startsWith('/api')) {
      path = path.substring(4); // '/api' 제거
    }
    const response = await api.get(path);
    return response.data;
  }
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

/**
 * 특정 Generation Session에서의 채팅 내역(로그)을 가져옵니다.
 * @param {string|number} sessionId
 */
export const getGenerationLogs = async (sessionId) => {
  const response = await api.get(`/generation/session/${sessionId}/request-generation/`);
  return response.data;
};

/**
 * AI에게 코드를 생성/수정하도록 요청합니다.
 * @param {string|number} sessionId
 * @param {object} data - { content }
 */
export const requestGeneration = async (sessionId, data) => {
  const response = await api.post(`/generation/session/${sessionId}/request-generation/`, data);
  return response.data;
};

/**
 * 세션의 변경사항을 수락하고 실제 코드에 반영합니다.
 * @param {string|number} sessionId
 */
export const completeSession = async (sessionId) => {
  const response = await api.post(`/generation/session/${sessionId}/complete/`);
  return response.data;
};

/**
 * 세션의 변경사항을 폐기하고 원본 상태로 되돌립니다.
 * @param {string|number} sessionId
 */
export const discardSession = async (sessionId) => {
  const response = await api.post(`/generation/session/${sessionId}/discarded/`);
  return response.data;
};
