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
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Só finaliza o carregamento após verificar a autenticação
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Carregando...</p>; // Exibe um loading enquanto verifica a autenticação
  }

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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

      console.log("Usuário criado:", user);
      router.push("/Home");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  const logout = () => {
    signOut(auth);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
