import type { Metadata } from "next";
import React from "react";
import StyledComponentsRegistry from "./registry";
import ThemeProvider from "@/styles/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";

export const metadata: Metadata = {
  title: "When and Where",
  description: "Plan every trip",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
              <EventProvider>
                {" "}
                {/* ✅ Garante que todas as páginas tenham acesso ao contexto */}
                {children}
              </EventProvider>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
