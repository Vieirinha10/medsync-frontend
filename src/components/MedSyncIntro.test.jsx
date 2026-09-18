import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MedSyncIntro from './MedSyncIntro';

describe('MedSyncIntro', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    sessionStorage.clear();
    document.documentElement.classList.remove('medsync-intro-lock');
    window.matchMedia = originalMatchMedia;
  });

  it('apresenta a abertura uma vez por sessão e libera a página ao terminar', () => {
    const { unmount } = render(<MedSyncIntro />);

    expect(screen.getByRole('status', { name: /Preparando sua experiência/i })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('medsync-intro-lock');
    expect(sessionStorage.getItem('medsync-home-intro-viewed')).toBe('true');

    act(() => vi.advanceTimersByTime(1900));
    act(() => vi.advanceTimersByTime(620));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass('medsync-intro-lock');

    unmount();
    render(<MedSyncIntro />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('permite pular a introdução sem aguardar o tempo completo', () => {
    render(<MedSyncIntro />);

    fireEvent.click(screen.getByRole('button', { name: 'Pular introdução' }));
    act(() => vi.advanceTimersByTime(620));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('não bloqueia a página quando a pessoa prefere movimento reduzido', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    render(<MedSyncIntro />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass('medsync-intro-lock');
  });
});
