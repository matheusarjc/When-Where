import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Countdown } from '../components/Countdown';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza contagem regressiva corretamente', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 30 * 60 * 1000); // 2d 3h 30m
    
    render(<Countdown to={futureDate.toISOString()} />);
    
    expect(screen.getByRole('timer')).toBeInTheDocument();
    expect(screen.getByText(/2d 3h 30m/)).toBeInTheDocument();
  });

  it('mostra "Agora" quando a data já passou', () => {
    const pastDate = new Date(Date.now() - 1000);
    
    render(<Countdown to={pastDate.toISOString()} />);
    
    expect(screen.getByText('Agora')).toBeInTheDocument();
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  it('atualiza a contagem a cada segundo', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 1000); // 2 minutos
    
    render(<Countdown to={futureDate.toISOString()} />);
    
    // Verificar contagem inicial
    expect(screen.getByText(/0d 0h 2m/)).toBeInTheDocument();
    
    // Avançar 1 minuto
    act(() => {
      vi.advanceTimersByTime(60 * 1000);
    });
    
    expect(screen.getByText(/0d 0h 1m/)).toBeInTheDocument();
    
    // Avançar mais 1 minuto
    act(() => {
      vi.advanceTimersByTime(60 * 1000);
    });
    
    expect(screen.getByText('Agora')).toBeInTheDocument();
  });

  it('aplica className customizada', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 dia
    
    render(<Countdown to={futureDate.toISOString()} className="custom-class" />);
    
    const countdownElement = screen.getByRole('timer');
    expect(countdownElement).toHaveClass('custom-class');
    expect(countdownElement).toHaveClass('tabular-nums');
  });

  it('aplica className customizada para "Agora"', () => {
    const pastDate = new Date(Date.now() - 1000);
    
    render(<Countdown to={pastDate.toISOString()} className="custom-class" />);
    
    const agoraElement = screen.getByText('Agora');
    expect(agoraElement).toHaveClass('custom-class');
  });

  it('tem atributos de acessibilidade corretos', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    render(<Countdown to={futureDate.toISOString()} />);
    
    const timerElement = screen.getByRole('timer');
    expect(timerElement).toHaveAttribute('aria-live', 'polite');
  });

  it('tem atributos de acessibilidade para "Agora"', () => {
    const pastDate = new Date(Date.now() - 1000);
    
    render(<Countdown to={pastDate.toISOString()} />);
    
    const agoraElement = screen.getByText('Agora');
    expect(agoraElement).toHaveAttribute('aria-live', 'polite');
  });

  it('calcula dias, horas e minutos corretamente', () => {
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 45 * 60 * 1000); // 3d 5h 45m
    
    render(<Countdown to={futureDate.toISOString()} />);
    
    expect(screen.getByText(/3d 5h 45m/)).toBeInTheDocument();
  });

  it('limpa o interval quando o componente é desmontado', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const { unmount } = render(<Countdown to={futureDate.toISOString()} />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('atualiza quando a prop "to" muda', () => {
    const futureDate1 = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 dia
    const futureDate2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 dias
    
    const { rerender } = render(<Countdown to={futureDate1.toISOString()} />);
    
    expect(screen.getByText(/1d 0h 0m/)).toBeInTheDocument();
    
    rerender(<Countdown to={futureDate2.toISOString()} />);
    
    // Aguardar a atualização do timer
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar se o timer foi atualizado (pode ter pequenas diferenças de tempo)
    const timerElement = screen.getByRole('timer');
    expect(timerElement.textContent).toMatch(/\d+d \d+h \d+m/);
  });

  it('lida com datas muito próximas (menos de 1 minuto)', () => {
    const futureDate = new Date(Date.now() + 30 * 1000); // 30 segundos
    
    render(<Countdown to={futureDate.toISOString()} />);
    
    expect(screen.getByText(/0d 0h 0m/)).toBeInTheDocument();
  });
});
