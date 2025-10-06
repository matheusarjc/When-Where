"use client";

import React, { createContext, useContext, useMemo, useCallback, ReactNode } from "react";
import { Trip, Event, Memory, Expense, ChecklistItem, TripRole } from "../types/app.types";
import { UserProfile } from "../lib/types";
import { useApp } from "./AppContext";
import { useUI } from "./UIContext";

interface TripInvite {
  tripId: string;
  tripTitle: string;
  tripLocation: string;
  tripCover: string;
  invitedBy: string;
}

interface TripContextType {
  // Selected trip data
  selectedTrip: Trip | null;
  tripEvents: Event[];
  tripMemories: Memory[];
  tripExpenses: Expense[];
  tripChecklistItems: ChecklistItem[];

  // Trip invites
  pendingInvites: TripInvite[];

  // Trip actions
  inviteCollaborator: (tripId: string, userId: string) => void;
  acceptInvite: (tripId: string) => void;
  declineInvite: (tripId: string) => void;
  updateTripCollaborators: (tripId: string, collaborators: any[]) => void;
  promoteToAdmin: (tripId: string, userId: string) => void;
  demoteFromAdmin: (tripId: string, userId: string) => void;

  // Checklist actions
  addChecklistItem: (tripId: string, text: string, category: ChecklistItem["category"]) => void;
  toggleChecklistItem: (itemId: string) => void;
  deleteChecklistItem: (itemId: string) => void;

  // Trip utilities
  getTripById: (tripId: string) => Trip | undefined;
  getTripsByUser: (userId: string) => Trip[];
  getPublicTrips: () => Trip[];

