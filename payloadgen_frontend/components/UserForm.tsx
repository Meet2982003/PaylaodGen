"use client";
import React, { useRef, useState } from "react";
import DynamicForm, {
  FormFieldConfig,
  DynamicFormHandle,
} from "@/components/DynamicForm";

interface UserFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: number;
    name?: string;
    email?: string;
  };
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<DynamicFormHandle>(null);

  const userFormFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
      minLength: 2,
      maxLength: 100,
      value: initialData?.name || "",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "Enter your email address",
      value: initialData?.email || "",
    },
  ];

  const handleUserSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    setMessage("");
    try {
      const url = initialData?.id
        ? `http://localhost:5854/api/crud/create_or_update/users/${initialData.id}`
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
            ? "User updated successfully!"
            : "User created successfully!"
        );

        // Reset form only on creation, not on update
        if (!initialData?.id && formRef.current) {
          formRef.current.reset();
        }

        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      } else {
        setMessage("Failed to save user. Please try again.");
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
        fields={userFormFields}
        onSubmit={handleUserSubmit}
        buttonText={
          loading
            ? initialData?.id
              ? "Updating..."
              : "Creating..."
            : initialData?.id
            ? "Update User"
            : "Create User"
        }
      />
    </div>
  );
};

export default UserForm;
