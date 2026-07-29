const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'https://medsync-api-bk15.onrender.com';

const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
  /\/+$/,
  '',
);

const AUTH_TOKEN_KEY = 'authToken';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

async function request(path, { auth = true, body, headers, ...options } = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    throw new ApiError(
      data?.detail || 'Não foi possível concluir a solicitação.',
      response.status,
    );
  }

  return data;
}

export const api = {
  registerUser: (user) =>
    request('/usuarios/registrar', { method: 'POST', auth: false, body: user }),
  login: (credentials) =>
    request('/usuarios/login', {
      method: 'POST',
      auth: false,
      body: credentials,
    }),
  getCurrentUser: () => request('/usuarios/me'),
  getCases: () => request('/casos-clinicos/'),
  getCase: (caseId) => request(`/casos-clinicos/${caseId}`),
  getProgress: () => request('/progresso/meu'),
  saveProgress: (progress) =>
    request('/progresso/registrar', {
      method: 'POST',
      body: progress,
    }),
};
