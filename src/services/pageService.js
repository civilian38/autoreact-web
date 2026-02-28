import api from '@/services/api';

export const getPages = async (projectId) => {
  const response = await api.get(`/frontpages/${projectId}/`);
  return response.data;
};

export const createPage = async (projectId, data) => {
  const response = await api.post(`/frontpages/${projectId}/`, data);
  return response.data;
};

export const getPageDetail = async (pageId) => {
  const response = await api.get(`/frontpages/detail/${pageId}/`);
  return response.data;
};

export const updatePage = async (pageId, data) => {
  const response = await api.put(`/frontpages/detail/${pageId}/`, data);
  return response.data;
};

export const deletePage = async (pageId) => {
  const response = await api.delete(`/frontpages/detail/${pageId}/`);
  return response.data;
};
