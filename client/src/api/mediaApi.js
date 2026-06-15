import axios from 'axios';

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const hostedApiBaseUrl = 'https://mediazy.onrender.com';

const isLocalhostUrl = (value) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/?$/i.test(value);

const resolveApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return configuredApiBaseUrl;
  }

  const isLocalPage = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

  if (!isLocalPage && isLocalhostUrl(configuredApiBaseUrl)) {
    return hostedApiBaseUrl;
  }

  if (!isLocalPage && /(^|\.)mediazy\.xyz$/i.test(window.location.hostname) && !configuredApiBaseUrl) {
    return hostedApiBaseUrl;
  }

  return configuredApiBaseUrl;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 70000
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('mediazy_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getMessage = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'The server is still waiting on the platform. Try again in a moment, or use another public link.';
  }

  if (error.message === 'Network Error') {
    return 'Mediazy could not reach the backend. Check the API URL and redeploy the frontend.';
  }

  return (
    error.response?.data?.message ||
    error.message ||
    'Something went wrong. Please try again.'
  );
};

export const fetchVideoInfo = async (url) => {
  try {
    const { data } = await api.post('/api/info', { url });
    return data;
  } catch (error) {
    throw new Error(getMessage(error));
  }
};

export const requestDownload = async ({ url, type, quality, format }) => {
  try {
    const { data } = await api.post('/api/download', { url, type, quality, format });
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
