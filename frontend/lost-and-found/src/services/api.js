const API_BASE_URL = 'http://localhost:8000/api'; 

// Helper function for making API requests
const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const responseClone = response.clone();
        // Try to parse error response
        let responseData;
        try {
            responseData = await response.json();
        } catch (parseError) {
            // If JSON parsing fails, read as text
            const textResponse = await responseClone.text();
            console.log('Non-JSON response:', textResponse);
            responseData = { detail: `Server returned non-JSON: ${textResponse.substring(0, 100)}` };
        }
        
        if (!response.ok) {
            // For login endpoint, provide more specific error messages
            if (endpoint === '/users/login/') {
                if (response.status === 401) {
                    throw new Error(
                        responseData.non_field_errors?.[0] || 
                        responseData.detail || 
                        'Invalid email or password'
                    );
                } else if (response.status === 400) {
                    // Handle validation errors
                    const errorMessages = [];
                    if (responseData.email) errorMessages.push(responseData.email.join(', '));
                    if (responseData.password) errorMessages.push(responseData.password.join(', '));
                    if (responseData.non_field_errors) errorMessages.push(responseData.non_field_errors.join(', '));
                    
                    throw new Error(
                        errorMessages.join(' ') || 
                        'Please check your input'
                    );
                }
            }
            
            // For other endpoints
            throw new Error(
                responseData.detail || 
                responseData.message || 
                responseData.non_field_errors?.[0] ||
                Object.values(responseData).flat().join(', ') ||
                `API request failed with status ${response.status}`
            );
        }
        
        return responseData;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

// Authentication API calls
export const authAPI = {
    // Step 1: Send email to get OTP
    registerStep1: async (email) => {
        return await apiRequest('/users/register/', 'POST', { email });
    },

    // Step 2: Verify OTP and set password
    registerStep2: async (email, otp, password) => {
        return await apiRequest('/users/verify/', 'POST', { 
            email, 
            otp, 
            password 
        });
    },

    // Login
    login: async (email, password) => {
        return await apiRequest('/users/login/', 'POST', { email, password });
    },

    // Get user profile
    getProfile: async (token) => {
        return await apiRequest('/users/profile/', 'GET', null, token);
    },

    // Logout
    logout: async (refreshToken, accessToken) => {
        return await apiRequest('/users/logout/', 'POST', { refresh: refreshToken }, accessToken);
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        return await apiRequest('/users/refresh/', 'POST', { refresh: refreshToken });
    }
};

// Token management helpers
export const tokenService = {
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    },

    getAccessToken: () => {
        return localStorage.getItem('access_token');
    },

    getRefreshToken: () => {
        return localStorage.getItem('refresh_token');
    },

    clearTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
};