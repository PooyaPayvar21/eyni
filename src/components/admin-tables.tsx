"use client";

import { Table, Divider } from "antd";

interface AdminTablesProps {
  doctorTableData: Array<{
    key: string;
    name: string;
    specialty: string;
    clinic: string;
    secretary: string;
    appointments: number;
  }>;
  secretaryTableData: Array<{
    key: string;
    name: string;
    doctor: string | undefined;
    email: string | undefined;
  }>;
}

export function AdminTables({ doctorTableData, secretaryTableData }: AdminTablesProps) {
  return (
    <>
      <Divider orientation="left">لیست پزشکان</Divider>
      <Table
        columns={[
          { title: "نام", dataIndex: "name" },
          { title: "تخصص", dataIndex: "specialty" },
          { title: "کلینیک", dataIndex: "clinic" },
          { title: "منشی", dataIndex: "secretary" },
          { title: "تعداد نوبت‌ها", dataIndex: "appointments" }
        ]}
        dataSource={doctorTableData}
        pagination={{ pageSize: 5 }}
        style={{ marginBottom: 48 }}
      />

      <Divider orientation="left">لیست منشی‌ها</Divider>
      <Table
        columns={[
          { title: "نام", dataIndex: "name" },
          { title: "پزشک مربوطه", dataIndex: "doctor" },
          { title: "ایمیل", dataIndex: "email" }
        ]}
        dataSource={secretaryTableData}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}
