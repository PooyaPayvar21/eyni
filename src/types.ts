import type { User } from "next-auth";
import type {
  City as PrismaCity,
  Clinic as PrismaClinic,
  Doctor as PrismaDoctor,
  Secretary as PrismaSecretary,
  Appointment as PrismaAppointment,
  AvailabilitySlot as PrismaAvailabilitySlot
} from "@prisma/client";

export interface CustomUser extends User {
  role?: string;
}

export interface City extends PrismaCity {
  clinics: Array<{
    id: number;
    name: string;
    address: string;
    cityId: number;
  }>;
}

export interface Clinic extends PrismaClinic {
  city: City;
  doctors: Doctor[];
}

export interface Doctor extends PrismaDoctor {
  clinic: Clinic;
  secretary?: Secretary;
  appointments: PrismaAppointment[];
  slots: PrismaAvailabilitySlot[];
}

export interface Secretary extends PrismaSecretary {
  user: {
    id: string;
    email: string;
    name: string;
  };
  doctors: Doctor[];
}

export interface Appointment extends PrismaAppointment {
  doctor: Doctor;
}

export interface AvailabilitySlot extends PrismaAvailabilitySlot {
  doctor: {
    name: string;
  };
}
