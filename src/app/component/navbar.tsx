"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const NavBar = () => {
  return (
    <div className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <nav className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="hidden font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text sm:inline-block">
              Zeno
            </span>
          </Link>
        </div>
        <div className="flex gap-8 md:gap-12">
          <Link
            href="/"
            className="text-gray-300 transition-colors hover:text-blue-400 font-medium"
          >
            Home
          </Link>
          <Link
            href="/ask"
            className="text-gray-300 transition-colors hover:text-blue-400 font-medium"
          >
            Demo
          </Link>
          <Link
            href="/teach"
            className="text-gray-300 transition-colors hover:text-blue-400 font-medium"
          >
            Upload Docs
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
