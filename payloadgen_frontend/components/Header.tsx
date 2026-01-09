// components/Header.tsx
import React from "react";

interface HeaderProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, onMenuClick }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-indigo-500/20">
      <div className="px-8 py-5">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2.5 rounded-lg hover:bg-slate-700 transition duration-200 hover:shadow-lg"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    sidebarOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">PG</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PayloadGen
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm"
            >
              Services
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
