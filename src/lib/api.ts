const API_BASE_URL = 'http://localhost:3000'; // Default backend URL

// We use the real token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

const handleResponse = async (response: Response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
    }
    if (!response.ok) throw new Error('API Request Failed');
    
    // Check if the response has body before calling json()
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response;
};

export const api = {
    async get(endpoint: string) {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json'
            }
        });
        return handleResponse(response);
    },

    async post(endpoint: string, data: any) {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async put(endpoint: string, data: any) {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async patch(endpoint: string, data: any) {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async delete(endpoint: string) {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            }
        });
        return handleResponse(response);
    }
};
