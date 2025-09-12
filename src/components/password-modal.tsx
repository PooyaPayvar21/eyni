"use client";

import { useState } from "react";
import { PasswordManagementForm } from "./password-management-form";
import { X } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  isSuperAdmin?: boolean;
  userName?: string;
}

export function PasswordModal({ isOpen, onClose, userId, isSuperAdmin, userName }: PasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {isSuperAdmin 
              ? `بازنشانی رمز عبور ${userName || 'کاربر'}`
              : "تغییر رمز عبور"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <PasswordManagementForm userId={userId} isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );
}
