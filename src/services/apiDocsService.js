import api from './api';

// --- URL Parameters ---

export const getProjectUrlParameters = async (projectId) => {
  const response = await api.get(`/apidocs/parameters/${projectId}/`);
  return response.data;
};

export const createUrlParameter = async (projectId, data) => {
  const response = await api.post(`/apidocs/parameters/${projectId}/`, data);
  return response.data;
};

export const getUrlParameterDetail = async (paramId) => {
  const response = await api.get(`/apidocs/parameter/${paramId}/`);
  return response.data;
};

export const updateUrlParameter = async (paramId, data) => {
  const response = await api.put(`/apidocs/parameter/${paramId}/`, data);
  return response.data;
};

export const deleteUrlParameter = async (paramId) => {
  await api.delete(`/apidocs/parameter/${paramId}/`);
};

// --- API Documents ---

export const getApiDocs = async (projectId) => {
  const response = await api.get(`/apidocs/${projectId}/`);
  return response.data;
};

export const createApiDoc = async (projectId, data) => {
  const response = await api.post(`/apidocs/${projectId}/`, data);
  return response.data;
};

export const getApiDocDetail = async (docId) => {
  const response = await api.get(`/apidocs/detail/${docId}/`);
  return response.data;
};

export const updateApiDocDetail = async (docId, data) => {
  const response = await api.put(`/apidocs/detail/${docId}/`, data);
  return response.data;
};

export const deleteApiDoc = async (docId) => {
  await api.delete(`/apidocs/detail/${docId}/`);
};

// --- Relation (API Doc <-> URL Parameter) ---

export const manageUrlParamRelation = async (docId, data) => {
  // data: { to_add: [id, ...], to_pop: [id, ...] }
  const response = await api.post(`/apidocs/parameter/relation/${docId}/`, data);
  return response.data;
};

// --- Request Bodies ---

export const createRequestBody = async (docId, data) => {
  const response = await api.post(`/apidocs/requests/${docId}/`, data);
  return response.data;
};

export const getRequestBodyDetail = async (bodyId) => {
  const response = await api.get(`/apidocs/request/${bodyId}/`);
  return response.data;
};

export const updateRequestBody = async (bodyId, data) => {
  const response = await api.put(`/apidocs/request/${bodyId}/`, data);
  return response.data;
};

export const deleteRequestBody = async (bodyId) => {
  await api.delete(`/apidocs/request/${bodyId}/`);
};

// --- Response Bodies ---

export const createResponseBody = async (docId, data) => {
  const response = await api.post(`/apidocs/responses/${docId}/`, data);
  return response.data;
};

export const getResponseBodyDetail = async (bodyId) => {
  const response = await api.get(`/apidocs/response/${bodyId}/`);
  return response.data;
};

export const updateResponseBody = async (bodyId, data) => {
  const response = await api.put(`/apidocs/response/${bodyId}/`, data);
  return response.data;
};

export const deleteResponseBody = async (bodyId) => {
  await api.delete(`/apidocs/response/${bodyId}/`);
};
