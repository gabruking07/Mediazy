import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 180000
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('mediazy_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getMessage = (error) => (
  error.response?.data?.message ||
  error.message ||
  'Something went wrong. Please try again.'
);

export const fetchVideoInfo = async (url) => {
  try {
    const { data } = await api.post('/api/info', { url });
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const requestDownload = async ({ url, type, quality }) => {
  try {
    const { data } = await api.post('/api/download', { url, type, quality });
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const fetchDownloadQuota = async () => {
  try {
    const { data } = await api.get('/api/quota');
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const loginUser = async ({ identifier, password }) => {
  try {
    const { data } = await api.post('/api/auth/login', { identifier, password });
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const registerUser = async ({ name, email, phone, password }) => {
  try {
    const { data } = await api.post('/api/auth/register', { name, email, phone, password });
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get('/api/auth/me');
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const updateProfile = async ({ name, email, currentPassword, newPassword }) => {
  try {
    const { data } = await api.patch('/api/auth/me', { name, email, currentPassword, newPassword });
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};
