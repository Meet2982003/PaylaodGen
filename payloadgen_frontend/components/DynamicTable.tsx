import React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

interface DynamicTableProps {
  data?: Record<string, any>[];
  columns?: string[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSort?: (column: string, order: "asc" | "desc") => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export default function DynamicTable({
  data = [],
  columns = [],
  loading = false,
  pagination = {},
  onPageChange = () => {},
  onPageSizeChange = () => {},
  onSort = () => {},
  sortBy = "",
  sortOrder = "asc",
}: DynamicTableProps) {
  const getSortIcon = (column: any) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const handleSort = (column: any) => {
    if (sortBy === column) {
      onSort(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSort(column, "asc");
    }
  };

  return (
    <div className="w-full bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900 p-6 rounded-xl">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-indigo-500/20">
        <table className="w-full bg-slate-950">
          <thead>
            <tr className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 border-b-2 border-indigo-500/20">
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-indigo-400 transition-all duration-200 relative group"
                >
                  <div className="flex items-center gap-2">
                    {typeof column === "string"
                      ? column.charAt(0).toUpperCase() + column.slice(1)
                      : column}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getSortIcon(column)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                    <span className="ml-2 text-gray-400 font-medium">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400 font-medium"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-indigo-500/10 transition-all duration-150 hover:bg-slate-800/50 ${
                    idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/50"
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${idx}-${column}`}
                      className="px-6 py-4 text-sm text-gray-300"
                    >
                      {renderCellValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-4 bg-slate-900 p-4 rounded-lg border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-300">
            Rows per page:
          </label>
          <select
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-indigo-500/30 rounded-md text-sm bg-slate-950 text-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-500/50 transition-colors"
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-400 font-medium">
          {pagination.totalElements ? (
            <>
              Page {(pagination.page || 0) + 1} of {pagination.totalPages || 1}{" "}
              <span className="text-gray-600">•</span>{" "}
              <span className="font-semibold text-gray-300">
                {pagination.totalElements}
              </span>{" "}
              total records
            </>
          ) : (
            "No data"
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange((pagination.page || 0) - 1)}
            disabled={pagination.isFirst || loading}
            className="p-2 border border-indigo-500/30 rounded-md hover:bg-slate-800 hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 text-gray-400 hover:text-indigo-400 font-medium"
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages || 1 }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => onPageChange(idx)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
                    idx === (pagination.page || 0)
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
                      : "border border-indigo-500/30 text-gray-400 hover:text-indigo-400 hover:bg-slate-800 hover:border-indigo-500/50"
                  } disabled:opacity-40`}
                >
                  {idx + 1}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange((pagination.page || 0) + 1)}
            disabled={pagination.isLast || loading}
            className="p-2 border border-indigo-500/30 rounded-md hover:bg-slate-800 hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 text-gray-400 hover:text-indigo-400 font-medium"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
