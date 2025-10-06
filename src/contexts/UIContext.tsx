"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UserProfile } from "../lib/types";
import { View, ToastMessage, UIState } from "../types/app.types";
import { FilterType } from "../components/FilterPanel";

interface UIContextType extends UIState {
  // Setters
  setCurrentView: (view: View) => void;
  setSelectedTripId: (id: string | null) => void;
  setSelectedExpenseTripId: (id: string | null) => void;
  setShowSuccessAnimation: (show: boolean) => void;
  setToast: (toast: ToastMessage | null) => void;
  setShowSearchUsers: (show: boolean) => void;
  setShowNewTripForm: (show: boolean) => void;
  setShowNewEventForm: (show: boolean) => void;
  setShowNewMemoryForm: (show: boolean) => void;
  setShowNewExpenseForm: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowProfileMenu: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  setActiveTripTab: (tab: "timeline" | "memories" | "expenses" | "gallery" | "checklist") => void;

  // Profile state
  selectedProfile: UserProfile | null;
  setSelectedProfile: (profile: UserProfile | null) => void;

  // Actions
  showToast: (message: string, type: "success" | "error" | "info") => void;
  closeAllModals: () => void;
  navigateToTrip: (tripId: string) => void;
  navigateToDashboard: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedExpenseTripId, setSelectedExpenseTripId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showSearchUsers, setShowSearchUsers] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [showNewMemoryForm, setShowNewMemoryForm] = useState(false);
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeTripTab, setActiveTripTab] = useState<
    "timeline" | "memories" | "expenses" | "gallery" | "checklist"
  >("timeline");

  // Actions
  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });

    // Auto-dismiss após 3 segundos
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const closeAllModals = useCallback(() => {
    setShowNewTripForm(false);
    setShowNewEventForm(false);
    setShowNewMemoryForm(false);
    setShowNewExpenseForm(false);
    setShowSettings(false);
    setShowProfileMenu(false);
    setShowSearchUsers(false);
  }, []);

  const navigateToTrip = useCallback((tripId: string) => {
    setSelectedTripId(tripId);
    setCurrentView("trip");
  }, []);

  const navigateToDashboard = useCallback(() => {
    setCurrentView("dashboard");
    setSelectedTripId(null);
  }, []);

  const value: UIContextType = {
    currentView,
    selectedTripId,
    selectedExpenseTripId,
    showSuccessAnimation,
    toast,
    showSearchUsers,
    showNewTripForm,
    showNewEventForm,
    showNewMemoryForm,
    showNewExpenseForm,
    showSettings,
    showProfileMenu,
    searchQuery,
    activeFilter,
    activeTripTab,
    selectedProfile,
    setCurrentView,
    setSelectedTripId,
    setSelectedExpenseTripId,
    setShowSuccessAnimation,
    setToast,
    setShowSearchUsers,
    setShowNewTripForm,
    setShowNewEventForm,
    setShowNewMemoryForm,
    setShowNewExpenseForm,
    setShowSettings,
    setShowProfileMenu,
    setSearchQuery,
    setActiveFilter,
    setActiveTripTab,
    setSelectedProfile,
    showToast,
    closeAllModals,
    navigateToTrip,
    navigateToDashboard,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
}
