"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { UserProfile } from "./types";
import { getUserProfile, upsertUserProfile } from "./user";

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o Firebase está disponível
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }
      const base: UserProfile = {
        id: u.uid,
        email: u.email || "",
        fullName: u.displayName || (u.email ? u.email.split("@")[0] : "Usuário"),
        username: (u.email ? u.email.split("@")[0] : `user${u.uid.slice(0, 6)}`).toLowerCase(),
        avatar: u.photoURL || undefined,
        bio: undefined,
        isPublic: true,
        createdAt: new Date(),
        following: [],
        followers: [],
        pendingRequests: [],
      };
      try {
        await upsertUserProfile(base);
        const saved = await getUserProfile(u.uid);
        setUser({ ...base, ...saved });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>{children}</AuthContext.Provider>
  );
}
