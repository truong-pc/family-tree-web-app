"use client"

import { AuthProvider } from "@/lib/auth-context"
import { QueryProvider } from "@/lib/query-provider"
import type { ReactNode } from "react"

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  )
}
