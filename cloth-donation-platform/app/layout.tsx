import type React from "react"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"

import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cloth Donation Platform",
  description: "AI-powered cloth donation and distribution platform",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased m-0 p-0", inter.className)}>
        <AuthProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SiteHeader />
            <main className="w-full">
              {children}
            </main>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