  // Export and sharing
  exportTripToICS: (tripId: string) => void;
  shareTrip: (tripId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const {
    trips,
    setTrips,
    events,
    memories,
    expenses,
    checklistItems,
    setChecklistItems,
    currentUser,
  } = useApp();
  const { selectedTripId, showToast } = useUI();

  // Memoized trip data
  const selectedTrip = useMemo(() => {
    if (!selectedTripId) return null;
    return trips.find((t) => t.id === selectedTripId) || null;
  }, [trips, selectedTripId]);

  const tripEvents = useMemo(
    () => (selectedTripId ? events.filter((e) => e.tripId === selectedTripId) : []),
    [events, selectedTripId]
  );

  const tripMemories = useMemo(
    () => (selectedTripId ? memories.filter((m) => m.tripId === selectedTripId) : []),
    [memories, selectedTripId]
  );

  const tripExpenses = useMemo(
    () => (selectedTripId ? expenses.filter((e) => e.tripId === selectedTripId) : []),
    [expenses, selectedTripId]
  );

  const tripChecklistItems = useMemo(
    () => (selectedTripId ? checklistItems.filter((item) => item.tripId === selectedTripId) : []),
    [checklistItems, selectedTripId]
  );

  // Pending invites
  const pendingInvites = useMemo(() => {
    if (!currentUser) return [];

    return trips
      .filter((t) => t.invitedUsers.includes(currentUser.id))
      .map((t) => ({
        tripId: t.id,
        tripTitle: t.title,
        tripLocation: t.location,
        tripCover: t.coverUrl,
        invitedBy: t.userId,
      }));
  }, [trips, currentUser]);

  // Trip actions
  const inviteCollaborator = useCallback(
    (tripId: string, userId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      const updatedTrip = {
        ...trip,
        invitedUsers: [...trip.invitedUsers, userId],
      };

      setTrips(trips.map((t) => (t.id === tripId ? updatedTrip : t)));
      showToast("Convite enviado com sucesso!", "success");
    },
    [trips, setTrips, showToast]
  );

  const acceptInvite = useCallback(
    (tripId: string) => {
      if (!currentUser) return;

      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      const updatedTrip = {
        ...trip,
        collaborators: [
          ...trip.collaborators,
          {
            userId: currentUser.id,
            role: "editor" as TripRole,
            joinedAt: new Date().toISOString(),
          },
        ],
        invitedUsers: trip.invitedUsers.filter((id) => id !== currentUser.id),
      };

      setTrips(trips.map((t) => (t.id === tripId ? updatedTrip : t)));
      showToast("Convite aceito com sucesso!", "success");
    },
    [trips, setTrips, currentUser, showToast]
  );

  const declineInvite = useCallback(
    (tripId: string) => {
      if (!currentUser) return;

      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      const updatedTrip = {
        ...trip,
        invitedUsers: trip.invitedUsers.filter((id) => id !== currentUser.id),
      };

      setTrips(trips.map((t) => (t.id === tripId ? updatedTrip : t)));
      showToast("Convite recusado", "info");
    },
    [trips, setTrips, currentUser, showToast]
  );

  const updateTripCollaborators = useCallback(
    (tripId: string, collaborators: any[]) => {
      const updatedTrips = trips.map((t) => (t.id === tripId ? { ...t, collaborators } : t));
      setTrips(updatedTrips);
    },
    [trips, setTrips]
  );

  const promoteToAdmin = useCallback(
    (tripId: string, userId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;
      // Não permitir mudanças no owner
      if (userId === trip.userId) return;
      const updated = {
        ...trip,
        collaborators: trip.collaborators.map((c) =>
          c.userId === userId ? { ...c, role: "editor" } : c
        ),
      };
      setTrips(trips.map((t) => (t.id === tripId ? updated : t)));
      showToast("Colaborador promovido a administrador", "success");
    },
    [trips, setTrips, showToast]
  );

  const demoteFromAdmin = useCallback(
    (tripId: string, userId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;
      if (userId === trip.userId) return;
      const updated = {
        ...trip,
        collaborators: trip.collaborators.map((c) =>
          c.userId === userId ? { ...c, role: "viewer" } : c
        ),
      };
      setTrips(trips.map((t) => (t.id === tripId ? updated : t)));
      showToast("Administrador rebaixado para convidado", "info");
    },
    [trips, setTrips, showToast]
  );

  // Checklist actions
  const addChecklistItem = useCallback(
    (tripId: string, text: string, category: ChecklistItem["category"]) => {
      const newItem: ChecklistItem = {
        id: `checklist-${Date.now()}`,
        tripId,
        text,
        completed: false,
        category,
        createdAt: new Date().toISOString(),
      };

      setChecklistItems([...checklistItems, newItem]);
      showToast("Item adicionado ao checklist!", "success");
    },
    [checklistItems, setChecklistItems, showToast]
  );

  const toggleChecklistItem = useCallback(
    (itemId: string) => {
      setChecklistItems(
        checklistItems.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      );
    },
    [checklistItems, setChecklistItems]
  );

  const deleteChecklistItem = useCallback(
    (itemId: string) => {
      setChecklistItems(checklistItems.filter((item) => item.id !== itemId));
      showToast("Item removido do checklist", "info");
    },
    [checklistItems, setChecklistItems, showToast]
  );

  // Trip utilities
  const getTripById = useCallback(
    (tripId: string) => {
      return trips.find((t) => t.id === tripId);
    },
    [trips]
  );

  const getTripsByUser = useCallback(
    (userId: string) => {
      return trips.filter((t) => t.userId === userId);
    },
    [trips]
  );

  const getPublicTrips = useCallback(() => {
    return trips.filter((t) => t.isPublic);
  }, [trips]);

  // Export and sharing
  const exportTripToICS = useCallback(
    (tripId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      // TODO: Implement ICS export
      console.log("Exporting trip to ICS:", trip);
      showToast("Exportação iniciada!", "info");
    },
    [trips, showToast]
  );

  const shareTrip = useCallback(
    (tripId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      // TODO: Implement sharing
      const shareUrl = `${window.location.origin}/share/${tripId}`;
      navigator.clipboard.writeText(shareUrl);
      showToast("Link copiado para a área de transferência!", "success");
    },
    [trips, showToast]
  );

  const value: TripContextType = {
    selectedTrip,
    tripEvents,
    tripMemories,
    tripExpenses,
    tripChecklistItems,
    pendingInvites,
    inviteCollaborator,
    acceptInvite,
    declineInvite,
    updateTripCollaborators,
    promoteToAdmin,
    demoteFromAdmin,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    getTripById,
    getTripsByUser,
    getPublicTrips,
    exportTripToICS,
    shareTrip,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within TripProvider");
  }
  return context;
}
