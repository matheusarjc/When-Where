import { useCallback } from "react";
import { useApp } from "../contexts/AppContext";
import { useUI } from "../contexts/UIContext";
import { createTrip } from "../lib/trips";
import { Trip, Event, Memory, Expense, ChecklistItem } from "../types/app.types";

export function useAppActions() {
  const { addTrip, addEvent, addMemory, addExpense, addChecklistItem, currentUser } = useApp();
  const { showToast } = useUI();

  // Trip actions
  const handleCreateTrip = useCallback(
    async (tripData: Omit<Trip, "id" | "createdAt">) => {
      try {
        if (!currentUser) {
          showToast("Usuário não autenticado", "error");
          return;
        }

        const trip = {
          ...tripData,
          id: `trip-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        // Se não estiver em demo mode, salvar no Firebase
        if (process.env.NODE_ENV === "production") {
          await createTrip({
            userId: currentUser.id,
            title: trip.title,
            location: trip.location,
            startDate: trip.startDate,
            endDate: trip.endDate,
            coverUrl: trip.coverUrl,
            isPublic: trip.isPublic,
          });
        }

        addTrip(trip);
        showToast("Viagem criada com sucesso! ���", "success");
      } catch (error) {
        console.error("Erro ao criar viagem:", error);
        showToast("Erro ao criar viagem", "error");
      }
    },
    [addTrip, currentUser, showToast]
  );

  // Event actions
  const handleCreateEvent = useCallback(
    (eventData: Omit<Event, "id">) => {
      const event = {
        ...eventData,
        id: `event-${Date.now()}`,
      };
      addEvent(event);
      showToast("Evento criado com sucesso!", "success");
    },
    [addEvent, showToast]
  );

  // Memory actions
  const handleCreateMemory = useCallback(
    (memoryData: Omit<Memory, "id" | "createdAt">) => {
      const memory = {
        ...memoryData,
        id: `memory-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addMemory(memory);
      showToast("Memória criada com sucesso!", "success");
    },
    [addMemory, showToast]
  );

  // Expense actions
  const handleCreateExpense = useCallback(
    (expenseData: Omit<Expense, "id" | "createdAt">) => {
      const expense = {
        ...expenseData,
        id: `expense-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addExpense(expense);
      showToast("Despesa adicionada com sucesso!", "success");
    },
    [addExpense, showToast]
  );

  // Checklist actions
  const handleAddChecklistItem = useCallback(
    (itemData: Omit<ChecklistItem, "id" | "createdAt">) => {
      const item = {
        ...itemData,
        id: `checklist-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addChecklistItem(item);
      showToast("Item adicionado ao checklist!", "success");
    },
    [addChecklistItem, showToast]
  );

  return {
    handleCreateTrip,
    handleCreateEvent,
    handleCreateMemory,
    handleCreateExpense,
    handleAddChecklistItem,
  };
}
