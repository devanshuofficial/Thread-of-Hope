"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Home, PlusCircle, History, User, Package, Handshake, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AppSidebarProps {
  portal: "donor" | "ngo"
}

export function AppSidebar({ portal }: AppSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const donorItems = [
    {
      title: "Dashboard",
      url: "/donor",
      icon: Home,
    },
    {
      title: "New Donation",
      url: "/donor/donate",
      icon: PlusCircle,
    },
    {
      title: "Donation History",
      url: "/donor/history",
      icon: History,
    },
  ]

  const ngoItems = [
    {
      title: "Dashboard",
      url: "/ngo",
      icon: Home,
    },
    {
      title: "Inventory",
      url: "/ngo/inventory",
      icon: Package,
    },
    {
      title: "My Requests",
      url: "/ngo/requests",
      icon: Handshake,
    },
  ]

  const currentItems = portal === "donor" ? donorItems : ngoItems

  return (
    <Sidebar collapsible="icon">
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home />
                <span>Back to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{portal === "donor" ? "Donor Actions" : "NGO Actions"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${portal}/profile`}>
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${portal}/settings`}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/${portal}/logout`} onClick={handleLogout}>
                <LogOut />

                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
