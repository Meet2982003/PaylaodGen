"use client";
import React from "react";
import UserForm from "@/components/UserForm";

const UserPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            User Management
          </h1>
          <p className="text-gray-400">Create or update user information</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-indigo-500/20 rounded-xl p-8 shadow-2xl">
          <UserForm />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
