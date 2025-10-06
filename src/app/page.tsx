"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";

// Components
import { AuthScreen } from "../components/AuthScreen";
import { OnboardingForm } from "../components/OnboardingForm";
import { Toast } from "../components/Toast";
import { OptimizedLoading } from "../components/OptimizedLoading";
import { AppProviders } from "../components/AppProviders";
import {
  LazyExpenseOverview,
  LazyExpenseManager,
  LazySearchUsers,
  LazyPhotoGallery,
  LazyNewTripForm,
  LazyNewEventForm,
  LazyNewMemoryForm,
  LazyNewExpenseForm,
  LazySettingsForm,
} from "../components/LazyComponent";

// Views
import { DashboardView } from "../views/DashboardView";
import { TripView } from "../views/TripView";
import { ProfileView } from "../views/ProfileView";

// Hooks and Contexts
import { useApp } from "../contexts/AppContext";
import { useUI } from "../contexts/UIContext";
import { useTrip } from "../contexts/TripContext";
import { useAppData } from "../hooks/useAppData";
import { useAppActions } from "../hooks/useAppActions";

function AppContent() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { userSettings } = useApp();
  const {
    currentView,
    selectedExpenseTripId,
    showSuccessAnimation,
    setShowSuccessAnimation,
    toast,
    setToast,
    showSearchUsers,
    setShowSearchUsers,
    showNewTripForm,
    setShowNewTripForm,
    showNewEventForm,
    setShowNewEventForm,
    showNewMemoryForm,
    setShowNewMemoryForm,
    showNewExpenseForm,
    setShowNewExpenseForm,
    showSettings,
    setShowSettings,
    selectedProfile,
    setSelectedProfile,
  } = useUI();

  const { currentUser, displayTrips } = useAppData();
  const { expenses } = useApp();
  const { pendingInvites, selectedTrip } = useTrip();
  const selectedTripId = selectedTrip?.id;
  const { handleCreateTrip, handleCreateEvent, handleCreateMemory, handleCreateExpense } =
    useAppActions();

  // Success animation effect
  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnimation, setShowSuccessAnimation]);

  // If not authenticated, show auth screen
  if (!currentUser) {
    return (
      <AuthScreen
        language={userSettings.language}
        onAuth={(user) => {
          // TODO: Handle auth
          console.log("User authenticated:", user);
        }}
      />
    );
  }

  // If not onboarded, show onboarding
  if (!userSettings.onboarded) {
    return (
      <OnboardingForm
        onComplete={(settings) => {
          // TODO: Save settings
          console.log("Settings saved:", settings);
        }}
      />
    );
  }

  // pendingInvites agora vem do TripContext

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Enhanced Background ambient animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          // Usar valores determinísticos baseados no índice para evitar problemas de hidratação
          const left = (i * 7.3) % 100;
          const top = (i * 11.7) % 100;
          const duration = 3 + (i % 4);
          const delay = (i % 2) * 0.5;

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: !mounted || prefersReducedMotion ? 0 : [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Main gradient orbs */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: !mounted || prefersReducedMotion ? 1 : [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: !mounted || prefersReducedMotion ? 0 : [0, 50, 0],
            y: !mounted || prefersReducedMotion ? 0 : [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/5 rounded-full blur-3xl"
          animate={{
            scale: !mounted || prefersReducedMotion ? 1 : [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: !mounted || prefersReducedMotion ? 0 : [0, -40, 0],
            y: !mounted || prefersReducedMotion ? 0 : [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl"
          animate={{
            scale: !mounted || prefersReducedMotion ? 1 : [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: !mounted || prefersReducedMotion ? 0 : [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
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

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div className="fixed top-4 right-4 z-40 space-y-2">
          {pendingInvites.map((invite) => (
            <div
              key={invite.tripId}
              className="p-4 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-white/80 mb-1">Convite para viagem</p>
              <p className="font-medium text-white">{invite.tripTitle}</p>
              <p className="text-xs text-white/60">{invite.tripLocation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "trip" && <TripView />}
        {currentView === "profile" && selectedProfile && <ProfileView />}
        {currentView === "share" && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-white/30">Share view - TODO</p>
          </div>
        )}
        {currentView === "gallery" && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-white/30">Gallery view - TODO</p>
          </div>
        )}
        {currentView === "expenses" && !selectedExpenseTripId && (
          <Suspense fallback={<OptimizedLoading size="lg" variant="skeleton" fullScreen />}>
            <LazyExpenseOverview
              trips={displayTrips}
              expenses={expenses}
              language={userSettings.language}
              onSelectTrip={(tripId) => console.log("Select trip:", tripId)}
              onBack={() => console.log("Back to dashboard")}
            />
          </Suspense>
        )}
        {currentView === "expenses" && selectedExpenseTripId && (
          <Suspense fallback={<OptimizedLoading size="lg" variant="skeleton" fullScreen />}>
            <LazyExpenseManager
              expenses={expenses}
              language={userSettings.language}
              tripId={selectedExpenseTripId}
              tripTitle={displayTrips.find((t) => t.id === selectedExpenseTripId)?.title}
              onBack={() => console.log("Back to expenses")}
              onAddExpense={() => setShowNewExpenseForm(true)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Search Users Modal */}
      <AnimatePresence>
        {showSearchUsers && currentUser && (
          <Suspense fallback={<OptimizedLoading size="md" variant="spinner" fullScreen />}>
            <LazySearchUsers
              language={userSettings.language}
              currentUserId={currentUser.id}
              onSelectUser={(user) => setSelectedProfile(user)}
              onClose={() => setShowSearchUsers(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Forms */}
      {showNewTripForm && (
        <Suspense fallback={<OptimizedLoading size="md" variant="spinner" fullScreen />}>
          <LazyNewTripForm
            onClose={() => setShowNewTripForm(false)}
            onSave={(trip) => {
              // Adicionar propriedades faltantes
              const tripData = {
                ...trip,
                userId: currentUser?.id || "demo-user",
                isPublic: false,
                collaborators: [],
                invitedUsers: [],
              };
              handleCreateTrip(tripData);
            }}
          />
        </Suspense>
      )}

      {showNewEventForm && (
        <Suspense fallback={<OptimizedLoading size="md" variant="spinner" fullScreen />}>
          <LazyNewEventForm
            onClose={() => setShowNewEventForm(false)}
            onSave={(event) => {
              // Adicionar tripId faltante
              const eventData = {
                ...event,
                tripId: selectedTripId || "demo-trip",
              };
              handleCreateEvent(eventData);
            }}
            tripId={selectedTripId || undefined}
          />
        </Suspense>
      )}

      {showNewMemoryForm && (
        <Suspense fallback={<OptimizedLoading size="md" variant="spinner" fullScreen />}>
          <LazyNewMemoryForm
            onClose={() => setShowNewMemoryForm(false)}
            onSave={handleCreateMemory}
            tripId={undefined} // TODO: Get from context
          />
        </Suspense>
      )}

      {showSettings && (
        <Suspense fallback={<OptimizedLoading size="md" variant="spinner" fullScreen />}>
          <LazySettingsForm
            currentSettings={userSettings}
            onClose={() => setShowSettings(false)}
            onSave={(settings) => {
              // TODO: Save settings
              console.log("Settings saved:", settings);
              setShowSettings(false);
            }}
          />
        </Suspense>
      )}

      {showNewExpenseForm && (
        <Suspense fallback={<OptimizedLoading size="md" variant="spinner" fullScreen />}>
          <LazyNewExpenseForm
            onClose={() => setShowNewExpenseForm(false)}
            onSave={(expense) => {
              // Adicionar tripId faltante
              const expenseData = {
                ...expense,
                tripId: selectedExpenseTripId || selectedTripId || "demo-trip",
              };
              handleCreateExpense(expenseData);
            }}
            tripId={selectedExpenseTripId || undefined}
            language={userSettings.language}
          />
        </Suspense>
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

export default function HomePage() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
