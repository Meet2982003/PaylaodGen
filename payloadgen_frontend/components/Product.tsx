"use client";
import React, { useRef, useState } from "react";
import DynamicForm, {
  DynamicFormHandle,
  FormFieldConfig,
} from "@/components/DynamicForm";

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: number;
    productName?: string;
    category?: string;
    price?: number;
    stock?: number;
  };
}

const Product: React.FC<ProductFormProps> = ({ onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<DynamicFormHandle>(null);

  const productFormFields: FormFieldConfig[] = [
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      required: true,
      placeholder: "Enter product name",
      minLength: 2,
      maxLength: 100,
      value: initialData?.productName || "",
    },
    {
      name: "category",
      label: "Category",
      type: "text",
      required: true,
      placeholder: "Enter product category",
      minLength: 2,
      maxLength: 50,
      value: initialData?.category || "",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      placeholder: "Enter product price",
      min: 0,
      value: initialData?.price || "",
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      required: true,
      placeholder: "Enter stock quantity",
      min: 0,
      value: initialData?.stock || "",
    },
  ];

  const handleProductSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    setMessage("");
    try {
      const url = initialData?.id
        ? `http://localhost:5854/api/crud/create_or_update/products/${initialData.id}`
        : "http://localhost:5854/api/crud/create_or_update";

      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(
          initialData?.id
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        if (!initialData?.id && formRef.current) {
          formRef.current.reset();
        }
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      } else {
        setMessage("Failed to save product. Please try again.");
      }
    } catch (error) {
      setMessage("Error submitting form. Please check the server connection.");
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("successfully")
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}
        >
          {message}
        </div>
      )}

      <DynamicForm
        ref={formRef}
        fields={productFormFields}
        onSubmit={handleProductSubmit}
        buttonText={
          loading
            ? initialData?.id
              ? "Updating..."
              : "Creating..."
            : initialData?.id
            ? "Update Product"
            : "Create Product"
        }
      />
    </div>
  );
};

export default Product;
