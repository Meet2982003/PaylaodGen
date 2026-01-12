// app/user/layout.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Users
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => router.push("/user")}
            className={`px-4 py-2 font-medium transition-colors ${
              pathname === "/user"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Add User
          </button>
          <button
            onClick={() => router.push("/user/table")}
            className={`px-4 py-2 font-medium transition-colors ${
              pathname === "/user/table"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            View Users
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
