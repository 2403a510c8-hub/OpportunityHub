/**
 * API Client Service for Opportunity Hub
 * Communicates with backend REST API at /api with transparent auth token headers.
 */

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('opportunity_hub_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  demoSwitch: (role) => request(`/auth/demo-switch/${role}`),
};

export const opportunityApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/opportunities${queryString ? `?${queryString}` : ''}`);
  },

  getFeatured: () => request('/opportunities/featured'),

  getById: (id) => request(`/opportunities/${id}`),

  create: (opportunityData) =>
    request('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    }),

  update: (id, updates) =>
    request(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    request(`/opportunities/${id}`, {
      method: 'DELETE',
    }),
};

export const applicationApi = {
  apply: (applicationData) =>
    request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  getMyApplications: () => request('/applications/my'),

  getByOpportunity: (opportunityId) =>
    request(`/applications/opportunity/${opportunityId}`),

  updateStatus: (applicationId, status) =>
    request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const bookmarkApi = {
  getAll: () => request('/bookmarks'),

  toggle: (opportunityId) =>
    request(`/bookmarks/${opportunityId}`, {
      method: 'POST',
    }),
};

export const statsApi = {
  getPlatformStats: () => request('/stats'),

  getNotifications: () => request('/stats/notifications'),

  markAsRead: (id) =>
    request(`/stats/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  markAllAsRead: () =>
    request('/stats/notifications/mark-all-read', {
      method: 'POST',
    }),
};
