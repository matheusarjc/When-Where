"use client";

import React, { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Garante que criamos a instância apenas uma vez
  const serverStyleSheetRef = useRef<ServerStyleSheet>(new ServerStyleSheet());
  // Flag para controlar se os estilos já foram injetados
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (!inserted.current) {
      inserted.current = true;
      const styles = serverStyleSheetRef.current.getStyleElement();
      serverStyleSheetRef.current.seal(); // Selamos para evitar reuso
      return <>{styles}</>;
    }
    return null;
  });

  return (
    <StyleSheetManager sheet={serverStyleSheetRef.current.instance}>{children}</StyleSheetManager>
  );
}
