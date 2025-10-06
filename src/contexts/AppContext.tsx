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

  // Trips persistidos em localStorage (demos serão exibidas apenas via camada de visualização)
  const [trips, setTrips] = useLocalStorage<Trip[]>("trips", []);
  const [events, setEvents] = useLocalStorage<Event[]>("events", []);
  const [memories, setMemories] = useLocalStorage<Memory[]>("memories", []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [checklistItems, setChecklistItems] = useLocalStorage<ChecklistItem[]>("checklist", []);

  // Actions
  const addTrip = useCallback(
    (trip: Trip) => {
      setTrips([...trips, trip]);
    },
    [trips, setTrips]
  );

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
