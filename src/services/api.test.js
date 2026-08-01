import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api, getAuthToken, setAuthToken } from './api';

describe('serviço da API', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
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
});
