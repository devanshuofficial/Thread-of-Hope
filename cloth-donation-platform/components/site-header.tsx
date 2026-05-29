import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button asChild variant="ghost" className="text-sm md:text-base">
              <Link href="/donor">Donor Portal</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm md:text-base">
              <Link href="/ngo">NGO Portal</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
