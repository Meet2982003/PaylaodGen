// components/Sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out z-40 border-r border-indigo-500/20`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Navigation
            </h3>
            {/* <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700 transition duration-200"
              aria-label="Close menu"
              title="Close"
            > */}
            {/* <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button> */}
          </div>
          <nav className="space-y-3">
            <Link
              href="/user"
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-indigo-600/20 transition duration-200 hover:shadow-lg border border-transparent hover:border-indigo-500/30 group"
            >
              <svg
                className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-semibold text-gray-100">User</span>
            </Link>

            <Link
              href="/product"
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-indigo-600/20 transition duration-200 hover:shadow-lg border border-transparent hover:border-indigo-500/30 group"
            >
              <svg
                className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"
                />
              </svg>
              <span className="font-semibold text-gray-100">Product</span>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
