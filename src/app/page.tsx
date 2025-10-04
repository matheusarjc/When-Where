"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Plus,
  Download,
  Share2,
  Sparkles,
  Calendar as CalendarIcon,
  ArrowLeft,
  Settings,
  ImageIcon,
  Menu,
  Trophy,
  Zap,
  StickyNote,
  DollarSign,
  MapPin,
  Search,
  LogOut,
  User,
} from "lucide-react";
import { TripCard } from "../components/TripCard";
import { TimelineItem } from "../components/TimelineItem";
import { MemoryCard } from "../components/MemoryCard";
import { DynamicCover } from "../components/DynamicCover";
import { Countdown } from "../components/Countdown";
import { NewTripForm } from "../components/NewTripForm";
import { NewEventForm } from "../components/NewEventForm";
import { NewMemoryForm } from "../components/NewMemoryForm";
import { OnboardingForm } from "../components/OnboardingForm";
import { SettingsForm } from "../components/SettingsForm";
import { SearchBar } from "../components/SearchBar";
import { FilterPanel, FilterType } from "../components/FilterPanel";
import { PhotoGallery } from "../components/PhotoGallery";
import { Toast } from "../components/Toast";
import { ProgressBadge } from "../components/ProgressBadge";
import { QuickAction } from "../components/QuickAction";
import { AuthScreen } from "../components/AuthScreen";
import { ProfilePage } from "../components/ProfilePage";
import { SearchUsers } from "../components/SearchUsers";
import { ProfileMenu } from "../components/ProfileMenu";
import { ExpenseManager } from "../components/ExpenseManager";
import { ExpenseOverview } from "../components/ExpenseOverview";
import { ExpenseCard } from "../components/ExpenseCard";
import { NewExpenseForm } from "../components/NewExpenseForm";
import { TripTabs } from "../components/TripTabs";
import { TripCollaborators } from "../components/TripCollaborators";
import { TripInvites } from "../components/TripInvites";
import { TravelChecklist } from "../components/TravelChecklist";
import { Button } from "../components/ui/button";
import { Language, t } from "../lib/i18n";
import { UserProfile } from "../lib/types";
import { getCurrentUser, logout, followUser, unfollowUser } from "../lib/auth";
import { createTrip, listenUserTrips, TripDoc } from "../lib/trips";

interface UserSettings {
  name: string;
  language: Language;
  theme: "teal" | "purple" | "blue" | "pink";
  onboarded: boolean;
}

type TripRole = "owner" | "editor" | "viewer";

interface TripCollaborator {
  userId: string;
  role: TripRole;
  joinedAt: string;
}

