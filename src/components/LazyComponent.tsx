"use client";

import { Suspense, lazy, ComponentType } from "react";
import { OptimizedLoading } from "./OptimizedLoading";

interface LazyComponentProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export function LazyComponent({
  importFunc,
  fallback = <OptimizedLoading size="md" variant="spinner" message="Carregando componente..." />,
  ...props
}: LazyComponentProps) {
  const LazyComponent = lazy(importFunc);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Componentes lazy para componentes pesados
export const LazyExpenseManager = lazy(() =>
  import("./ExpenseManager").then((module) => ({ default: module.ExpenseManager }))
);
export const LazyPhotoGallery = lazy(() =>
  import("./PhotoGallery").then((module) => ({ default: module.PhotoGallery }))
);
export const LazyTripCollaborators = lazy(() =>
  import("./TripCollaborators").then((module) => ({ default: module.TripCollaborators }))
);
export const LazySearchUsers = lazy(() =>
  import("./SearchUsers").then((module) => ({ default: module.SearchUsers }))
);
