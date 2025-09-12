"use client";

import { useState } from "react";
import { PasswordModal } from "./password-modal";
import { Key } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface UsersManagementProps {
  users: User[];
  isSuperAdmin: boolean;
}

export function UsersManagement({ users, isSuperAdmin }: UsersManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!isSuperAdmin) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">مدیریت کاربران</h2>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-right">نام</th>
                <th className="py-3 px-4 text-right">ایمیل</th>
                <th className="py-3 px-4 text-right">نقش</th>
                <th className="py-3 px-4 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3 px-4">{user.name || "—"}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.role === "SUPERADMIN" ? "مدیر کل" :
                     user.role === "ADMIN" ? "مدیر" :
                     user.role === "SECRETARY" ? "منشی" :
                     user.role === "DOCTOR" ? "پزشک" : "کاربر"}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsPasswordModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-accent"
                    >
                      <Key className="h-4 w-4" />
                      <span>بازنشانی رمز</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id}
        userName={selectedUser?.name || selectedUser?.email}
        isSuperAdmin={true}
      />
    </div>
  );
}
