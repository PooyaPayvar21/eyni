import { auth } from "@/../auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { AdminLayout } from "@/components/admin-layout";
import { SecretaryDashboard } from "@/components/secretary-dashboard";
import { type Doctor, type AvailabilitySlot, type Appointment } from "@/types";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      redirect("/api/auth/signin?callbackUrl=/admin");
      return null;
    }

    const user = session.user;

    const isSuper = user.role === "SUPERADMIN";

    // Fetch all users if superadmin
    const users = isSuper ? await prisma.user.findMany({
      where: {
        email: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { email: 'asc' },
    }).then(users => users.filter(user => user.email !== null)
       .map(user => ({
         ...user,
         email: user.email || '', // Convert null to empty string
         role: user.role.toString() // Convert Role enum to string
       }))) : [];

    if (!isSuper) {
      const doctors = await prisma.doctor.findMany({
        where: { secretary: { userId: user.id } },
        include: {
          clinic: true,
          appointments: true,
          slots: true
        },
        orderBy: { name: "asc" }
      }) as unknown as Doctor[];

      const slots = await prisma.availabilitySlot.findMany({
        where: { 
          doctor: { secretary: { userId: user.id } },
          datetime: { gte: new Date() },
        },
        include: { doctor: { select: { name: true } } },
        orderBy: { datetime: "asc" },
        take: 200,
      }) as AvailabilitySlot[];

      const appointments = (await prisma.appointment.findMany({
        where: { 
          doctor: { secretary: { userId: user.id } },
          datetime: { gte: new Date() },
        },
        include: {
          doctor: {
            include: {
              clinic: true,
              appointments: true,
              slots: true
            }
          }
        },
        orderBy: { datetime: 'asc' },
      })) as unknown as Array<Appointment>;

      return <SecretaryDashboard 
        doctors={doctors} 
        slots={slots}
        appointments={appointments} 
      />;
    }

    // Fetch analytics data
    const doctors = await prisma.doctor.findMany({
      include: { clinic: true, secretary: true, appointments: true }
    });
    const secretaries = await prisma.secretary.findMany({
      include: { doctor: true, user: true }
    });
    const clinics = await prisma.clinic.findMany();
    
    // Get appointments for the current month
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();
    
    const appointments = await prisma.appointment.findMany({
      where: {
        datetime: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        doctor: {
          include: {
            clinic: true
          }
        }
      },
      orderBy: {
        datetime: 'asc'
      }
    });

    // Prepare analytics data
    const appointmentsByDate = Array.from({ length: dayjs().daysInMonth() }, (_, i) => {
      const date = dayjs().startOf('month').add(i, 'day');
      return {
        date: date.format('MM/DD'),
        count: appointments.filter(app => 
          dayjs(app.datetime).format('MM/DD') === date.format('MM/DD')
        ).length
      };
    });

    const appointmentsByStatus = Object.entries(
      appointments.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([status, value]) => ({ status, value }));

    const appointmentsByDoctor = Object.entries(
      appointments.reduce((acc, app) => {
        acc[app.doctor.name] = (acc[app.doctor.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const appointmentsByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour: hour.toString().padStart(2, '0') + ':00',
      count: appointments.filter(app => 
        dayjs(app.datetime).hour() === hour
      ).length
    }));

    // Analytics
    const doctorCount = doctors.length;
    const secretaryCount = secretaries.length;
    const clinicCount = clinics.length;
    const appointmentCount = appointments.length;

    // Table data
    const doctorTableData = doctors.map((doc) => ({
      key: doc.id.toString(),
      name: doc.name,
      specialty: doc.specialty,
      clinic: doc.clinic?.name,
      secretary: doc.secretary?.name || "-",
      appointments: doc.appointments.length,
    }));

    const secretaryTableData = secretaries.map((sec) => ({
      key: sec.id.toString(),
      name: sec.name,
      doctor: sec.doctor?.name,
      email: sec.user?.email || undefined,
    }));

    return (
      <AdminLayout
        isSuperAdmin={isSuper}
        users={users}
        doctorCount={doctorCount}
        secretaryCount={secretaryCount}
        clinicCount={clinicCount}
        appointmentCount={appointmentCount}
        appointmentsByDate={appointmentsByDate}
        appointmentsByStatus={appointmentsByStatus}
        appointmentsByDoctor={appointmentsByDoctor}
        appointmentsByHour={appointmentsByHour}
        doctorTableData={doctorTableData}
        secretaryTableData={secretaryTableData}
      />
    );
  } catch (error) {
    console.error("Admin page error:", error);
    redirect("/api/auth/signin");
  }
}
