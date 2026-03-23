import api from '@/services/api';

export const getDiscussionList = async (projectId) => {
  const response = await api.get(`/discussion/${projectId}/`);
  return response.data;
};

export const createDiscussion = async (projectId, data) => {
  const response = await api.post(`/discussion/${projectId}/`, data);
  return response.data;
};

export const getDiscussionDetail = async (discussionId) => {
  const response = await api.get(`/discussion/detail/${discussionId}/`);
  return response.data;
};

export const updateDiscussion = async (discussionId, data) => {
  const response = await api.put(`/discussion/detail/${discussionId}/`, data);
  return response.data;
};

export const deleteDiscussion = async (discussionId) => {
  const response = await api.delete(`/discussion/detail/${discussionId}/`);
  return response.data;
};

export const getDiscussionChatList = async (discussionId) => {
  const response = await api.get(`/discussion/chat/${discussionId}/list/`);
  return response.data;
};

export const sendDiscussionChat = async (discussionId, data) => {
  const response = await api.post(`/discussion/chat/${discussionId}/`, data);
  return response.data;
};

export const summarizeDiscussion = async (discussionId) => {
  const response = await api.post(`/discussion/chat/${discussionId}/summarize/`);
  return response.data;
};
