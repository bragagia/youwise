import { queryClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// TODO: Should remove the singleton pattern one day

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
