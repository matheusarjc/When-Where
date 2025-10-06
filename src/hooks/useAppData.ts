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

    // Em desenvolvimento, evite sobrescrever trips locais com Firestore (inexistente/sem perms)
    if (process.env.NODE_ENV === "production") {
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
    return;
  }, [currentUser, userSettings.onboarded, setCurrentUser, setUserSettings, setTrips]);

  // Memoizar o retorno para evitar re-renders desnecessários
  return useMemo(
    () => ({
      currentUser,
      userSettings,
      // Exibir demos somente se não houver nenhuma viagem do usuário
      displayTrips:
        trips && trips.length > 0
          ? trips
          : [
              {
                id: "demo-roma",
                userId: "demo-user",
                title: "Verão em Roma",
                location: "Roma, Itália",
                startDate: "2024-10-25",
                endDate: "2024-11-02",
                coverUrl:
                  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwaXRhbGlhfGVufDF8fHx8MTc1OTM2MjAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
                isPublic: false,
                collaborators: [],
                invitedUsers: [],
                createdAt: "2024-01-15T10:00:00Z",
              },
              {
                id: "demo-tokyo",
                userId: "demo-user",
                title: "Aventura em Tóquio",
                location: "Tóquio, Japão",
                startDate: "2024-12-10",
                endDate: "2024-12-20",
                coverUrl:
                  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFvfGVufDF8fHx8MTc1OTM2MjAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
                isPublic: false,
                collaborators: [],
                invitedUsers: [],
                createdAt: "2024-02-20T14:30:00Z",
              },
              {
                id: "demo-bali",
                userId: "demo-user",
                title: "Paraíso Tropical",
                location: "Bali, Indonésia",
                startDate: "2025-01-15",
                endDate: "2025-01-25",
                coverUrl:
                  "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwaW5kb25lc2lhfGVufDF8fHx8MTc1OTM2MjAwNXww&ixlib=rb-4.1.0&q=80&w=1080",
                isPublic: false,
                collaborators: [],
                invitedUsers: [],
                createdAt: "2024-03-10T09:15:00Z",
              },
            ],
      displayEvents: events,
      displayMemories: memories,
      expenses: [], // TODO: Implementar expenses no useAppData
      checklistItems: [], // TODO: Implementar checklistItems no useAppData
    }),
    [currentUser, userSettings, trips, events, memories]
  );
}
