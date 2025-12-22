"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [querCylient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={querCylient}>{children}</QueryClientProvider>  
  );
}
