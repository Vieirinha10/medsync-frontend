import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../services/api';
import HomePage from './HomePage';

vi.mock('../services/api', () => ({
  api: {
    getPublicStats: vi.fn(),
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('apresenta prova social e abrangência médica com dados reais', async () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('áreas médicas contempladas')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('127')).toBeInTheDocument());
    expect(screen.getByText('estudantes MedSync')).toBeInTheDocument();
  });
});
