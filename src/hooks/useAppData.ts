import { useEffect, useMemo } from "react";
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

  // Carregar dados e iniciar listeners
  useEffect(() => {
    const user = getCurrentUser();
    if (user && !currentUser) {
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
    }
  }, []); // Run only once on mount

  return {
    currentUser,
    userSettings,
    displayTrips: trips,
    displayEvents: events,
    displayMemories: memories,
  };
}
