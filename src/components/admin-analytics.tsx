"use client";

import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, TeamOutlined, MedicineBoxOutlined, CalendarOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import dayjs from "dayjs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface AnalyticsProps {
  doctorCount: number;
  secretaryCount: number;
  clinicCount: number;
  appointmentCount: number;
  appointmentsByDate: Array<{ date: string; count: number }>;
  appointmentsByStatus: Array<{ status: string; value: number }>;
  appointmentsByDoctor: Array<{ name: string; value: number }>;
  appointmentsByHour: Array<{ hour: string; count: number }>;
}

export function AdminAnalytics({
  doctorCount,
  secretaryCount,
  clinicCount,
  appointmentCount,
  appointmentsByDate,
  appointmentsByStatus,
  appointmentsByDoctor,
  appointmentsByHour
}: AnalyticsProps) {
  return (
    <>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="پزشکان" value={doctorCount} prefix={<MedicineBoxOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="منشی‌ها" value={secretaryCount} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="کلینیک‌ها" value={clinicCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="نوبت‌ها" value={appointmentCount} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="روند نوبت‌های ماه جاری" bordered={false}>
            <LineChart width={800} height={300} data={appointmentsByDate}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="تعداد نوبت" />
            </LineChart>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="وضعیت نوبت‌ها" bordered={false}>
            <PieChart width={300} height={300}>
              <Pie
                data={appointmentsByStatus}
                cx={150}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {appointmentsByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="نوبت‌ها به تفکیک پزشک" bordered={false}>
            <BarChart width={500} height={300} data={appointmentsByDoctor}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="تعداد نوبت" fill="#82ca9d" />
            </BarChart>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="توزیع ساعتی نوبت‌ها" bordered={false}>
            <LineChart width={500} height={300} data={appointmentsByHour}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="تعداد نوبت" stroke="#ffc658" />
            </LineChart>
          </Card>
        </Col>
      </Row>
    </>
  );
}
