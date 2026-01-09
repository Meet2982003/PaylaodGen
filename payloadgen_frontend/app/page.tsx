// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [bgRotation, setBgRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.clientY - rect.top - centerY) / 10;
    const y = (e.clientX - rect.left - centerX) / -10;
    setRotation({ x, y });
    setBgRotation({ x: x * 0.5, y: y * 0.5 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setBgRotation({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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

      <div className="flex flex-grow relative overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main
          className={`flex-1 transition-all duration-300 relative ${
            sidebarOpen ? "lg:ml-64" : ""
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* 3D Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              perspective: "1200px",
              transform: `rotateX(${bgRotation.x}deg) rotateY(${bgRotation.y}deg)`,
              transformStyle: "preserve-3d" as any,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />

            {/* 3D Cubes/Boxes */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-10 left-10 w-32 h-32 border-2 border-indigo-500 opacity-15 rounded-lg"
                style={{
                  transform: `translateZ(100px) rotateX(${
                    bgRotation.x * 2
                  }deg) rotateY(${bgRotation.y * 2}deg)`,
                }}
              />
              <div
                className="absolute top-32 right-20 w-40 h-40 border-2 border-cyan-500 opacity-10 rounded-lg"
                style={{
                  transform: `translateZ(50px) rotateX(${
                    -bgRotation.x * 1.5
                  }deg) rotateY(${-bgRotation.y * 1.5}deg)`,
                }}
              />
              <div
                className="absolute bottom-20 left-20 w-48 h-48 border-2 border-purple-500 opacity-5 rounded-lg"
                style={{
                  transform: `translateZ(-50px) rotateX(${bgRotation.x}deg) rotateY(${bgRotation.y}deg)`,
                }}
              />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: Math.random() * 4 + 2 + "px",
                    height: Math.random() * 4 + 2 + "px",
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                    transform: `translateZ(${Math.random() * 200 - 100}px)`,
                    animation: `float ${
                      3 + Math.random() * 2
                    }s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateZ(0); }
              50% { transform: translateY(-20px) translateZ(20px); }
            }
          `}</style>

          <div className="p-8 flex flex-col items-center justify-center min-h-[500px] relative z-10">
            <div
              className="perspective"
              style={{
                perspective: "1000px",
              }}
            >
              <h2
                className="text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 transition-transform duration-300"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transformStyle: "preserve-3d" as any,
                  textShadow: `
                    0px 0px 20px rgba(99,102,241,0.6),
                    0px 0px 40px rgba(34,211,238,0.3)
                  `,
                  letterSpacing: "0.05em",
                }}
              >
                PayloadGen
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg max-w-2xl text-center font-light tracking-wide">
              Access User and Product table and forms through the sidebar
            </p>
          </div>
        </main>
      </div>

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}
