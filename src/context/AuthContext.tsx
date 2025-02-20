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
  loading: boolean;
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
  let refreshInterval: NodeJS.Timeout | undefined;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await getIdToken(user);
        setToken(idToken);
        setUser(user);
        startTokenRefresh(user);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (refreshInterval) clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTokenRefresh = (user: User) => {
    // Limpa qualquer intervalo anterior
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(
      async () => {
        try {
          const newToken = await getIdToken(user, true);
          setToken(newToken);
          console.log("🔥 Token atualizado com sucesso!");
        } catch (error) {
          console.error("Erro ao atualizar token:", error);
          logout();
        }
      },
      30 * 60 * 1000
    );
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
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
      await updateProfile(user, { displayName: name });
      const idToken = await getIdToken(user);
      setToken(idToken);
      setUser(user);
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

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, loginWithGoogle, loginWithGithub, logout }}>
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
