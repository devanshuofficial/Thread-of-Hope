import Link from "next/link"
import { Package2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Package2 className="h-6 w-6" />
        <span className="inline-block font-bold text-lg">ClothConnect AI</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link href="/" className={cn("flex items-center text-sm font-medium transition-colors hover:text-primary")}>
          Home
        </Link> 
        <Link
          href="/about"
          className={cn("flex items-center text-sm font-medium transition-colors hover:text-primary")}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={cn("flex items-center text-sm font-medium transition-colors hover:text-primary")}
        >
          Contact
        </Link>
      </nav>
    </div>
  )
}
