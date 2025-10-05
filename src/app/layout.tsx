import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthProvider";
import { PerformanceMonitor } from "../components/PerformanceMonitor";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "When & Where",
  description: "Planejador de viagens e eventos com contagem regressiva",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-poppins`}>
        <AuthProvider>
          {children}
          <PerformanceMonitor />
        </AuthProvider>
      </body>
    </html>
  );
}
