const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'https://medsync-api-bk15.onrender.com';

const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
  /\/+$/,
  '',
);

const AUTH_TOKEN_KEY = 'authToken';
const REQUEST_TIMEOUT_MS = 20_000;
const SYNAPSE_EVALUATION_TIMEOUT_MS = 60_000;
const SYNAPSE_QUESTION_TIMEOUT_MS = 45_000;

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

async function request(path, {
  auth = true,
  body,
  headers,
  timeoutMs = REQUEST_TIMEOUT_MS,
  ...options
} = {}) {
  const token = getAuthToken();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
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
      throw new ApiError(
        'A solicitação demorou demais. Seu envio foi preservado; aguarde alguns instantes antes de tentar novamente.',
        408,
      );
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
  getPublicStats: () => request('/estatisticas-publicas', { auth: false }),
  registerUser: (user) =>
    request('/usuarios/registrar', { method: 'POST', auth: false, body: user }),
  verifyEmail: (token) => request('/usuarios/verificar-email', {
    method: 'POST',
    auth: false,
    body: { token },
  }),
  resendEmailVerification: (email) => request('/usuarios/reenviar-verificacao', {
    method: 'POST',
    auth: false,
    body: { email },
  }),
  login: (credentials) =>
    request('/usuarios/login', {
      method: 'POST',
      auth: false,
      body: credentials,
    }),
  getCurrentUser: () => request('/usuarios/me'),
  createPaymentCheckout: (planId) => request('/pagamentos/checkout', {
    method: 'POST',
    body: { plano_id: planId },
  }),
  createTransparentPayment: (payload) => request('/pagamentos/transparente', {
    method: 'POST',
    body: payload,
  }),
  getPaymentStatus: (orderId) => request(`/pagamentos/pedidos/${orderId}`),
  getAcademicAnalytics: () => request('/admin/analytics/academico'),
  getAdminOverview: () => request('/admin/overview'),
  getAdminFinancial: () => request('/admin/financeiro'),
  getAdminQuestions: (filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== '' && value != null),
    );
    const queryString = query.toString();
    return request(`/admin/questoes${queryString ? `?${queryString}` : ''}`);
  },
  updateAdminQuestion: (questionId, payload) => request(`/admin/questoes/${questionId}`, {
    method: 'PATCH',
    body: payload,
  }),
  updateAdminQuestionReport: (reportId, status) => request(`/admin/questoes/relatos/${reportId}`, {
    method: 'PATCH',
    body: { status },
  }),
  generateAdminQuestionExplanation: (questionId) => request(`/admin/questoes/${questionId}/gerar-explicacao`, {
    method: 'POST',
  }),
  getAdminCases: () => request('/admin/casos'),
  saveAdminCase: (caseId, payload) => request(
    caseId ? `/admin/casos/${caseId}` : '/admin/casos',
    { method: caseId ? 'PUT' : 'POST', body: payload },
  ),
  getAdminChallenges: () => request('/admin/desafios'),
  saveAdminChallenge: (challengeId, payload) => request(
    challengeId ? `/admin/desafios/${challengeId}` : '/admin/desafios',
    { method: challengeId ? 'PUT' : 'POST', body: payload },
  ),
  getAdminAnnouncements: () => request('/admin/avisos'),
  saveAdminAnnouncement: (announcementId, payload) => request(
    announcementId ? `/admin/avisos/${announcementId}` : '/admin/avisos',
    { method: announcementId ? 'PUT' : 'POST', body: payload },
  ),
  getDynamicChallenges: () => request('/desafios-visuais'),
  answerVisualChallenge: (challengeId, optionId) => request(
    `/desafios-visuais/${challengeId}/responder`,
    { method: 'POST', body: { alternativa_id: optionId } },
  ),
  getAnnouncements: () => request('/avisos'),
  getQuestionMetadata: () => request('/questoes/meta'),
  getQuestions: (filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== '' && value != null),
    );
    const queryString = query.toString();
    return request(`/questoes${queryString ? `?${queryString}` : ''}`);
  },
  answerQuestion: (questionId, alternativeId, seconds) => request(
    `/questoes/${questionId}/responder`,
    { method: 'POST', body: { alternativa_id: alternativeId, tempo_segundos: seconds } },
  ),
  retryQuestionExplanation: (questionId) => request(`/questoes/${questionId}/explicacao`, {
    method: 'POST',
  }),
  getQuestionPerformance: () => request('/questoes/desempenho'),
  reportQuestion: (questionId, payload) => request(`/questoes/${questionId}/reportar`, {
    method: 'POST',
    body: payload,
  }),
  downloadAnonymizedReport: async () => {
    const response = await fetch(`${API_URL}/admin/relatorios/anonimizado.csv`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new ApiError('Não foi possível exportar o relatório.', response.status);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'medsync-relatorio-anonimizado.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  },
  getCases: () => request('/casos-clinicos/'),
  getCase: (caseId) => request(`/casos-clinicos/${caseId}`),
  getProgress: () => request('/progresso/meu'),
  resetProgress: () => request('/progresso/meu', { method: 'DELETE' }),
  saveProgress: (progress) =>
    request('/progresso/registrar', {
      method: 'POST',
      body: progress,
    }),
  finalizeSimulation: (caseId, submission, idempotencyKey) =>
    request(`/simulacoes/${caseId}/finalizar`, {
      method: 'POST',
      body: submission,
      headers: idempotencyKey
        ? { 'X-Idempotency-Key': idempotencyKey }
        : undefined,
      timeoutMs: SYNAPSE_EVALUATION_TIMEOUT_MS,
    }),
  getSimulationResult: (progressId) =>
    request(`/simulacoes/resultados/${progressId}`),
  askSimulationQuestion: (progressId, pergunta) =>
    request(`/simulacoes/resultados/${progressId}/perguntar`, {
      method: 'POST',
      body: { pergunta },
      timeoutMs: SYNAPSE_QUESTION_TIMEOUT_MS,
    }),
  getStudyErrors: () => request('/caderno-erros/meu'),
  getDueReviews: () => request('/caderno-erros/revisoes-hoje'),
  getSpacedReviewPlan: () => request('/caderno-erros/revisoes-plano'),
  submitSpacedReview: (errorId, rating) =>
    request(`/caderno-erros/${errorId}/revisar`, {
      method: 'POST',
      body: { avaliacao: rating },
    }),
  recordVisualChallengeAttempt: (attempt) =>
    request('/caderno-erros/desafios', { method: 'POST', body: attempt }),
  updateStudyErrorStatus: (errorId, status) =>
    request(`/caderno-erros/${errorId}/status`, {
      method: 'PATCH',
      body: { status },
    }),
  deleteStudyError: (errorId) =>
    request(`/caderno-erros/${errorId}`, { method: 'DELETE' }),
  getLearningPaths: () => request('/trilhas'),
  completeLearningPathActivity: (pathId, activityId, score) =>
    request(`/trilhas/${pathId}/atividades/${activityId}/concluir`, {
      method: 'POST',
      body: { pontuacao: score },
    }),
};
