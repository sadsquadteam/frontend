const API_BASE_URL = 'http://localhost:8000/api';

const apiRequest = async (endpoint, method = 'GET', data = null, token = null, extraConfig = {}) => {
  const headers = {
    ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraConfig.headers || {}),
  };

  const config = {
    method,
    headers,
    ...(data
      ? {
        body: data instanceof FormData ? data : JSON.stringify(data),
      }
      : {}),
    ...extraConfig,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const clone = response.clone();

  let responseData;
  try {
    responseData = await response.json();
  } catch {
    const text = await clone.text();
    responseData = { detail: text.slice(0, 200) || 'No JSON body' };
  }

  if (!response.ok) {
    if (endpoint === '/users/login/') {
      if (response.status === 401) {
        throw new Error(
          responseData.non_field_errors?.[0] ||
          responseData.detail ||
          'Invalid email or password'
        );
      }
      if (response.status === 400) {
        const msgs = [];
        if (responseData.email) msgs.push(responseData.email.join(', '));
        if (responseData.password) msgs.push(responseData.password.join(', '));
        if (responseData.non_field_errors)
          msgs.push(responseData.non_field_errors.join(', '));
        throw new Error(msgs.join(' ') || 'Please check your input');
      }
    }

    const msg =
      responseData.detail ||
      responseData.message ||
      responseData.non_field_errors?.[0] ||
      (typeof responseData === 'object'
        ? Object.values(responseData).flat().join(', ')
        : '') ||
      `API request failed with status ${response.status}`;
    throw new Error(msg);
  }

  return responseData;
};


export const tokenService = {
  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  getAccessToken: () => localStorage.getItem('access_token'),

  getRefreshToken: () => localStorage.getItem('refresh_token'),

  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
};

export const authAPI = {
  registerStep1: (email) =>
    apiRequest('/users/register/', 'POST', { email }),

  registerStep2: (email, otp, password) =>
    apiRequest('/users/verify/', 'POST', { email, otp, password }),

  login: async (email, password) => {
    const data = await apiRequest('/users/login/', 'POST', { email, password });
    if (data.access && data.refresh) {
      tokenService.setTokens(data.access, data.refresh);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  getProfile: (token) =>
    apiRequest('/users/profile/', 'GET', null, token),

  logout: (refreshToken, accessToken) =>
    apiRequest('/users/logout/', 'POST', { refresh: refreshToken }, accessToken),

  refreshToken: (refreshToken) =>
    apiRequest('/users/refresh/', 'POST', { refresh: refreshToken }),
};

const withAuth = async (requestFn) => {
  const access = tokenService.getAccessToken();
  const refresh = tokenService.getRefreshToken();

  if (!access) throw new Error('Not authenticated');

  try {
    return await requestFn(access);
  } catch (err) {
    const msg = String(err.message || '');
    if (!refresh || (!msg.includes('Token is invalid') && !msg.includes('expired'))) {
      throw err;
    }

    const data = await authAPI.refreshToken(refresh);
    if (!data.access) throw err;
    tokenService.setTokens(data.access, refresh);
    return await requestFn(data.access);
  }
};

export const itemsAPI = {
  getAllItems: (filters = {}) => {
    let url = '/items/';
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    if (params.toString()) url += `?${params.toString()}`;
    return apiRequest(url, 'GET', null, null);
  },

  getItemById: (id) =>
    apiRequest(`/items/${id}/`, 'GET', null, null),

  createItem: (itemData) =>
    withAuth((token) =>
      apiRequest('/items/', 'POST', itemData, token)
    ),

  updateItem: (id, itemData) =>
    withAuth((token) =>
      apiRequest(`/items/${id}/`, 'PUT', itemData, token)
    ),

  deleteItem: (id) =>
    withAuth((token) =>
      apiRequest(`/items/${id}/`, 'DELETE', null, token)
    ),

  getItemsByStatus: (status) =>
    itemsAPI.getAllItems({ status }),

  getItemsByTag: (tag) =>
    itemsAPI.getAllItems({ tag }),
};
