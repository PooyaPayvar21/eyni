"use client";

import { useState, useEffect } from "react";
import { Layout, Typography, Select, Button, Card, Row, Col, Space, Empty, ConfigProvider, theme } from "antd";
import { type Doctor, type AvailabilitySlot, type Appointment } from "@/types";
import { CreateSlotForm } from "@/components/admin-slot-forms";
import { createSlot } from "@/app/admin/actions";
import { BulkSlotCreationDialog } from "./bulk-slot-creation";
import { LogoutButton } from "./logout-button";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { StatCards } from "./secretary/stat-cards";
import { SlotCalendar } from "./secretary/slot-calendar";
import { SlotCard } from "./secretary/slot-card";
import { useTheme } from "next-themes";

const { Title, Text } = Typography;
const { Content, Sider } = Layout;

type TabType = 'available' | 'booked' | 'all';

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

export function SecretaryDashboard({ 
  doctors, 
  slots,
  appointments
}: { 
  doctors: Doctor[], 
  slots: AvailabilitySlot[],
  appointments: Appointment[]
}) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<number | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  // Calculate statistics
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === "CONFIRMED").length;
  const todayAppointments = appointments.filter(a => dayjs(a.datetime).isSame(dayjs(), 'day')).length;
  const availableSlots = slots.filter(s => !s.isBooked).length;

  const filteredSlots = slots.filter(slot => {
    if (activeTab === 'available' && slot.isBooked) return false;
    if (activeTab === 'booked' && !slot.isBooked) return false;
    if (selectedDoctor !== 'all' && slot.doctorId !== selectedDoctor) return false;
    if (selectedDate && !dayjs(slot.datetime).isSame(selectedDate, 'day')) return false;
    return true;
  });

  const { theme: currentTheme } = useTheme();
  
  // Ensure theme is stable during initial render
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid rendering with mismatched themes
  }
  
  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={280} theme={currentTheme as 'light' | 'dark'} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>پنل منشی</Title>
            <Text type="secondary">مدیریت نوبت‌ها و زمان‌بندی</Text>
          </div>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>انتخاب پزشک</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              value={selectedDoctor}
              onChange={value => setSelectedDoctor(value === 'all' ? 'all' : Number(value))}
            >
              <Select.Option value="all">همه پزشکان</Select.Option>
              {doctors.map(d => (
                <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>فیلتر وضعیت</Text>
            <Space direction="vertical" style={{ width: '100%', marginTop: '8px' }}>
              {[
                { id: 'all', label: 'همه', icon: CalendarOutlined },
                { id: 'available', label: 'زمان‌های خالی', icon: CheckCircleOutlined },
                { id: 'booked', label: 'نوبت‌های رزرو شده', icon: ClockCircleOutlined },
              ].map(tab => (
                <Button
                  key={tab.id}
                  type={activeTab === tab.id ? 'primary' : 'text'}
                  icon={<tab.icon />}
                  block
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{ textAlign: 'right' }}
                >
                  {tab.label}
                </Button>
              ))}
            </Space>
          </div>

          <LogoutButton />
        </Space>
      </Sider>

      <Content style={{ padding: '24px', background: '#f5f7fa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Quick Stats */}
          <StatCards
            todayAppointments={todayAppointments}
            confirmedAppointments={confirmedAppointments}
            totalAppointments={totalAppointments}
            availableSlots={availableSlots}
          />

          {/* Calendar and Slots Grid */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <SlotCalendar
                slots={slots}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                title={`زمان‌های ${selectedDate.format('DD MMMM')}`}
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    افزودن زمان جدید
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {filteredSlots.map(slot => (
                    <SlotCard key={slot.id} slot={slot} appointments={appointments} />
                  ))}
                  {filteredSlots.length === 0 && (
                    <Empty
                      description="موردی یافت نشد"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Slot Creation */}
          <Card title="ایجاد زمان نوبت" style={{ marginTop: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <CreateSlotForm doctors={doctors} createSlot={createSlot} />
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {doctors.map(doctor => (
                    <BulkSlotCreationDialog
                      key={doctor.id}
                      doctorId={doctor.id}
                      onCreateSlots={async (slots) => {
                        for (const slot of slots) {
                          const formData = new FormData();
                          formData.set('doctorId', String(doctor.id));
                          formData.set('datetime', slot.datetime);
                          await createSlot(undefined, formData);
                        }
                      }}
                    />
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
    </ConfigProvider>
  );
}
