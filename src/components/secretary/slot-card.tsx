"use client";

import { Card, Space, Row, Col, Tag, Typography, ConfigProvider, theme } from "antd";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { type AvailabilitySlot, type Appointment } from "@/types";
import { DeleteSlotForm } from "@/components/admin-slot-forms";
import { deleteSlot } from "@/app/admin/actions";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const { Text } = Typography;

interface SlotCardProps {
  slot: AvailabilitySlot;
  appointments: Appointment[];
}

type StatusType = {
  [key: string]: {
    color: string;
    text: string;
  }
};

const STATUS_TYPES: StatusType = {
  PENDING: { color: "warning", text: "در انتظار" },
  CONFIRMED: { color: "success", text: "تایید شده" },
  CANCELLED: { color: "error", text: "لغو شده" },
  COMPLETED: { color: "default", text: "انجام شده" }
};

const formatJalaliDate = (date: Date) => {
  const jalaliDate = new DateObject({
    date,
    calendar: persian,
    locale: persian_fa
  });
  return jalaliDate.format('DD MMMM YYYY ساعت HH:mm');
};

export function SlotCard({ slot, appointments }: SlotCardProps) {
  const { theme: currentTheme } = useTheme();
  const appointment = appointments.find(a => 
    a.doctorId === slot.doctorId && 
    dayjs(a.datetime).isSame(dayjs(slot.datetime))
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Card 
        size="small"
        className={cn(
          "border rounded-lg",
          slot.isBooked ? "border-primary" : currentTheme === 'dark' ? "border-gray-700" : "border-gray-200"
        )}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Space direction="vertical" size="small">
            <Text strong>{slot.doctor.name}</Text>
            <Text type="secondary">{formatJalaliDate(new Date(slot.datetime))}</Text>
            {slot.isBooked && appointment && (
              <>
                <Space>
                  <UserOutlined />
                  <Text>{appointment.patientName}</Text>
                </Space>
                <Space>
                  <PhoneOutlined />
                  <Text>{appointment.patientPhone}</Text>
                </Space>
              </>
            )}
          </Space>
        </Col>
        <Col>
          {slot.isBooked && appointment ? (
            <Tag color={STATUS_TYPES[appointment.status || 'PENDING'].color}>
              {STATUS_TYPES[appointment.status || 'PENDING'].text}
            </Tag>
          ) : (
            <DeleteSlotForm slotId={slot.id} deleteSlot={deleteSlot} />
          )}
        </Col>
      </Row>
    </Card>
    </ConfigProvider>
  );
}
