"use client";

import Link from "next/link";
import { Stethoscope, MapPin, Building2, Clock } from "lucide-react";
import type { Doctor, Clinic, City } from "@prisma/client";

type DoctorCardProps = {
  doctor: Doctor & {
    clinic: Clinic & {
      city: City;
    };
    _count: {
      slots: number;
    };
  };
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className="group">
      <article className="h-full rounded-lg border bg-card p-4 transition-all hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
              دکتر {doctor.name}
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Stethoscope className="w-4 h-4" />
                {doctor.specialty}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {doctor.clinic.city.name}
              </span>
            </div>
          </div>
          <span className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {doctor._count.slots} زمان خالی
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {doctor.clinic.name}
          </div>
          <p className="mt-1 line-clamp-2">
            {doctor.clinic.address}
          </p>
        </div>
      </article>
    </Link>
  );
}
