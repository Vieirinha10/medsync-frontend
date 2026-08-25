import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api, getAuthToken, setAuthToken } from './api';

describe('serviço da API', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('migra sessões antigas para o armazenamento da aba', () => {
    localStorage.setItem('authToken', 'token-legado');

    expect(getAuthToken()).toBe('token-legado');
    expect(sessionStorage.getItem('authToken')).toBe('token-legado');
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('envia o token nas rotas protegidas', async () => {
    setAuthToken('token-seguro');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await api.getCases();

    expect(fetchMock).toHaveBeenCalledOnce();
    const options = fetchMock.mock.calls[0][1];
    expect(options.headers.Authorization).toBe('Bearer token-seguro');
  });

  it('remove o token quando a API responde 401', async () => {
    setAuthToken('token-expirado');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Token expirado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(api.getCases()).rejects.toMatchObject({ status: 401 });
    expect(getAuthToken()).toBeNull();
  });

  it('envia a chave idempotente ao finalizar uma simulação', async () => {
    setAuthToken('token-seguro');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ progresso_id: 42 }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await api.finalizeSimulation(
      8,
      { hipotese_diagnostica: 'TEP', conduta_proposta: 'Anticoagulação' },
      'synapse-request-123456789',
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('/simulacoes/8/finalizar');
    expect(options.headers['X-Idempotency-Key']).toBe('synapse-request-123456789');
  });
});
