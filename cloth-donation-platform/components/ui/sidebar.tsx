"use client"

import * as React from "react"
import { createContext, useContext, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface SidebarContextProps {
  open: boolean
  setOpen: (open: boolean) => void
  collapsible: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  collapsible?: "icon"
}

export function SidebarProvider({ children, defaultOpen, collapsible }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen ?? true)
  const [isCollapsible, setIsCollapsible] = useState(collapsible === "icon")

  const value = useMemo(
    () => ({
      open,
      setOpen,
      collapsible: isCollapsible,
    }),
    [open, isCollapsible],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: "icon"
}

export function Sidebar({ children, className, collapsible, ...props }: SidebarProps) {
  const { open, collapsible: isCollapsible } = useSidebar()

  return (
    <div
      className={cn(
        "group/sidebar flex h-full flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground transition-[width] ease-in-out duration-300",
        isCollapsible ? (open ? "w-[280px]" : "w-[50px]") : "w-[280px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarInset({ className, children, ...props }: SidebarInsetProps) {
  // Removed the conflicting margin-left classes
  return (
    <div className={cn("transition-[margin-left] ease-in-out duration-300", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, children, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, children, ...props }: SidebarFooterProps) {
  return (
    <div className={cn("p-4 border-t", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, children, ...props }: SidebarMenuProps) {
  return (
    <nav className={cn("space-y-1", className)} {...props}>
      {children}
    </nav>
  )
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({ className, children, ...props }: SidebarMenuItemProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  asChild?: boolean
}

export function SidebarMenuButton({ className, children, isActive, asChild, ...props }: SidebarMenuButtonProps) {
  const { open, collapsible } = useSidebar()
  const Comp = asChild ? "div" : "button"

  return (
    <Comp
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
        collapsible && !open && "justify-center",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === "span" && collapsible && !open) {
            return null // Hide text when collapsed
          }
          return child
        }
        return child
      })}
    </Comp>
  )
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, children, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function SidebarGroupLabel({ className, children, ...props }: SidebarGroupLabelProps) {
  const { open, collapsible } = useSidebar()
  if (collapsible && !open) {
    return null
  }
  return (
    <h3 className={cn("px-3 text-xs font-semibold uppercase text-muted-foreground", className)} {...props}>
      {children}
    </h3>
  )
}

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, children, ...props }: SidebarGroupContentProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  return <div className={cn("my-4 border-t border-sidebar-border", className)} {...props} />
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { setOpen } = useSidebar()
  return (
    <button
      type="button"
      className={cn("p-2 rounded-md hover:bg-gray-100", className)}
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  )
}