interface Trip {
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

interface ChecklistItem {
  id: string;
  tripId?: string;
  text: string;
  completed: boolean;
  category: "documents" | "packing" | "bookings" | "tasks" | "other";
  createdAt: string;
}

interface Event {
  id: string;
  tripId: string;
  title: string;
  location: string;
  startDate: string;
  endDate?: string;
  kind: string;
}

interface Memory {
  id: string;
  tripId?: string;
  type: "note" | "photo" | "tip";
  content: string;
  mediaUrl?: string;
  openAt?: string;
  createdAt: string;
}

interface Expense {
  id: string;
  tripId: string;
  category: "hotel" | "food" | "transport" | "activity" | "shopping" | "other";
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdAt: string;
}

type View = "dashboard" | "trip" | "share" | "gallery" | "profile" | "search" | "expenses";

// Dados demo para showcase
const DEMO_TRIPS: Trip[] = [
  {
    id: "1",
    userId: "demo-user",
    title: "Verão em Roma",
    location: "Roma, Itália",
    startDate: "2025-10-25T00:00:00",
    endDate: "2025-11-02T00:00:00",
    coverUrl:
      "https://images.unsplash.com/photo-1712595706714-a5c5ba55edfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMHN1bnNldHxlbnwxfHx8fDE3NTkzNjIwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: true,
    collaborators: [],
    invitedUsers: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "demo-user",
    title: "Aventura em Tóquio",
    location: "Tóquio, Japão",
    startDate: "2025-12-10T00:00:00",
    endDate: "2025-12-20T00:00:00",
    coverUrl:
      "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTM4MzgwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: false,
    collaborators: [],
    invitedUsers: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "demo-user",
    title: "Paraíso Tropical",
    location: "Bali, Indonésia",
    startDate: "2026-01-15T00:00:00",
    endDate: "2026-01-25T00:00:00",
    coverUrl:
      "https://images.unsplash.com/photo-1702743599501-a821d0b38b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHBhcmFkaXNlJTIwdHJvcGljYWx8ZW58MXx8fHwxNzU5NDI0NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isPublic: true,
    collaborators: [],
    invitedUsers: [],
    createdAt: new Date().toISOString(),
  },
];

const DEMO_EVENTS: Event[] = [
  {
    id: "e1",
    tripId: "1",
    title: "Voo para Roma",
    location: "Aeroporto Internacional",
    startDate: "2025-10-25T08:00:00",
    kind: "flight",
  },
  {
    id: "e2",
    tripId: "1",
    title: "Check-in Hotel Colosseum",
    location: "Via Roma, 123",
    startDate: "2025-10-25T14:00:00",
    endDate: "2025-10-25T15:00:00",
    kind: "hotel",
  },
  {
    id: "e3",
    tripId: "1",
    title: "Tour pelo Coliseu",
    location: "Coliseu de Roma",
    startDate: "2025-10-26T10:00:00",
    endDate: "2025-10-26T13:00:00",
    kind: "activity",
  },
  {
    id: "e4",
    tripId: "1",
    title: "Jantar na Piazza Navona",
    location: "Ristorante Bella Vista",
    startDate: "2025-10-26T20:00:00",
    endDate: "2025-10-26T22:30:00",
    kind: "restaurant",
  },
];

const DEMO_MEMORIES: Memory[] = [
  {
    id: "m1",
    tripId: "1",
    type: "tip",
    content:
      "Reserve os ingressos do Coliseu com pelo menos 2 semanas de antecedência para evitar filas enormes. A entrada da manhã é menos lotada!",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    tripId: "1",
    type: "note",
    content:
      "A vista do pôr do sol no Coliseu foi absolutamente mágica. Um momento que ficará para sempre na memória. 🌅",
    openAt: "2025-11-10T00:00:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m3",
    type: "photo",
    content: "Preparativos para Roma! Mal posso esperar para explorar a cidade eterna.",
    mediaUrl:
      "https://images.unsplash.com/photo-1631684181713-e697596d2165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NTk0MjMyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "m4",
    tripId: "1",
    type: "photo",
    content: "O Coliseu ao pôr do sol",
    mediaUrl:
      "https://images.unsplash.com/photo-1712595706714-a5c5ba55edfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMHN1bnNldHxlbnwxfHx8fDE3NTkzNjIwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    language: "pt-BR",
    theme: "teal",
    onboarded: false,
  });

  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedExpenseTripId, setSelectedExpenseTripId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showSearchUsers, setShowSearchUsers] = useState(false);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

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

  // Carregar dados e iniciar listeners
  useEffect(() => {
    // Check authentication
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
    }

    // Load saved data
    const savedSettings = localStorage.getItem("userSettings");
    const savedTrips = localStorage.getItem("trips");
    const savedEvents = localStorage.getItem("events");
    const savedMemories = localStorage.getItem("memories");
    const savedExpenses = localStorage.getItem("expenses");
    const savedChecklist = localStorage.getItem("checklist");
    const savedDemoMode = localStorage.getItem("demoMode");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setUserSettings(settings);
    } else if (user) {
      setUserSettings({
        name: user.fullName,
        language: "pt-BR",
        theme: "teal",
        onboarded: true,
      });
    }

    if (savedDemoMode !== null) {
      setDemoMode(savedDemoMode === "true");
    }

    // Listener de trips do usuário (Firestore)
    let unsubscribeTrips: (() => void) | undefined;
    if (user) {
      unsubscribeTrips = listenUserTrips(user.id, (docs) => {
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
    }

    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error("Error parsing events:", e);
      }
    }

    if (savedMemories) {
      try {
        setMemories(JSON.parse(savedMemories));
      } catch (e) {
        console.error("Error parsing memories:", e);
      }
    }

    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error("Error parsing expenses:", e);
      }
    }

    if (savedChecklist) {
      try {
        setChecklistItems(JSON.parse(savedChecklist));
      } catch (e) {
        console.error("Error parsing checklist:", e);
      }
    }
    return () => {
      if (unsubscribeTrips) unsubscribeTrips();
    };
  }, []);

  // Salvar no localStorage (com debounce implícito via useEffect)
  useEffect(() => {
    if (userSettings.onboarded && userSettings.name) {
      try {
        localStorage.setItem("userSettings", JSON.stringify(userSettings));
      } catch (e) {
        console.error("Error saving settings:", e);
      }
    }
  }, [userSettings]);

  // Removido: trips agora vem do Firestore

  useEffect(() => {
    if (events.length > 0) {
      try {
        localStorage.setItem("events", JSON.stringify(events));
      } catch (e) {
        console.error("Error saving events:", e);
      }
    }
  }, [events]);

  useEffect(() => {
    if (memories.length > 0) {
      try {
        localStorage.setItem("memories", JSON.stringify(memories));
      } catch (e) {
        console.error("Error saving memories:", e);
      }
    }
  }, [memories]);

  useEffect(() => {
    if (expenses.length > 0) {
      try {
        localStorage.setItem("expenses", JSON.stringify(expenses));
      } catch (e) {
        console.error("Error saving expenses:", e);
      }
    }
  }, [expenses]);

  useEffect(() => {
    if (checklistItems.length > 0) {
      try {
        localStorage.setItem("checklist", JSON.stringify(checklistItems));
      } catch (e) {
        console.error("Error saving checklist:", e);
      }
    }
  }, [checklistItems]);

  const displayTrips = demoMode ? DEMO_TRIPS : trips;
  const displayEvents = demoMode ? DEMO_EVENTS : events;
  const displayMemories = demoMode ? DEMO_MEMORIES : memories;

  const selectedTrip = displayTrips.find((t) => t.id === selectedTripId);
  const tripEvents = displayEvents.filter((e) => e.tripId === selectedTripId);
  const tripMemories = displayMemories.filter((m) => m.tripId === selectedTripId);

  const nextTrip = displayTrips
    .filter((t) => new Date(t.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  // Filtrar e buscar memórias
  const filteredMemories = displayMemories.filter((memory) => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "capsule" && memory.openAt) ||
      (activeFilter !== "capsule" && memory.type === activeFilter);
    return matchesSearch && matchesFilter;
  });

  // Contar memórias por tipo
  const memoryCounts = {
    all: displayMemories.length,
    note: displayMemories.filter((m) => m.type === "note").length,
    photo: displayMemories.filter((m) => m.type === "photo").length,
    tip: displayMemories.filter((m) => m.type === "tip").length,
    capsule: displayMemories.filter((m) => m.openAt).length,
  };

  // Extrair fotos para galeria
  const photoMemories = displayMemories
    .filter((m) => m.type === "photo" && m.mediaUrl)
    .map((m) => ({
      id: m.id,
      url: m.mediaUrl!,
      caption: m.content,
      date: m.createdAt,
    }));

  const handleOnboardingComplete = (data: Omit<UserSettings, "onboarded">) => {
    const newSettings = { ...data, onboarded: true };
    setUserSettings(newSettings);
  };

  const handleSettingsSave = (settings: Omit<UserSettings, "onboarded">) => {
    setUserSettings({ ...settings, onboarded: true });
    setShowSettings(false);
  };

  const handleCreateTrip = async (
    tripData: Omit<
      Trip,
      "id" | "userId" | "collaborators" | "invitedUsers" | "createdAt" | "isPublic"
    >
  ) => {
    if (!currentUser) return;
    await createTrip({
      userId: currentUser.id,
      title: tripData.title,
      location: tripData.location,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      coverUrl: tripData.coverUrl,
      isPublic: true,
    });
    setShowNewTripForm(false);
    if (demoMode) setDemoMode(false);

    // Show success animation and toast
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    setToast({
      message: t("toast.tripCreated", userSettings.language) || "✨ Viagem criada com sucesso!",
      type: "success",
    });
  };

  const handleCreateEvent = (eventData: Omit<Event, "id" | "tripId">) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      tripId: selectedTripId || "",
      ...eventData,
    };
    setEvents([...events, newEvent]);
    setShowNewEventForm(false);
    if (demoMode) setDemoMode(false);

    // Show success animation and toast
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    setToast({
      message: t("toast.eventCreated", userSettings.language) || "✅ Evento adicionado!",
      type: "success",
    });
  };

  const handleCreateMemory = (memoryData: Omit<Memory, "id" | "createdAt" | "tripId">) => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      tripId: selectedTripId || undefined,
      createdAt: new Date().toISOString(),
      ...memoryData,
    };
    setMemories([...memories, newMemory]);
    setShowNewMemoryForm(false);
    if (demoMode) setDemoMode(false);

    // Show success animation and toast
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    setToast({
      message: t("toast.memoryCreated", userSettings.language) || "📝 Memória salva!",
      type: "success",
    });
  };

  const handleCreateExpense = (expenseData: Omit<Expense, "id" | "createdAt" | "tripId">) => {
    // tripId é obrigatório - usa selectedTripId ou selectedExpenseTripId
    const tripId = selectedTripId || selectedExpenseTripId;
    if (!tripId) {
      setToast({ message: "⚠️ Selecione uma viagem primeiro!", type: "error" });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      tripId,
      createdAt: new Date().toISOString(),
      ...expenseData,
    };
    setExpenses([...expenses, newExpense]);
    setShowNewExpenseForm(false);
    if (demoMode) setDemoMode(false);

    // Show success animation and toast
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    setToast({
      message: t("toast.expenseCreated", userSettings.language) || "💰 Despesa registrada!",
      type: "success",
    });
  };

  const handleViewTrip = (tripId: string) => {
    setSelectedTripId(tripId);
    setCurrentView("trip");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedTripId(null);
    setSelectedExpenseTripId(null);
  };

  const handleShare = () => {
    setCurrentView("share");
  };

  const handleExportICS = () => {
    if (!selectedTrip) return;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Travel Planner//PT
BEGIN:VEVENT
UID:${selectedTrip.id}@travelplanner.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${new Date(selectedTrip.startDate).toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${new Date(selectedTrip.endDate).toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${selectedTrip.title}
LOCATION:${selectedTrip.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTrip.title.replace(/\s+/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning", userSettings.language);
    if (hour < 18) return t("greeting.afternoon", userSettings.language);
    return t("greeting.evening", userSettings.language);
  };

  const themeColors = {
    teal: "bg-teal-400 hover:bg-teal-500",
    purple: "bg-purple-500 hover:bg-purple-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    pink: "bg-pink-500 hover:bg-pink-600",
  };

  const themeColor = themeColors[userSettings.theme];

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Mostrar autenticação se não logado
  if (!currentUser) {
    return (
      <AuthScreen
        language={userSettings.language}
        onAuth={(user) => {
          setCurrentUserState(user);
          setUserSettings({
            name: user.fullName,
            language: userSettings.language,
            theme: userSettings.theme,
            onboarded: true,
          });
        }}
      />
    );
  }

  // Mostrar onboarding se não foi completado
  if (!userSettings.onboarded) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  // Handler para logout
  const handleLogout = () => {
    logout();
    setCurrentUserState(null);
    setUserSettings({
      name: "",
      language: "pt-BR",
      theme: "teal",
      onboarded: false,
    });
  };

  // Handlers para perfil
  const handleViewProfile = (user?: UserProfile) => {
    if (user) {
      setSelectedProfile(user);
    } else {
      setSelectedProfile(currentUser);
    }
    setCurrentView("profile");
  };

  const handleFollowUser = () => {
    if (selectedProfile && currentUser) {
      followUser(currentUser.id, selectedProfile.id, selectedProfile.isPublic);
      setToast({
        message: selectedProfile.isPublic ? "✅ Seguindo!" : "📤 Solicitação enviada!",
        type: "success",
      });
    }
  };

  const handleUnfollowUser = () => {
    if (selectedProfile && currentUser) {
      unfollowUser(currentUser.id, selectedProfile.id);
      setToast({
        message: "❌ Deixou de seguir",
        type: "info",
      });
    }
  };

  // Trip collaboration handlers
  const handleInviteCollaborator = (userId: string) => {
    if (!selectedTrip) return;

    const updatedTrip = {
      ...selectedTrip,
      invitedUsers: [...selectedTrip.invitedUsers, userId],
    };

    const updatedTrips = trips.map((t) => (t.id === selectedTrip.id ? updatedTrip : t));
    setTrips(updatedTrips);

    setToast({
      message: t("toast.collaboratorInvited", userSettings.language),
      type: "success",
    });
  };

  const handleAcceptInvite = (tripId: string) => {
    if (!currentUser) return;

    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    const updatedTrip = {
      ...trip,
      collaborators: [
        ...trip.collaborators,
        { userId: currentUser.id, role: "editor" as TripRole, joinedAt: new Date().toISOString() },
      ],
      invitedUsers: trip.invitedUsers.filter((id) => id !== currentUser.id),
    };

    const updatedTrips = trips.map((t) => (t.id === tripId ? updatedTrip : t));
    setTrips(updatedTrips);

    setToast({
      message: t("toast.inviteAccepted", userSettings.language),
      type: "success",
    });
  };

  const handleDeclineInvite = (tripId: string) => {
    if (!currentUser) return;

    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    const updatedTrip = {
      ...trip,
      invitedUsers: trip.invitedUsers.filter((id) => id !== currentUser.id),
    };

    const updatedTrips = trips.map((t) => (t.id === tripId ? updatedTrip : t));
    setTrips(updatedTrips);

    setToast({
      message: t("toast.inviteDeclined", userSettings.language),
      type: "info",
    });
  };

  // Checklist handlers
  const handleAddChecklistItem = (text: string, category: ChecklistItem["category"]) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      tripId: selectedTripId || undefined,
      text,
      completed: false,
      category,
      createdAt: new Date().toISOString(),
    };
    setChecklistItems([...checklistItems, newItem]);
    setToast({
      message: t("toast.checklistItemAdded", userSettings.language),
      type: "success",
    });
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  // Get pending invites for current user
  const pendingInvites = currentUser
    ? trips
        .filter((t) => t.invitedUsers.includes(currentUser.id))
        .map((t) => ({
          tripId: t.id,
          tripTitle: t.title,
          tripLocation: t.location,
          tripCover: t.coverUrl,
          invitedBy: t.userId,
        }))
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background ambient animation */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: prefersReducedMotion ? 1 : [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Success celebration animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              className="bg-teal-500/20 backdrop-blur-sm rounded-full p-12">
              <motion.div
                animate={{ rotate: prefersReducedMotion ? 0 : [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <Sparkles className="w-16 h-16 text-teal-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto px-4 py-8 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mb-12">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="mb-3">
                    {getGreeting()}, {userSettings.name}
                  </h1>
                  {nextTrip && (
                    <p className="text-white/40">
                      <Countdown to={nextTrip.startDate} /> para {nextTrip.title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSearchUsers(true)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                    aria-label="Buscar usuários">
                    <Search className="h-5 w-5" />
                  </motion.button>

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-0.5">
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                          {currentUser?.avatar ? (
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {showProfileMenu && (
                        <ProfileMenu
                          user={currentUser!}
                          language={userSettings.language}
                          isOpen={showProfileMenu}
                          onClose={() => setShowProfileMenu(false)}
                          onViewProfile={() => handleViewProfile()}
                          onSettings={() => setShowSettings(true)}
                          onLogout={handleLogout}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickAction
                icon={ImageIcon}
                title="Galeria"
                description="Veja suas fotos"
                count={photoMemories.length}
                onClick={() => setCurrentView("gallery")}
                index={0}
                gradient="bg-gradient-to-br from-purple-500 to-pink-500"
              />
              <QuickAction
                icon={StickyNote}
                title="Checklist"
                description="Organize sua viagem"
                count={checklistItems.filter((i) => !i.completed).length}
                onClick={() => {
                  if (displayTrips.length > 0) {
                    handleViewTrip(displayTrips[0].id);
                    setActiveTripTab("checklist");
                  } else {
                    setToast({ message: "📋 Crie uma viagem primeiro!", type: "info" });
                  }
                }}
                index={1}
                gradient="bg-gradient-to-br from-teal-500 to-cyan-500"
              />
              <QuickAction
                icon={DollarSign}
                title="Despesas"
                description="Controle seus gastos"
                count={expenses.length}
                onClick={() => setCurrentView("expenses")}
                index={2}
                gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              />
              <QuickAction
                icon={MapPin}
                title="Nova Viagem"
                description="Crie uma viagem"
                onClick={() => setShowNewTripForm(true)}
                index={3}
                gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
              />
            </motion.div>

            {/* Trips */}
            <div>
              <h2 className="mb-8">Minhas viagens</h2>
              {displayTrips.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mb-6 inline-flex p-4 rounded-full bg-white/5">
                    <MapPin className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/30 mb-6">Você ainda não tem viagens</p>
                  <Button
                    onClick={() => setShowNewTripForm(true)}
                    className="bg-teal-400 hover:bg-teal-500 text-black">
                    Criar viagem
                  </Button>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayTrips.map((trip, index) => (
                    <motion.div key={trip.id} variants={itemVariants}>
                      <TripCard {...trip} onClick={() => handleViewTrip(trip.id)} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {currentView === "trip" && selectedTrip && (
          <motion.div
            key="trip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-6xl mx-auto px-4 py-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 mb-8 text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>

            <div className="mb-8">
              <DynamicCover
                imageUrl={selectedTrip.coverUrl}
                title={selectedTrip.title}
                location={selectedTrip.location}
                startDate={selectedTrip.startDate}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportICS}
                    className="px-3 py-2 text-white/40 hover:text-white transition-colors">
                    Exportar
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-3 py-2 text-white/40 hover:text-white transition-colors">
                    Compartilhar
                  </button>
                  <Button
                    onClick={() => setShowNewEventForm(true)}
                    className="bg-teal-400 hover:bg-teal-500 text-black ml-auto">
                    Novo evento
                  </Button>
                  <Button
                    onClick={() => setShowNewMemoryForm(true)}
                    variant="outline"
                    className="border-white/10">
                    Nova memória
                  </Button>
                </div>

                <TripTabs
                  activeTab={activeTripTab}
                  onTabChange={setActiveTripTab}
                  language={userSettings.language}
                  counts={{
                    events: tripEvents.length,
                    memories: tripMemories.length,
                    expenses: expenses.filter((e) => e.tripId === selectedTrip.id).length,
                    photos: tripMemories.filter((m) => m.type === "photo").length,
                    checklist: checklistItems.filter(
                      (i) => i.tripId === selectedTrip.id && !i.completed
                    ).length,
                  }}
                />

                {activeTripTab === "timeline" && (
                  <div>
                    {tripEvents.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-white/30 mb-6">Sem eventos ainda</p>
                        <Button
                          onClick={() => setShowNewEventForm(true)}
                          className="bg-teal-400 hover:bg-teal-500 text-black">
                          Criar evento
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6 pl-6 border-l border-white/10">
                        {tripEvents
                          .sort(
                            (a, b) =>
                              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                          )
                          .map((event, index) => {
                            const eventDate = new Date(event.startDate);
                            const formattedDate = eventDate.toLocaleDateString(
                              userSettings.language,
                              { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
                            );
                            return (
                              <TimelineItem
                                key={event.id}
                                title={event.title}
                                when={formattedDate}
                                meta={event.location}
                                index={index}
                              />
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {activeTripTab === "memories" && (
                  <div>
                    {tripMemories.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-white/30">Sem memórias ainda</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {tripMemories.map((memory, index) => (
                          <MemoryCard
                            key={memory.id}
                            {...memory}
                            index={index}
                            language={userSettings.language}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTripTab === "expenses" && (
                  <div>
                    {expenses.filter((e) => e.tripId === selectedTrip.id).length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-white/30 mb-6">Sem despesas ainda</p>
                        <Button
                          onClick={() => setShowNewExpenseForm(true)}
                          className="bg-teal-400 hover:bg-teal-500 text-black">
                          Adicionar despesa
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-white/10">
                          <p className="text-white/60 mb-2">Total</p>
                          <h2 className="text-white">
                            BRL{" "}
                            {expenses
                              .filter((e) => e.tripId === selectedTrip.id)
                              .reduce((sum, e) => sum + e.amount, 0)
                              .toLocaleString(userSettings.language, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </h2>
                        </div>

                        <div className="space-y-3">
                          {expenses
                            .filter((e) => e.tripId === selectedTrip.id)
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((expense, index) => (
                              <ExpenseCard
                                key={expense.id}
                                {...expense}
                                index={index}
                                language={userSettings.language}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTripTab === "gallery" && (
                  <div>
                    {tripMemories.filter((m) => m.type === "photo").length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-white/30">Sem fotos ainda</p>
                      </div>
                    ) : (
                      <PhotoGallery
                        photos={tripMemories
                          .filter((m) => m.type === "photo" && m.mediaUrl)
                          .map((m) => ({
                            id: m.id,
                            url: m.mediaUrl!,
                            caption: m.content,
                            date: m.createdAt,
                          }))}
                      />
                    )}
                  </div>
                )}

                {activeTripTab === "checklist" && (
                  <div>
                    <TravelChecklist
                      items={checklistItems.filter((i) => i.tripId === selectedTrip.id)}
                      language={userSettings.language}
                      onAddItem={handleAddChecklistItem}
                      onToggleItem={handleToggleChecklistItem}
                      onDeleteItem={handleDeleteChecklistItem}
                    />
                  </div>
                )}
              </div>

              <div>
                <TripCollaborators
                  tripId={selectedTrip.id}
                  ownerId={selectedTrip.userId}
                  currentUserId={currentUser?.id || "demo-user"}
                  collaborators={selectedTrip.collaborators}
                  invitedUsers={selectedTrip.invitedUsers}
                  language={userSettings.language}
                  onInvite={handleInviteCollaborator}
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentView === "share" && selectedTrip && (
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={() => setCurrentView("trip")}
              className="flex items-center gap-2 mb-8 text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>

            <div className="text-center mb-12">
              <p className="text-white/30 mb-8">Link público</p>
              <h1 className="mb-3">{selectedTrip.title}</h1>
              <p className="text-white/40 mb-10">{selectedTrip.location}</p>
              <div className="flex items-center justify-center gap-12">
                <div>
                  <div className="text-white/30 mb-2">Começa em</div>
                  <Countdown to={selectedTrip.startDate} />
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <div className="text-white/30 mb-2">Duração</div>
                  <div>
                    {Math.ceil(
                      (new Date(selectedTrip.endDate).getTime() -
                        new Date(selectedTrip.startDate).getTime()) /
                        86400000
                    )}{" "}
                    dias
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={selectedTrip.coverUrl}
                alt={selectedTrip.title}
                className="w-full h-80 object-cover"
              />
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/share/${selectedTrip.id}`
                  );
                  alert("Link copiado!");
                }}
                className="flex-1 px-4 py-3 text-white/60 hover:text-white transition-colors">
                Copiar link
              </button>
              <button
                onClick={handleExportICS}
                className={`flex-1 px-4 py-3 bg-teal-400 hover:bg-teal-500 text-black rounded-lg`}>
                Adicionar ao calendário
              </button>
            </div>
          </motion.div>
        )}

        {currentView === "profile" && selectedProfile && currentUser && (
          <ProfilePage
            user={selectedProfile}
            isOwnProfile={selectedProfile.id === currentUser.id}
            language={userSettings.language}
            trips={selectedProfile.id === currentUser.id ? displayTrips : []}
            onBack={() => setCurrentView("dashboard")}
            onViewTrip={handleViewTrip}
            isFollowing={currentUser.following?.includes(selectedProfile.id) || false}
            onFollow={handleFollowUser}
            onUnfollow={handleUnfollowUser}
            userSettings={userSettings}
          />
        )}

        {currentView === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 py-8">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center gap-2 mb-8 text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>

            <div className="mb-12">
              <h1 className="mb-3">Galeria</h1>
              <p className="text-white/40">{photoMemories.length} fotos</p>
            </div>

            {photoMemories.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-white/30">Sem fotos ainda</p>
              </div>
            ) : (
              <PhotoGallery photos={photoMemories} />
            )}
          </motion.div>
        )}

        {currentView === "expenses" && !selectedExpenseTripId && (
          <ExpenseOverview
            trips={displayTrips}
            expenses={expenses}
            language={userSettings.language}
            onSelectTrip={(tripId) => setSelectedExpenseTripId(tripId)}
            onBack={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "expenses" && selectedExpenseTripId && (
          <ExpenseManager
            expenses={expenses}
            language={userSettings.language}
            tripId={selectedExpenseTripId}
            tripTitle={displayTrips.find((t) => t.id === selectedExpenseTripId)?.title}
            onBack={() => setSelectedExpenseTripId(null)}
            onAddExpense={() => setShowNewExpenseForm(true)}
          />
        )}
      </AnimatePresence>

      {/* Search Users Modal */}
      <AnimatePresence>
        {showSearchUsers && currentUser && (
          <SearchUsers
            language={userSettings.language}
            currentUserId={currentUser.id}
            onSelectUser={handleViewProfile}
            onClose={() => setShowSearchUsers(false)}
          />
        )}
      </AnimatePresence>

      {/* Forms */}
      {showNewTripForm && (
        <NewTripForm onClose={() => setShowNewTripForm(false)} onSave={handleCreateTrip} />
      )}

      {showNewEventForm && (
        <NewEventForm
          onClose={() => setShowNewEventForm(false)}
          onSave={handleCreateEvent}
          tripId={selectedTripId || undefined}
        />
      )}

      {showNewMemoryForm && (
        <NewMemoryForm
          onClose={() => setShowNewMemoryForm(false)}
          onSave={handleCreateMemory}
          tripId={selectedTripId || undefined}
        />
      )}

      {showSettings && (
        <SettingsForm
          currentSettings={userSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}

      {showNewExpenseForm && (
        <NewExpenseForm
          onClose={() => setShowNewExpenseForm(false)}
          onSave={handleCreateExpense}
          tripId={selectedTripId || selectedExpenseTripId || undefined}
          language={userSettings.language}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
