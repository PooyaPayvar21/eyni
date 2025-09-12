"use client";

import { Card, Row, Col, Statistic, ConfigProvider, theme } from "antd";
import { CalendarOutlined, CheckCircleOutlined, UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";

interface StatCardsProps {
  todayAppointments: number;
  confirmedAppointments: number;
  totalAppointments: number;
  availableSlots: number;
}

export function StatCards({
  todayAppointments,
  confirmedAppointments,
  totalAppointments,
  availableSlots
}: StatCardsProps) {
  const { theme: currentTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="کل نوبت‌های امروز"
              value={todayAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="نوبت‌های تایید شده"
            value={confirmedAppointments}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="کل نوبت‌ها"
            value={totalAppointments}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="زمان‌های خالی"
            value={availableSlots}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
    </Row>
    </ConfigProvider>
  );
}
