"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UserProfile } from "../lib/types";
import { UserSettings, Trip, Event, Memory, Expense, ChecklistItem } from "../types/app.types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Language } from "../lib/i18n";

interface AppContextType {
  // User state
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;

  // Settings
  userSettings: UserSettings;
  setUserSettings: (settings: UserSettings) => void;

  // Data
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  memories: Memory[];
  setMemories: (memories: Memory[]) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  checklistItems: ChecklistItem[];
  setChecklistItems: (items: ChecklistItem[]) => void;

  // Actions
  addTrip: (trip: Trip) => void;
  addEvent: (event: Event) => void;
  addMemory: (memory: Memory) => void;
  addExpense: (expense: Expense) => void;
  addChecklistItem: (item: ChecklistItem) => void;
  updateChecklistItem: (id: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>("userSettings", {
    name: "",
    language: "pt-BR" as Language,
    theme: "teal",
    onboarded: false,
  });

  // Dados de exemplo com imagens
  const [trips, setTrips] = useState<Trip[]>([
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
  ]);
  const [events, setEvents] = useLocalStorage<Event[]>("events", []);
  const [memories, setMemories] = useLocalStorage<Memory[]>("memories", []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [checklistItems, setChecklistItems] = useLocalStorage<ChecklistItem[]>("checklist", []);

  // Actions
  const addTrip = useCallback((trip: Trip) => {
    setTrips((prev) => [...prev, trip]);
  }, []);

  const addEvent = useCallback(
    (event: Event) => {
      setEvents([...events, event]);
    },
    [events]
  );

  const addMemory = useCallback(
    (memory: Memory) => {
      setMemories([...memories, memory]);
    },
    [memories]
  );

  const addExpense = useCallback(
    (expense: Expense) => {
      setExpenses([...expenses, expense]);
    },
    [expenses]
  );

  const addChecklistItem = useCallback(
    (item: ChecklistItem) => {
      setChecklistItems([...checklistItems, item]);
    },
    [checklistItems]
  );

  const updateChecklistItem = useCallback(
    (id: string, updates: Partial<ChecklistItem>) => {
      setChecklistItems(
        checklistItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    [checklistItems]
  );

  const deleteChecklistItem = useCallback(
    (id: string) => {
      setChecklistItems(checklistItems.filter((item) => item.id !== id));
    },
    [checklistItems]
  );

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    userSettings,
    setUserSettings,
    trips,
    setTrips,
    events,
    setEvents,
    memories,
    setMemories,
    expenses,
    setExpenses,
    checklistItems,
    setChecklistItems,
    addTrip,
    addEvent,
    addMemory,
    addExpense,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
