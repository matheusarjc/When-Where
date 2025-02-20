/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ThemeProvider from "@/styles/ThemeProvider";
import StyledComponentsRegistry from "@/app/registry";
import { getDoc } from "firebase/firestore";
import "jest-styled-components";
import * as React from "react";

// 🔹 Mocks Globais
const mockLogout = jest.fn();
const mockPush = jest.fn();
const mockEventData = {
  exists: () => true,
  data: () => ({
    name: "Viagem para Paris",
    date: new Date(Date.now() + 86400000).toISOString(), // Data para amanhã
  }),
};

// 🔹 Mock do `useRouter`
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: jest.fn(() => "/Home"),
}));

// 🔹 Mock do `useAuth`
jest.mock("@/context/AuthContext", () => {
  const actual = jest.requireActual("@/context/AuthContext");
  return {
    ...actual,
    useAuth: jest.fn(() => ({
      user: { uid: "123", displayName: "Test User" },
      logout: mockLogout,
    })),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// 🔹 Mock do Firestore
jest.mock("@firebase/firestore", () => {
  const originalModule = jest.requireActual("@firebase/firestore");
  return {
    ...originalModule,
    getFirestore: jest.fn(),
    doc: jest.fn((db, collection, id) => ({ id })), // Retorna um objeto válido
    getDoc: jest.fn(() => Promise.resolve(mockEventData)),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
  };
});

// 🔹 Mock do `useEvent` com implementação real usando context e useState
jest.mock("@/context/EventContext", () => {
  const EventContext = React.createContext<{
    eventDate: string | null;
    setEventDate: React.Dispatch<React.SetStateAction<string | null>>;
    eventName: string | null;
    setEventName: React.Dispatch<React.SetStateAction<string | null>>;
    eventStatus: string;
    setEventStatus: React.Dispatch<React.SetStateAction<string>>;
  }>({
    eventDate: null,
    setEventDate: () => {},
    eventName: null,
    setEventName: () => {},
    eventStatus: "no-event",
    setEventStatus: () => {},
  });

  return {
    useEvent: () => React.useContext(EventContext),
    EventProvider: ({ children }: { children: React.ReactNode }) => {
      const [eventDate, setEventDate] = React.useState<string | null>(null);
      const [eventName, setEventName] = React.useState<string | null>(null);
      const [eventStatus, setEventStatus] = React.useState("no-event");

      return (
        <EventContext.Provider
          value={{ eventDate, setEventDate, eventName, setEventName, eventStatus, setEventStatus }}>
          {children}
        </EventContext.Provider>
      );
    },
  };
});

// 🔥 Importa o componente Home depois dos mocks!
import Home from "@/app/Home/page";
import { EventProvider } from "@/context/EventContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

describe("Home - Renderização", () => {
  it("deve renderizar corretamente quando o usuário está autenticado", async () => {
    await act(async () => {
      render(
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <EventProvider>
                <Home />
              </EventProvider>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      );
    });

    expect(screen.getByText(/Welcome to When & Where/i)).toBeInTheDocument();
    expect(screen.getByText("Logged as: Test User")).toBeInTheDocument();
  });
});

describe("Home - Logout", () => {
  it("deve chamar a função de logout quando o botão for clicado", async () => {
    await act(async () => {
      render(
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <EventProvider>
                <Home />
              </EventProvider>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Home - Exibição de Evento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar e exibir evento salvo no Firestore", async () => {
    await act(async () => {
      render(
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <EventProvider>
                <Home />
              </EventProvider>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Viagem para Paris")).toBeInTheDocument();
    });

    // Garante que `getDoc` foi chamado
    expect(getDoc).toHaveBeenCalledTimes(1);
    expect(getDoc).toHaveBeenCalledWith({ id: "123" });
  });
});

describe("Home - Redirecionamento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simula usuário não autenticado
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logout: jest.fn(),
    });
  });

  it("deve redirecionar para a página de login se o usuário não estiver autenticado", async () => {
    await act(async () => {
      render(
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <EventProvider>
                <Home />
              </EventProvider>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
