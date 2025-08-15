"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 mb-6">
      <div className="bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg rounded-xl shadow-sm border border-white/30 dark:border-slate-700/30">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-pink-700 dark:text-pink-500 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="absolute -top-1 -right-1 animate-ping w-3 h-3 bg-pink-400 rounded-full opacity-75"></span>
              </div>
              <h1 className="text-xl font-bold text-pink-700 dark:text-pink-500 ml-2 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">
                Lindsey and Jakub Memories
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <Link
                href="/"
                className="text-pink-700 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-300 font-medium flex items-center transition-all duration-300 hover:-translate-x-1 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
            )}

            {isHomePage && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-pink-700 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-300 font-medium flex items-center transition-all duration-300 hover:-translate-y-1 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Top
              </button>
            )}

            <LogoutButton />
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-pink-500/50 opacity-70"></div>
      </div>
    </nav>
  );
}
