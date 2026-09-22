const API_BASE_URL = '/api';

export function getStoredToken() {
  return localStorage.getItem('collabsphere_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('collabsphere_token', token);
  } else {
    localStorage.removeItem('collabsphere_token');
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API
export const authApi = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  getMe: () => apiRequest('/auth/me'),
};

// Campaign API
export const campaignApi = {
  create: (payload) => apiRequest('/campaigns', { method: 'POST', body: payload }),
  getMyCampaigns: (params = '') => apiRequest(`/campaigns/my${params ? `?${params}` : ''}`),
  getById: (id) => apiRequest(`/campaigns/${id}`),
  update: (id, payload) => apiRequest(`/campaigns/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiRequest(`/campaigns/${id}`, { method: 'DELETE' }),
  updateStatus: (id, status) => apiRequest(`/campaigns/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Influencer API
export const influencerApi = {
  getAll: (params = '') => apiRequest(`/influencers${params ? `?${params}` : ''}`),
  getById: (id) => apiRequest(`/influencers/${id}`),
  updateMyProfile: (payload) => apiRequest('/influencers/profile/me', { method: 'PUT', body: payload }),
};

// Collaboration API
export const collaborationApi = {
  sendRequest: (payload) => apiRequest('/collaborations/request', { method: 'POST', body: payload }),
  getBrandCollaborations: (params = '') => apiRequest(`/collaborations/brand${params ? `?${params}` : ''}`),
  getInfluencerCollaborations: (params = '') => apiRequest(`/collaborations/influencer${params ? `?${params}` : ''}`),
  getById: (id) => apiRequest(`/collaborations/${id}`),
  updateStatus: (id, status) => apiRequest(`/collaborations/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Payment API
export const paymentApi = {
  getAll: () => apiRequest('/payments'),
  markAsPaid: (id) => apiRequest(`/payments/${id}/pay`, { method: 'PATCH' }),
};

// Notification API
export const notificationApi = {
  getAll: () => apiRequest('/notifications'),
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => apiRequest('/notifications/read-all', { method: 'PATCH' }),
};

// AI Content Idea API
export const aiApi = {
  generateIdeas: (payload) => apiRequest('/ai/generate', { method: 'POST', body: payload }),
  saveIdea: (payload) => apiRequest('/ai/save', { method: 'POST', body: payload }),
  getSavedIdeas: () => apiRequest('/ai/saved'),
  deleteSavedIdea: (id) => apiRequest(`/ai/saved/${id}`, { method: 'DELETE' }),
};
