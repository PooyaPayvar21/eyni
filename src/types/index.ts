export interface AvailabilitySlot {
  id: number;
  datetime: string;
  isBooked: boolean;
  doctorId: number;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  slug: string;
  bio?: string;
  clinicId: number;
  clinic: {
    id: number;
    name: string;
    address: string;
    city: {
      id: number;
      name: string;
    };
  };
  slots: AvailabilitySlot[];
}

export interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  datetime: string;
  doctorId: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  doctor: Doctor;
}
