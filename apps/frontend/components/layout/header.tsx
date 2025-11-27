"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Portfolio App</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={pathname === "/" ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}
            >
              Dashboard
            </Link>
            <Link
              href="/portfolio"
              className={pathname === "/portfolio" ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}
            >
              Portfolio
            </Link>
            <Link
              href="/transactions"
              className={pathname === "/transactions" ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}
            >
              Transactions
            </Link>
            <Link
              href="/dividends"
              className={pathname === "/dividends" ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}
            >
              Dividends
            </Link>
            <Link
              href="/settings"
              className={pathname === "/settings" ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}
            >
              Settings
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <DarkModeToggle />
            {pathname !== "/login" && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


