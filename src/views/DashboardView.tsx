"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Plus,
  MapPin,
  Search,
  User,
  ImageIcon,
  StickyNote,
  DollarSign,
} from "lucide-react";

import { TripCard } from "../components/TripCard";
import { Countdown } from "../components/Countdown";
import { ProfileMenu } from "../components/ProfileMenu";
import { QuickAction } from "../components/QuickAction";
import { Button } from "../components/ui/button";
import { VirtualList } from "../components/VirtualList";
import { useApp } from "../contexts/AppContext";
import { useUI } from "../contexts/UIContext";
import { useAppData } from "../hooks/useAppData";
import { useTrip } from "../contexts/TripContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardView() {
  const prefersReducedMotion = useReducedMotion();
  const { currentUser, userSettings, displayTrips, expenses, checklistItems } = useAppData();
  const { pendingInvites } = useTrip();
  const {
    showProfileMenu,
    setShowProfileMenu,
    setShowSearchUsers,
    setShowNewTripForm,
    setCurrentView,
    setActiveTripTab,
    navigateToTrip,
    showToast,
  } = useUI();

  // Memoizar computações derivadas
  const nextTrip = useMemo(() => {
    const now = new Date();
    const upcomingTrips = displayTrips
      .filter((trip) => new Date(trip.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return upcomingTrips[0] || null;
  }, [displayTrips]);

  const filteredMemories = useMemo(() => {
    // Lógica de filtro de memórias (simplificada para exemplo)
    return [];
  }, []);

  const memoryCounts = useMemo(() => {
    // Lógica de contagem de memórias (simplificada para exemplo)
    return {
      photos: 0,
      tips: 0,
      notes: 0,
    };
  }, []);

  const photoMemories = useMemo(() => {
    // Lógica de memórias de foto (simplificada para exemplo)
    return [];
  }, []);

  // Handlers
  const handleViewTrip = (tripId: string) => {
    navigateToTrip(tripId);
  };

  const handleViewProfile = () => {
    setCurrentView("profile");
  };

  const handleLogout = () => {
    // Lógica de logout
    console.log("Logout");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
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
                    onViewProfile={handleViewProfile}
                    onSettings={() => console.log("Settings")}
                    onLogout={handleLogout}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

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
                showToast("📋 Crie uma viagem primeiro!", "info");
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
      </motion.div>

      {/* Trips */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-16">
        
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
          ) : displayTrips.length > 20 ? (
            <VirtualList
              items={displayTrips}
              renderItem={(trip, index) => (
                <TripCard {...trip} onClick={() => handleViewTrip(trip.id)} index={index} />
              )}
              itemHeight={320}
              containerHeight={600}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 motion-optimized">
              
              {displayTrips.map((trip, index) => (
                <motion.div key={trip.id} variants={itemVariants}>
                  <TripCard {...trip} onClick={() => handleViewTrip(trip.id)} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
