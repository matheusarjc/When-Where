import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthProvider";
import { PerformanceMonitorOptimized } from "../components/PerformanceMonitorOptimized";
import { generateMetadata as generateAppMetadata } from "./metadata";
import { SimpleMemoryOptimizer } from "../components/SimpleMemoryOptimizer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = generateAppMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "When & Where",
        description: "Planejador de viagens e eventos com contagem regressiva",
        url: "https://when-where.app",
        applicationCategory: "TravelApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
        },
        creator: {
          "@type": "Organization",
          name: "When & Where Team",
        },
      },
      {
        "@type": "Organization",
        name: "When & Where",
        url: "https://when-where.app",
        logo: "https://when-where.app/logo.png",
        sameAs: ["https://twitter.com/whenwhereapp", "https://instagram.com/whenwhereapp"],
      },
    ],
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="When & Where" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins`}>
        <AuthProvider>
          {children}
          <PerformanceMonitorOptimized />
          <SimpleMemoryOptimizer />
        </AuthProvider>
      </body>
    </html>
  );
}
