import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ThemeProvider from "@/styles/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/app/Home/page";
import StyledComponentsRegistry from "@/app/registry";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const mockLogout = jest.fn();
const mockEventData = {
  exists: () => true,
  data: () => ({
    name: "Viagem para Paris",
    date: new Date(new Date().getTime() + 86400000).toISOString(),
  }),
};

// 🔹 Mock do AuthContext para um usuário autenticado
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: { uid: "123", displayName: "Test User" },
    logout: mockLogout,
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: jest.fn(() => "/Home"),
}));

jest.mock("@firebase/firestore", () => {
  const originalModule = jest.requireActual("@firebase/firestore");
  return {
    ...originalModule,
    getFirestore: jest.fn(),
    doc: jest.fn((db, collection, id) => ({ id })), // ✅ Garante que `doc` retorne um objeto válido
    getDoc: jest.fn(() => Promise.resolve(mockEventData)),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
  };
});

describe("Home - Renderização", () => {
  it("deve renderizar corretamente quando o usuário está autenticado", async () => {
    await act(async () => {
      render(
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <Home />
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      );
    });

    expect(screen.getByText(/Welcome to When & Where/i)).toBeDefined();
    expect(screen.getByText("Logged as: Test User")).toBeDefined();
  });
});

describe("Home - Logout", () => {
  it("deve chamar a função de logout quando o botão for clicado", async () => {
    render(
      <StyledComponentsRegistry>
        <ThemeProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Home - Exibição de Evento", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Reseta os mocks antes de cada teste
  });

  it("deve buscar e exibir evento salvo no Firestore", async () => {
    await act(async () => {
      render(
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <Home />
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Viagem para Paris")).toBeInTheDocument();
    });

    // ✅ Garante que `getDoc` foi chamado
    expect(getDoc).toHaveBeenCalledTimes(1);

    // 🔹 Agora garantimos que foi chamado com um `doc()`
    expect(getDoc).toHaveBeenCalledWith({ id: "123" }); // 🔥 Agora garantimos que `doc` retornou algo
  });
});
