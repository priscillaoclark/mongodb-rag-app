
"use client"

import Link from 'next/link'
import { cn } from "@/lib/utils"

const NavBar = () => {
  return (
    <div className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Zeno
            </span>
          </Link>
        </div>
        <div className="flex gap-6 md:gap-10">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            href="/ask"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            QnA
          </Link>
          <Link
            href="/teach"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Train
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
