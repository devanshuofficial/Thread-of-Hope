"use client"

import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { User, LogOut, Building2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SiteHeader() {
  const { user, isAuthenticated, logout, canAccessDonorPortal, canAccessNGOPortal } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <MainNav />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {!isAuthenticated ? (
            // Not authenticated - show auth buttons
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth?mode=login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth?mode=signup">Get Started</Link>
              </Button>
            </nav>
          ) : (
            // Authenticated - show user menu and portal access
            <div className="flex items-center space-x-4">
              {/* Portal Access Buttons */}
              {canAccessDonorPortal && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/donor" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Donor Portal
                  </Link>
                </Button>
              )}
              
              {canAccessNGOPortal && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/ngo" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    NGO Portal
                  </Link>
                </Button>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-600">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          {user?.role === 'ngo' ? (
                            <>
                              <Building2 className="h-3 w-3 mr-1" />
                              NGO
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              Donor
                            </>
                          )}
                        </span>
                        {user?.role === 'ngo' && (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.ngoStatus === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : user.ngoStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.ngoStatus === 'accepted' ? 'Approved' : user.ngoStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {user?.role === 'ngo' && user.ngoStatus === 'pending' && (
                    <DropdownMenuItem disabled className="text-yellow-600">
                      <Building2 className="mr-2 h-4 w-4" />
                      Pending Approval
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
