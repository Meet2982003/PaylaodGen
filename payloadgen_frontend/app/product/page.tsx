"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ProductForm from "@/components/Product";

const ProductPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow relative">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  Product Management
                </h1>
                <p className="text-gray-400">
                  Create or update product information
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-indigo-500/20 rounded-xl p-8 shadow-2xl">
                <ProductForm />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default ProductPage;
