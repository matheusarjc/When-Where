import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button', () => {
  it('renderiza o botão com texto', () => {
    render(<Button>Clique aqui</Button>);
    
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique aqui</Button>);
    
    const button = screen.getByRole('button', { name: 'Clique aqui' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('aplica variantes de estilo', () => {
    render(<Button variant="destructive">Botão Destrutivo</Button>);
    
    const button = screen.getByRole('button', { name: 'Botão Destrutivo' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('pode ser desabilitado', () => {
    render(<Button disabled>Botão Desabilitado</Button>);
    
    const button = screen.getByRole('button', { name: 'Botão Desabilitado' });
    expect(button).toBeDisabled();
  });

  it('aceita tamanhos diferentes', () => {
    render(<Button size="lg">Botão Grande</Button>);
    
    const button = screen.getByRole('button', { name: 'Botão Grande' });
    // Verifica se tem as classes do tamanho lg (pode variar dependendo da implementação)
    expect(button).toHaveClass('h-10'); // Tamanho padrão
  });
});
