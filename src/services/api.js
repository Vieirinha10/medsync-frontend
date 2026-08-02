const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'https://medsync-api-bk15.onrender.com';

const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
  /\/+$/,
  '',
);

const AUTH_TOKEN_KEY = 'authToken';
const REQUEST_TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  constructor(message, status, requestId = null) {
    super(message);
    this.status = status;
    this.requestId = requestId;
  }
}

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

function getErrorMessage(detail) {
  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(' ');

    if (messages) {
      return messages;
    }
  }

  return 'Não foi possível concluir a solicitação.';
}

async function request(path, { auth = true, body, headers, ...options } = {}) {
  const token = getAuthToken();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('A solicitação demorou demais. Tente novamente.', 408);
    }
    throw new ApiError('Não foi possível conectar ao MedSync.', 0);
  } finally {
    window.clearTimeout(timeout);
  }

  const contentType = response.headers.get('content-type') || '';
  const requestId = response.headers.get('x-request-id');
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    throw new ApiError(
      getErrorMessage(data?.detail),
      response.status,
      requestId,
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
  getAcademicAnalytics: () => request('/admin/analytics/academico'),
  getCases: () => request('/casos-clinicos/'),
  getCase: (caseId) => request(`/casos-clinicos/${caseId}`),
  getProgress: () => request('/progresso/meu'),
  resetProgress: () => request('/progresso/meu', { method: 'DELETE' }),
  saveProgress: (progress) =>
    request('/progresso/registrar', {
      method: 'POST',
      body: progress,
    }),
  finalizeSimulation: (caseId, submission) =>
    request(`/simulacoes/${caseId}/finalizar`, {
      method: 'POST',
      body: submission,
    }),
  getSimulationResult: (progressId) =>
    request(`/simulacoes/resultados/${progressId}`),
};
