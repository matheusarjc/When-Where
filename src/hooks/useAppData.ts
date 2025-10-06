import { useEffect, useMemo, useRef } from "react";
import { useApp } from "../contexts/AppContext";
import { getCurrentUser } from "../lib/auth";
import { listenUserTrips } from "../lib/trips";

export function useAppData() {
  const {
    currentUser,
    setCurrentUser,
    userSettings,
    setUserSettings,
    trips,
    setTrips,
    events,
    memories,
  } = useApp();

  // Ref para controlar se já foi inicializado
  const initializedRef = useRef(false);

  // Carregar dados e iniciar listeners
  useEffect(() => {
    // Guard: só executar se não foi inicializado e não há usuário atual
    if (initializedRef.current || currentUser) return;

    const user = getCurrentUser();
    if (!user) return;

    // Marcar como inicializado
    initializedRef.current = true;
    setCurrentUser(user);

    // Configurar settings iniciais se não onboarded
    if (!userSettings.onboarded) {
      setUserSettings({
        name: user.fullName,
        language: "pt-BR",
        theme: "teal",
        onboarded: true,
      });
    }

    // Listener de trips do usuário (Firestore)
    const unsubscribeTrips = listenUserTrips(user.id, (docs) => {
      const mapped = docs.map((d) => ({
        id: d.id!,
        userId: d.userId,
        title: d.title,
        location: d.location,
        startDate: d.startDate,
        endDate: d.endDate,
        coverUrl: d.coverUrl,
        isPublic: d.isPublic,
        collaborators: [],
        invitedUsers: [],
        createdAt: new Date().toISOString(),
      }));
      setTrips(mapped);
    });

    return () => {
      unsubscribeTrips();
    };
  }, [currentUser, userSettings.onboarded, setCurrentUser, setUserSettings, setTrips]);

  // Memoizar o retorno para evitar re-renders desnecessários
  return useMemo(
    () => ({
      currentUser,
      userSettings,
      displayTrips: trips,
      displayEvents: events,
      displayMemories: memories,
      expenses: [], // TODO: Implementar expenses no useAppData
      checklistItems: [], // TODO: Implementar checklistItems no useAppData
    }),
    [currentUser, userSettings, trips, events, memories]
  );
}
