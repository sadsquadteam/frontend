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
        const error = new Error(msg);
        error.status = response.status;
        error.payload = responseData;
        throw error;
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

const _reportedKey = (type) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.id ? `reported_${type}_u${user.id}` : `reported_${type}`;
    } catch { return `reported_${type}`; }
};

export const reportedService = {
    hasReportedItem: (itemId) => {
        try {
            const ids = JSON.parse(localStorage.getItem(_reportedKey('items'))) || [];
            return ids.includes(String(itemId));
        } catch { return false; }
    },
    markItemReported: (itemId) => {
        try {
            const key = _reportedKey('items');
            const ids = JSON.parse(localStorage.getItem(key)) || [];
            if (!ids.includes(String(itemId))) localStorage.setItem(key, JSON.stringify([...ids, String(itemId)]));
        } catch {}
    },
    hasReportedComment: (commentId) => {
        try {
            const ids = JSON.parse(localStorage.getItem(_reportedKey('comments'))) || [];
            return ids.includes(String(commentId));
        } catch { return false; }
    },
    markCommentReported: (commentId) => {
        try {
            const key = _reportedKey('comments');
            const ids = JSON.parse(localStorage.getItem(key)) || [];
            if (!ids.includes(String(commentId))) localStorage.setItem(key, JSON.stringify([...ids, String(commentId)]));
        } catch {}
    },
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
        const msg = String(err.message || '').toLowerCase();
        const status = err?.status;
        const code = err?.payload?.code;
        const shouldTryRefresh =
            !!refresh &&
            (status === 401 ||
                code === 'token_not_valid' ||
                msg.includes('token is invalid') ||
                msg.includes('expired') ||
                msg.includes('not valid for any token type'));

        if (!shouldTryRefresh) {
            throw err;
        }

        const data = await authAPI.refreshToken(refresh);
        if (!data.access) throw err;
        tokenService.setTokens(data.access, refresh);
        return await requestFn(data.access);
    }
};

const normalizeListResponse = (responseData) => {
    if (Array.isArray(responseData)) return responseData;
    if (responseData && Array.isArray(responseData.results)) return responseData.results;
    return [];
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

export const commentsAPI = {
    listComments: async (itemId) => {
        const query = typeof itemId !== 'undefined' ? `?item=${encodeURIComponent(itemId)}` : '';
        const data = await withAuth((token) =>
            apiRequest(`/interactions/comments/${query}`, 'GET', null, token)
        );

        const normalized = normalizeListResponse(data);
        if (typeof itemId === 'undefined') return normalized;

        return normalized.filter((comment) => String(comment.item) === String(itemId));
    },

    createComment: (commentData) =>
        withAuth((token) =>
            apiRequest('/interactions/comments/', 'POST', commentData, token)
        ),

    updateComment: (id, commentData) =>
        withAuth((token) =>
            apiRequest(`/interactions/comments/${id}/`, 'PATCH', commentData, token)
        ),

    deleteComment: (id) =>
        withAuth((token) =>
            apiRequest(`/interactions/comments/${id}/`, 'DELETE', null, token)
        ),
};

export const reportsAPI = {
    createItemReport: ({ item, reason }) =>
        withAuth((token) =>
            apiRequest('/interactions/reports/', 'POST', { item, reason }, token)
        ),

    createCommentReport: ({ comment, reason }) =>
        withAuth((token) =>
            apiRequest('/interactions/reports/', 'POST', { comment, reason }, token)
        ),
};
