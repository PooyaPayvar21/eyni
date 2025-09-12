"use client";

import { useState } from "react";
import { resetUserPassword, changeOwnPassword } from "@/app/admin/password-actions";

interface PasswordFormProps {
  userId?: string;
  isSuperAdmin?: boolean;
}

export function PasswordManagementForm({ userId, isSuperAdmin }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("رمز عبور جدید با تکرار آن مطابقت ندارد");
      return;
    }

    if (newPassword.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    try {
      if (isSuperAdmin && userId) {
        await resetUserPassword(userId, newPassword);
        setSuccess("رمز عبور کاربر با موفقیت بازنشانی شد");
      } else {
        await changeOwnPassword(currentPassword, newPassword);
        setSuccess("رمز عبور شما با موفقیت تغییر کرد");
      }

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در تغییر رمز عبور");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isSuperAdmin && (
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium mb-1">
            رمز عبور فعلی
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required={!isSuperAdmin}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      )}

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium mb-1">
          رمز عبور جدید
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
          تکرار رمز عبور جدید
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200 p-3 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200 p-3 text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        {isSuperAdmin ? "بازنشانی رمز عبور" : "تغییر رمز عبور"}
      </button>
    </form>
  );
}
