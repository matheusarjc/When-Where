import type { Metadata } from "next";

export function generateMetadata({
  title = "When & Where",
  description = "Planejador de viagens e eventos com contagem regressiva",
  keywords = "viagem, eventos, planejamento, countdown, turismo",
  image = "/og-image.jpg",
  url = "https://when-where.app",
}: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords,
    authors: [{ name: "When & Where Team" }],
    creator: "When & Where",
    publisher: "When & Where",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: "When & Where",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@whenwhereapp",
      site: "@whenwhereapp",
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Metadata base
    metadataBase: new URL("https://when-where.app"),

    // Icons (apenas arquivos existentes)
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    },

    // Manifest
    manifest: "/manifest.json",

    // Verification
    verification: {
      google: "google-site-verification-code",
      yandex: "yandex-verification-code",
      yahoo: "yahoo-site-verification-code",
    },

    // App Links
    appLinks: {
      web: {
        url: url,
        should_fallback: true,
      },
    },

    // Category
    category: "travel",

    // Classification
    classification: "Travel Planning Application",

    // Referrer
    referrer: "origin-when-cross-origin",
  };
}

export function generateTripMetadata(trip: {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  coverUrl?: string;
}) {
  const description = `Planejamento de viagem para ${trip.location}. Partida: ${new Date(
    trip.startDate
  ).toLocaleDateString("pt-BR")}. ${trip.title}`;

  return generateMetadata({
    title: `${trip.title} - When & Where`,
    description,
    keywords: `viagem, ${trip.location}, planejamento, turismo, ${trip.title}`,
    image: trip.coverUrl || "/og-trip-default.jpg",
  });
}
