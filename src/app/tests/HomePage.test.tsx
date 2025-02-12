import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "../Home/page"; // Importa a HomePage
import { AuthProvider } from "@/context/AuthContext"; // Mock do contexto de autenticação
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("deve renderizar a HomePage corretamente", () => {
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    expect(screen.getByText("Bem-vindo ao Cronômetro de Viagens")).toBeInTheDocument();
  });

  it("deve chamar a função ao clicar em 'Iniciar Contagem'", () => {
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    const startButton = screen.getByText("Iniciar Contagem");
    fireEvent.click(startButton);

    expect(screen.getByText("Digite a data do evento (YYYY-MM-DD HH:MM)")).toBeDefined();
  });

  it("deve exibir o botão de logout", () => {
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  it("deve redirecionar para a Home quando clicar em 'Sair'", () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    const logoutButton = screen.getByText("Sair");
    fireEvent.click(logoutButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });
});
