"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, githubProvider, googleProvider } from "@/lib/firebaseConfig";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtém o token inicial do Firebase
        const idToken = await getIdToken(user);
        setToken(idToken);
        setUser(user);

        // Inicia a atualização automática do token
        startTokenRefresh(user);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🚀 Função para Renovar o Token Automaticamente
  const startTokenRefresh = (user: User) => {
    setInterval(
      async () => {
        try {
          const newToken = await getIdToken(user, true); // `true` força a atualização
          setToken(newToken);
          console.log("🔥 Token atualizado com sucesso!");
        } catch (error) {
          console.error("Erro ao atualizar token:", error);
          logout(); // Se não puder atualizar, desloga o usuário
        }
      },
      30 * 60 * 1000
    ); // Atualiza o token a cada 55 minutos
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtém o token ao logar
      const idToken = await getIdToken(user);
      setToken(idToken);
      setUser(user);

      router.push("/Home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const signup = async (email: string, password: string, username: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name, // Aqui salvamos o nome no perfil do Firebase
      });

      // Obtém o token ao cadastrar
      const idToken = await getIdToken(user);
      setToken(idToken);
      setUser(user);

      console.log("Usuário criado:", user);
      router.push("/Home");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Usuário logado com Google:", result.user);
      router.push("/Home");
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("Usuário logado com GitHub:", result.user);
      router.push("/Home");
    } catch (error) {
      console.error("Erro ao fazer login com GitHub:", error);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    setToken(null);
    router.push("/");
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe um loading enquanto verifica a autenticação
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider };
