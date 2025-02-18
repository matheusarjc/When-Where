import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // 🔹 Importação correta do useAuth
import { AuthForm } from "@/app/components/organisms/Auth/AuthForm";
import ThemeProvider from "@/styles/ThemeProvider";
import StyledComponentsRegistry from "@/app/registry";
import { act } from "react";
import "whatwg-fetch"; // 🔹 Polyfill para evitar erro de fetch

// 🔹 Mock de Next.js Navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
  useServerInsertedHTML: jest.fn(),
}));

// 🔹 Mock da função login dentro do AuthContext
const mockLogin = jest.fn(() => Promise.resolve()); // ✅ Agora retorna uma Promise resolvida
const mockLogout = jest.fn();

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    login: mockLogin,
    logout: mockLogout,
    user: null,
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

test("deve renderizar o título corretamente após o carregamento", async () => {
  await act(async () => {
    render(
      <StyledComponentsRegistry>
        <ThemeProvider>
          <AuthProvider>
            <AuthForm />
          </AuthProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    );
  });

  await waitFor(() => {
    expect(screen.getByText(/Get your trip plans with you!/i)).toBeDefined();
  });
});

test("deve renderizar os campos de email e senha", async () => {
  await act(async () => {
    render(
      <StyledComponentsRegistry>
        <ThemeProvider>
          <AuthProvider>
            <AuthForm />
          </AuthProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    );
  });

  expect(screen.getByPlaceholderText(/Email/i)).toBeDefined();
  expect(screen.getByPlaceholderText(/Password/i)).toBeDefined();
});

test("deve permitir alternar entre login e cadastro", async () => {
  await act(async () => {
    render(
      <StyledComponentsRegistry>
        <ThemeProvider>
          <AuthProvider>
            <AuthForm />
          </AuthProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    );
  });

  expect(screen.getByText(/Log in or sign up/i)).toBeDefined();

  const toggleButton = screen.getByText(/Ainda não tem uma conta\? Cadastre-se/i);
  fireEvent.click(toggleButton);

  await waitFor(() => {
    expect(screen.getByText(/Sign up to get started/i)).toBeDefined();
  });
});

test("deve permitir login ao preencher email e senha e clicar em continuar", async () => {
  await act(async () => {
    render(
      <StyledComponentsRegistry>
        <ThemeProvider>
          <AuthProvider>
            <AuthForm />
          </AuthProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    );
  });

  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password123" } });

  const loginButton = screen
    .getAllByText(/Continue/i)
    .find((btn) => btn.tagName.toLowerCase() === "button");

  if (!loginButton) throw new Error("Botão de login não encontrado");

  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
  });
});
