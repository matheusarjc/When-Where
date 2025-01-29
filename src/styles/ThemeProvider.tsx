"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "./theme";
import GlobalStyle from "./global";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
}
