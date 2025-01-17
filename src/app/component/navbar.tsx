"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const NavBar = () => {
  return (
    <div className="fixed top-0 z-50 w-full border-b border-gray-800 bg-blue-700">
      <nav className="container flex h-16 items-center">
        <div className="ml-4 mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-7" />
            <span className="font-bold text-xl text-black sm:inline-block">
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
            Upload
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
