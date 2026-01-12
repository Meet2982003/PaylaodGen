// components/DataTableWrapper.tsx
"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import DynamicTable from "./DynamicTable";

interface PaginationInfo {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  isFirst?: boolean;
  isLast?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

interface DataTableWrapperProps {
  entityType: string; // "user", "product", etc.
  title: string; // "Users", "Products", etc.
  description: string; // Description text
  apiUrl?: string; // Optional custom API URL
}

export default function DataTableWrapper({
  entityType,
  title,
  description,
  apiUrl = "http://localhost:5854/api/crud/find_all",
}: DataTableWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [pagination, setPagination] = useState<PaginationInfo>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        size: pageSize,
        ...(sortBy && { sortBy, sortOrder }),
        entityType: entityType,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        setData(result.data || []);
        setPagination({
          page: result.page,
          size: result.size,
          totalElements: result.totalElements,
          totalPages: result.totalPages,
          isFirst: result.isFirst,
          isLast: result.isLast,
          hasNext: result.hasNext,
          hasPrevious: result.hasPrevious,
        });

        // Extract columns from first row
        if (result.data && result.data.length > 0 && columns.length === 0) {
          setColumns(Object.keys(result.data[0]));
        }
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSort = (column: string, order: "asc" | "desc") => {
    setSortBy(column);
    setSortOrder(order);
    setCurrentPage(0);
  };

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
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {title}
              </h1>
              <p className="text-gray-400">{description}</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-indigo-500/20 rounded-xl shadow-2xl overflow-hidden">
              <DynamicTable
                data={data}
                columns={columns}
                loading={loading}
                pagination={pagination}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSort={handleSort}
              />
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
}
