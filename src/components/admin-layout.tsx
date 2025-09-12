"use client";

import { Layout, Typography } from "antd";
import { LogoutButton } from "@/components/logout-button";
import { AdminAnalytics } from "@/components/admin-analytics";
import { AdminTables } from "@/components/admin-tables";
import { UsersManagement } from "@/components/users-management";
import { PasswordManagementForm } from "@/components/password-management-form";


interface AdminLayoutProps {
  isSuperAdmin?: boolean;
  users?: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
  }>;
  doctorCount: number;
  secretaryCount: number;
  clinicCount: number;
  appointmentCount: number;
  appointmentsByDate: Array<{ date: string; count: number }>;
  appointmentsByStatus: Array<{ status: string; value: number }>;
  appointmentsByDoctor: Array<{ name: string; value: number }>;
  appointmentsByHour: Array<{ hour: string; count: number }>;
  doctorTableData?: Array<{
    key: string;
    name: string;
    specialty: string;
    clinic: string;
    secretary: string;
    appointments: number;
  }>;
  secretaryTableData?: Array<{
    key: string;
    name: string;
    doctor: string | undefined;
    email: string | undefined;
  }>;
}

export function AdminLayout({
  isSuperAdmin = false,
  users = [],
  doctorCount,
  secretaryCount,
  clinicCount,
  appointmentCount,
  appointmentsByDate,
  appointmentsByStatus,
  appointmentsByDoctor,
  appointmentsByHour,
  doctorTableData,
  secretaryTableData
}: AdminLayoutProps) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Layout.Content style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <Typography.Title level={2} style={{ marginBottom: 0 }}>پنل مدیریت</Typography.Title>
            <Typography.Text type="secondary">مدیریت کلینیک‌ها، پزشکان، منشی‌ها و زمان‌های نوبت</Typography.Text>
          </div>
          <LogoutButton />
        </div>

        <AdminAnalytics
          doctorCount={doctorCount}
          secretaryCount={secretaryCount}
          clinicCount={clinicCount}
          appointmentCount={appointmentCount}
          appointmentsByDate={appointmentsByDate}
          appointmentsByStatus={appointmentsByStatus}
          appointmentsByDoctor={appointmentsByDoctor}
          appointmentsByHour={appointmentsByHour}
        />

        {doctorTableData && secretaryTableData && (
          <AdminTables
            doctorTableData={doctorTableData}
            secretaryTableData={secretaryTableData}
          />
        )}

          {/* Users management for superadmin */}
          {isSuperAdmin && users.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <UsersManagement users={users} isSuperAdmin={true} />
            </div>
          )}

          {/* Password management for non-superadmin users */}
          {!isSuperAdmin && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">تغییر رمز عبور</h2>
              <PasswordManagementForm />
            </div>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}
