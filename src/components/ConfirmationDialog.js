"use client"; 

import { useState, useEffect } from "react";

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  disableBackdropClick = false,
  customContent = null,
  size = "md",
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !disableBackdropClick) {
      onCancel();
    }
  };

  const variantClasses = {
    default: "bg-blue-500 hover:bg-blue-600",
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
  };

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}`}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

          {customContent ? (
            <div className="my-4">{customContent}</div>
          ) : (
            <div className="my-4 text-gray-600">
              {typeof message === "string" ? <p>{message}</p> : message}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${variantClasses[variant]}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
