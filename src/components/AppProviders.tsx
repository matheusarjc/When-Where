"use client";

import React from "react";
import { AppProvider } from "../contexts/AppContext";
import { UIProvider } from "../contexts/UIContext";
import { TripProvider } from "../contexts/TripContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppProvider>
      <UIProvider>
        <TripProvider>
          {children}
        </TripProvider>
      </UIProvider>
    </AppProvider>
  );
}
