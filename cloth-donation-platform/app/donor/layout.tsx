import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="donor">
      <div className="flex flex-col md:flex-row min-h-screen">
        <AppSidebar portal="donor" />
        <SidebarInset className="flex-1 p-4 md:p-6">{children}</SidebarInset>
      </div>
    </ProtectedRoute>
  )
}
