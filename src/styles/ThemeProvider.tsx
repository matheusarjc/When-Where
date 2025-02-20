// Exemplo de ThemeProvider.tsx (ou ThemeProvider/index.tsx)
"use client";

import React from "react";

import { ThemeProvider as SCThemeProvider } from "styled-components";
import GlobalStyle from "./global";

const theme = {
  colors: {
    primary: "#317b4b", // Cor principal (Azul)
    secondary: "#1c1c1e", // Cor secundária (Cinza escuro)
    background: "#171717",
    text: "#333",
    textTitle: "#f3f3f3",
    event: "#ECFFB0",
    white: "#ffffff",
    greenLight: "#4bdf7f",
    modalEdit: "#f4f4f4",
    backgroundBox: "#2f2f2f", // <- adicione aqui
    inputBackground: "#333333",
  },
  fontSizes: {
    small: "12px",
    medium: "16px",
    large: "20px",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
  screen: {
    xs: "1rem 2rem",
    sm: 400,
    md: "2rem 6rem",
    lg: 1024,
    xl: 1440,
  },
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <SCThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </SCThemeProvider>
  );
}
