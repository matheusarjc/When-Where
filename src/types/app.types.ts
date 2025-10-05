import { Language } from "../lib/i18n";
import { FilterType } from "../components/FilterPanel";

export interface UserSettings {
  name: string;
  language: Language;
  theme: "teal" | "purple" | "blue" | "pink";
  onboarded: boolean;
}

export type TripRole = "owner" | "editor" | "viewer";

export interface TripCollaborator {
  userId: string;
  role: TripRole;
  joinedAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  coverUrl: string;
  isPublic: boolean;
  collaborators: TripCollaborator[];
  invitedUsers: string[];
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  tripId?: string;
  text: string;
  completed: boolean;
  category: "documents" | "packing" | "bookings" | "tasks" | "other";
  createdAt: string;
}

export interface Event {
  id: string;
  tripId: string;
  title: string;
  location: string;
  startDate: string;
  endDate?: string;
  kind: string;
}

export interface Memory {
  id: string;
  tripId?: string;
  type: "note" | "photo" | "tip";
  content: string;
  mediaUrl?: string;
  openAt?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  category: "hotel" | "food" | "transport" | "activity" | "shopping" | "other";
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdAt: string;
}

export type View = "dashboard" | "trip" | "share" | "gallery" | "profile" | "search" | "expenses";

export interface ToastMessage {
  message: string;
  type: "success" | "error" | "info";
}

export interface UIState {
  currentView: View;
  selectedTripId: string | null;
  selectedExpenseTripId: string | null;
  showSuccessAnimation: boolean;
  toast: ToastMessage | null;
  showSearchUsers: boolean;
  showNewTripForm: boolean;
  showNewEventForm: boolean;
  showNewMemoryForm: boolean;
  showNewExpenseForm: boolean;
  showSettings: boolean;
  showProfileMenu: boolean;
  searchQuery: string;
  activeFilter: FilterType;
  activeTripTab: "timeline" | "memories" | "expenses" | "gallery" | "checklist";
}
