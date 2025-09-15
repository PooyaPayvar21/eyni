import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/metadata";
import { BookingForm } from "@/components/booking-form";
import { BookingSuccessToast } from "@/components/booking-success-toast";
import { Stethoscope, MapPin, Building2, Clock, Calendar } from "lucide-react";

type Props = {
  params: { slug: string };
  searchParams?: { booked?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doctor = await prisma.doctor.findUnique({
    where: { slug: params.slug },
    include: {
      clinic: { include: { city: true } },
    },
  });

  if (!doctor) {
    return {
      title: "پزشک یافت نشد",
      description: "پزشک مورد نظر در سیستم وجود ندارد.",
    };
  }

  const title = `دکتر ${doctor.name} - ${doctor.specialty} در ${doctor.clinic.city.name}`;
  const description = `رزرو نوبت با دکتر ${doctor.name}، متخصص ${doctor.specialty} در ${doctor.clinic.name}. مشاهده زمان‌های خالی و رزرو آنلاین نوبت.`;
  const keywords = `${doctor.name}, ${doctor.specialty}, رزرو نوبت پزشک, ${doctor.clinic.city.name}, نوبت دهی آنلاین`;

  return generateSEOMetadata({
    title,
    description,
    keywords,
    path: `/doctors/${params.slug}`,
    type: "profile",
  });
}

export default async function DoctorPage({ params, searchParams }: Props) {
  const doctor = await prisma.doctor.findUnique({
    where: { slug: params.slug },
    include: {
      clinic: { include: { city: true } },
      slots: {
        where: { isBooked: false },
        orderBy: { datetime: "asc" },
      },
    },
  });

  if (!doctor) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-56px)]">
      {/* Hero section with gradient background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/70 to-transparent dark:from-cyan-950/20 pointer-events-none" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto relative">
            {/* Doctor header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    دکتر {doctor.name}
                  </h1>
                  <div className="flex flex-wrap items-center text-muted-foreground gap-4">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-4 h-4" />
                      <span>{doctor.specialty}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.clinic.city.name}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{doctor.clinic.name}</span>
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{doctor.slots.length} زمان خالی</span>
                </div>
              </div>

              {doctor.bio && (
                <p className="mt-6 text-muted-foreground">{doctor.bio}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Location section */}
          <section className="mb-8">
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">اطلاعات مطب</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">
                      آدرس
                    </h3>
                    <p>{doctor.clinic.address}</p>
                  </div>
                  {/* Add more clinic details here */}
                </div>
              </div>
            </div>
          </section>

          {/* Booking section */}
          <section className="mb-8">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">رزرو نوبت</h2>
              <BookingForm doctor={doctor} />
            </div>
          </section>

          {searchParams?.booked === "true" && <BookingSuccessToast />}
        </div>
      </div>
    </div>
  );
}
