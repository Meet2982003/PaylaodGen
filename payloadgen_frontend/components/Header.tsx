// components/Header.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, onMenuClick }) => {
  const router = useRouter();
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);

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
            <h1
              onClick={() => router.push("/")}
              className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
            >
              PayloadGen
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => router.push("/documentation")}
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm cursor-pointer bg-transparent border-none"
            >
              Documentation
            </button>
            <div className="relative">
              <button
                onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm cursor-pointer bg-transparent border-none flex items-center gap-1"
              >
                Report
                <svg
                  className={`w-4 h-4 transition-transform ${
                    reportDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              {reportDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-indigo-500/20 py-2 z-50">
                  <button
                    onClick={() => {
                      router.push("/user/table");
                      setReportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-indigo-400 hover:bg-slate-700 transition duration-200 font-medium text-sm"
                  >
                    User Report
                  </button>
                  <button
                    onClick={() => {
                      router.push("/product/table");
                      setReportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-indigo-400 hover:bg-slate-700 transition duration-200 font-medium text-sm"
                  >
                    Product Report
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push("/services")}
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm cursor-pointer bg-transparent border-none"
            >
              Services
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="text-gray-300 hover:text-indigo-400 transition duration-200 font-medium text-sm cursor-pointer bg-transparent border-none"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
