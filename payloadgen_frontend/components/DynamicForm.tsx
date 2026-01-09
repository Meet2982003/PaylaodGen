"use client";
import React, { useState, forwardRef, useImperativeHandle } from "react";

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: string | number | boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (formData: Record<string, any>) => void;
  buttonText?: string;
  onCancel?: () => void;
}

export interface DynamicFormHandle {
  reset: () => void;
  resetField: (fieldName: string) => void;
  getFormData: () => Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>(
  ({ fields, onSubmit, buttonText = "Submit", onCancel }, ref) => {
    const [formData, setFormData] = useState<Record<string, any>>(() => {
      const initial: Record<string, any> = {};
      fields.forEach((field) => {
        initial[field.name] = field.value || "";
      });
      return initial;
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useImperativeHandle(ref, () => ({
      reset: () => {
        const initial: Record<string, any> = {};
        fields.forEach((field) => {
          initial[field.name] = field.value || "";
        });
        setFormData(initial);
        setErrors({});
      },
      resetField: (fieldName: string) => {
        const field = fields.find((f) => f.name === fieldName);
        if (field) {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: field.value || "",
          }));
          setErrors((prev) => ({
            ...prev,
            [fieldName]: "",
          }));
        }
      },
      getFormData: () => formData,
      setFormData: (data: Record<string, any>) => {
        setFormData(data);
      },
    }));

    const validateField = (
      field: FormFieldConfig,
      value: any
    ): string | null => {
      if (
        field.required &&
        (value === "" || value === null || value === undefined)
      ) {
        return `${field.label} is required`;
      }

      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Invalid email format";
        }
      }

      if (field.type === "number" && value !== "") {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return "Must be a valid number";
        }
        if (field.min !== undefined && numValue < field.min) {
          return `Must be at least ${field.min}`;
        }
        if (field.max !== undefined && numValue > field.max) {
          return `Must be at most ${field.max}`;
        }
      }

      if (field.type === "text" || field.type === "password") {
        if (field.minLength && value.length < field.minLength) {
          return `Minimum ${field.minLength} characters required`;
        }
        if (field.maxLength && value.length > field.maxLength) {
          return `Maximum ${field.maxLength} characters allowed`;
        }
      }

      if (field.pattern && value) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          return `Invalid format for ${field.label}`;
        }
      }

      return null;
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      fields.forEach((field) => {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      });

      if (Object.keys(newErrors).length === 0) {
        onSubmit(formData);
      } else {
        setErrors(newErrors);
      }
    };

    const renderField = (field: FormFieldConfig) => {
      const baseInputClasses =
        "w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200";

      switch (field.type) {
        case "textarea":
          return (
            <textarea
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className={baseInputClasses}
              required={field.required}
              minLength={field.minLength}
              maxLength={field.maxLength}
              rows={4}
            />
          );

        case "select":
          return (
            <select
              key={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={baseInputClasses}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );

        case "checkbox":
          return (
            <div key={field.name} className="flex items-center">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-slate-800 border border-slate-700 accent-indigo-500 cursor-pointer"
              />
              <label
                htmlFor={field.name}
                className="ml-3 text-gray-200 cursor-pointer"
              >
                {field.label}
              </label>
            </div>
          );

        case "radio":
          return (
            <div key={field.name} className="space-y-2">
              <label className="text-gray-200">{field.label}</label>
              <div className="space-y-2">
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`${field.name}-${opt.value}`}
                      name={field.name}
                      value={opt.value}
                      checked={formData[field.name] === opt.value}
                      onChange={handleChange}
                      className="w-4 h-4 bg-slate-800 border border-slate-700 accent-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`${field.name}-${opt.value}`}
                      className="ml-2 text-gray-200 cursor-pointer"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className={baseInputClasses}
              required={field.required}
              minLength={field.minLength}
              maxLength={field.maxLength}
              min={field.min}
              max={field.max}
              step={field.type === "number" ? "any" : undefined}
              inputMode={field.type === "number" ? "decimal" : undefined}
              pattern={field.pattern}
            />
          );
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            {field.type !== "checkbox" && field.type !== "radio" && (
              <label className="block text-sm font-medium text-gray-200">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
            )}
            {renderField(field)}
            {errors[field.name] && (
              <p className="text-red-400 text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition duration-200"
          >
            {buttonText}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }
);

DynamicForm.displayName = "DynamicForm";

export default DynamicForm;
