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
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
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
    <div className="w-full p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-700 text-white">
                {columns.map((column) => (
                  <th
                    key={column}
                    onClick={() => handleSort(column)}
                    className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {typeof column === "string"
                        ? column.charAt(0).toUpperCase() + column.slice(1)
                        : column}
                      {getSortIcon(column)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${idx}-${column}`}
                        className="px-6 py-4 text-sm text-slate-700"
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
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700 font-medium">
              Rows per page:
            </label>
            <select
              value={pagination.size || 10}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-slate-600">
            {pagination.totalElements ? (
              <>
                Page {(pagination.page || 0) + 1} of{" "}
                {pagination.totalPages || 1} • {pagination.totalElements} total
                records
              </>
            ) : (
              "No data"
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange((pagination.page || 0) - 1)}
              disabled={pagination.isFirst || loading}
              className="p-2 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages || 1 }).map(
                (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPageChange(idx)}
                    disabled={loading}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      idx === (pagination.page || 0)
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 hover:bg-slate-100"
                    } disabled:opacity-50`}
                  >
                    {idx + 1}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => onPageChange((pagination.page || 0) + 1)}
              disabled={pagination.isLast || loading}
              className="p-2 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
