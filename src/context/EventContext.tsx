// src/context/EventContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EventContextType {
  eventDate: string | null;
  setEventDate: (date: string | null) => void;
  eventName: string | null;
  setEventName: (name: string | null) => void;
  eventStatus: "no-event" | "active" | "expired";
  setEventStatus: (status: "no-event" | "active" | "expired") => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<"no-event" | "active" | "expired">("no-event");

  return (
    <EventContext.Provider
      value={{ eventDate, setEventDate, eventName, setEventName, eventStatus, setEventStatus }}>
      {children}
    </EventContext.Provider>
  );
};

// Hook para facilitar o uso do contexto
export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvent must be used within an EventProvider");
  return context;
};
