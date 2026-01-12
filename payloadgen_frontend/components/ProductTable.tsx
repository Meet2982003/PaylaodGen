// app/user/table/page.tsx
"use client";
import DataTableWrapper from "@/components/DataTableWrapper";

export default function ProductTablePage() {
  return (
    <DataTableWrapper
      entityType="product"
      title="Products"
      description="Manage and view all products"
    />
  );
}
