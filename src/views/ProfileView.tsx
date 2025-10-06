"use client";

import { Suspense } from "react";
import { OptimizedLoading } from "../components/OptimizedLoading";
import { LazyProfilePage } from "../components/LazyComponent";
import { useApp } from "../contexts/AppContext";
import { useUI } from "../contexts/UIContext";
import { useAppData } from "../hooks/useAppData";

export function ProfileView() {
  const { currentUser } = useAppData();
  const { userSettings } = useApp();
  const { selectedProfile, setCurrentView, navigateToTrip } = useUI();

  if (!selectedProfile || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-white/30">Perfil não encontrado</p>
      </div>
    );
  }

  const handleViewTrip = (tripId: string) => {
    navigateToTrip(tripId);
  };

  const handleFollowUser = () => {
    // Lógica de seguir usuário
    console.log("Follow user");
  };

  const handleUnfollowUser = () => {
    // Lógica de parar de seguir usuário
    console.log("Unfollow user");
  };

  const handleBack = () => {
    setCurrentView("dashboard");
  };

  return (
    <Suspense fallback={<OptimizedLoading size="lg" variant="skeleton" fullScreen />}>
      <LazyProfilePage
        user={selectedProfile}
        isOwnProfile={selectedProfile.id === currentUser.id}
        language={userSettings.language}
        trips={selectedProfile.id === currentUser.id ? [] : []} // TODO: Implementar trips do perfil
        onBack={handleBack}
        onViewTrip={handleViewTrip}
        isFollowing={currentUser.following?.includes(selectedProfile.id) || false}
        onFollow={handleFollowUser}
        onUnfollow={handleUnfollowUser}
        userSettings={{
          name: currentUser.fullName,
          language: "pt-BR",
          theme: "teal",
          onboarded: true,
        }}
      />
    </Suspense>
  );
}
