// components/UserTable.tsx
"use client";
import React, { useState, useEffect } from "react";
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

export default function UserTable() {
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
        entityType: "user",
      };

      const response = await fetch("http://localhost:5854/api/crud/find_all", {
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
  );
}
