"use client";

import { Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { DynamicCover } from "../components/DynamicCover";
import { TimelineItem } from "../components/TimelineItem";
import { MemoryCard } from "../components/MemoryCard";
import { ExpenseCard } from "../components/ExpenseCard";
import { TripTabs } from "../components/TripTabs";
import { TravelChecklist } from "../components/TravelChecklist";
import { Button } from "../components/ui/button";
import { OptimizedLoading } from "../components/OptimizedLoading";
import { VirtualList } from "../components/VirtualList";
import { LazyPhotoGallery, LazyExpenseManager } from "../components/LazyComponent";
import { TripCollaborators } from "../components/TripCollaborators";
import { useApp } from "../contexts/AppContext";
import { useUI } from "../contexts/UIContext";
import { useTrip } from "../contexts/TripContext";

export function TripView() {
  const prefersReducedMotion = useReducedMotion();
  const { userSettings } = useApp();
  const {
    activeTripTab,
    setActiveTripTab,
    setShowNewEventForm,
    setShowNewMemoryForm,
    setShowNewExpenseForm,
    navigateToDashboard,
  } = useUI();

  const {
    selectedTrip,
    tripEvents,
    tripMemories,
    tripExpenses,
    tripChecklistItems,
    exportTripToICS,
    shareTrip,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    inviteCollaborator,
    promoteToAdmin,
    demoteFromAdmin,
  } = useTrip();

  if (!selectedTrip) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-white/30">Viagem não encontrada</p>
      </div>
    );
  }

  // Handlers
  const handleExportICS = () => {
    exportTripToICS(selectedTrip.id);
  };

  const handleShare = () => {
    shareTrip(selectedTrip.id);
  };

  const handleBackToDashboard = () => {
    navigateToDashboard();
  };

  const handleAddChecklistItem = (text: string, category: any) => {
    addChecklistItem(selectedTrip.id, text, category);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    toggleChecklistItem(itemId);
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    deleteChecklistItem(itemId);
  };

  return (
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
              expenses: tripExpenses.length,
              photos: tripMemories.filter((m) => m.type === "photo").length,
              checklist: tripChecklistItems.filter((i) => !i.completed).length,
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
                      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    )
                    .map((event, index) => {
                      const eventDate = new Date(event.startDate);
                      const formattedDate = eventDate.toLocaleDateString(userSettings.language, {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
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
              ) : tripMemories.length > 15 ? (
                <VirtualList
                  items={tripMemories}
                  renderItem={(memory, index) => (
                    <MemoryCard
                      key={memory.id}
                      {...memory}
                      index={index}
                      language={userSettings.language}
                    />
                  )}
                  itemHeight={200}
                  containerHeight={500}
                  className="grid grid-cols-1 gap-6"
                />
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
              {tripExpenses.length === 0 ? (
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
                      {tripExpenses
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toLocaleString(userSettings.language, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {tripExpenses
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
                <Suspense
                  fallback={
                    <OptimizedLoading size="md" variant="spinner" message="Carregando galeria..." />
                  }>
                  <LazyPhotoGallery
                    photos={tripMemories
                      .filter((m) => m.type === "photo")
                      .map((m) => ({
                        id: m.id,
                        url: m.mediaUrl || "",
                        caption: m.content,
                        date: m.createdAt,
                      }))}
                  />
                </Suspense>
              )}
            </div>
          )}

          {activeTripTab === "checklist" && (
            <div>
              <TravelChecklist
                items={tripChecklistItems}
                language={userSettings.language}
                onToggleItem={handleToggleChecklistItem}
                onDeleteItem={handleDeleteChecklistItem}
                onAddItem={handleAddChecklistItem}
              />
            </div>
          )}
        </div>

        {/* Sidebar (somente colaboradores) */}
        <div className="space-y-6">
          <TripCollaborators
            tripId={selectedTrip.id}
            ownerId={selectedTrip.userId}
            currentUserId={selectedTrip.userId}
            collaborators={selectedTrip.collaborators}
            invitedUsers={selectedTrip.invitedUsers}
            language={userSettings.language}
            onInvite={(userId) => inviteCollaborator(selectedTrip.id, userId)}
            onPromote={(userId) => promoteToAdmin(selectedTrip.id, userId)}
            onDemote={(userId) => demoteFromAdmin(selectedTrip.id, userId)}
          />
        </div>
      </div>
    </motion.div>
  );
}
