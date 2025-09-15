import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { MapPin, Search, Building2, ArrowRight } from "lucide-react";
import { generateSEOMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generateSEOMetadata({
  title: "لیست پزشکان - رزرو نوبت آنلاین",
  description:
    "جستجو و رزرو نوبت آنلاین پزشک. پزشک مورد نظر خود را بر اساس تخصص، شهر و کلینیک پیدا کنید و به راحتی نوبت بگیرید.",
  keywords: "رزرو نوبت پزشک, نوبت دهی آنلاین, پزشکان متخصص",
  path: "/doctors",
});

interface SearchParams {
  city?: string;
  q?: string;
  specialty?: string;
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const city = await searchParams?.city?.trim();
  const q = await searchParams?.q?.trim();
  const specialty = await searchParams?.specialty?.trim();

  // Get all active cities for filtering
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Get unique specialties for filtering
  const specialties = await prisma.doctor.findMany({
    select: { specialty: true },
    distinct: ['specialty'],
    orderBy: { specialty: 'asc' }
  });

  // Get filtered doctors
  const doctors = await prisma.doctor.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { specialty: { contains: q, mode: "insensitive" } }
          ]
        } : {},
        city ? {
          clinic: {
            city: { 
              name: { equals: city, mode: "insensitive" }
            }
          }
        } : {},
        specialty ? {
          specialty: { equals: specialty, mode: "insensitive" }
        } : {}
      ]
    },
    include: {
      clinic: {
        include: {
          city: true
        }
      },
      _count: {
        select: {
          appointments: true,
          slots: {
            where: { isBooked: false }
          }
        }
      }
    },
    orderBy: [{ name: 'asc' }]
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold">لیست پزشکان</h1>
        <p className="text-muted-foreground mt-1">پزشک مورد نظر خود را جستجو یا بر اساس شهر فیلتر کنید.</p>

        <form className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3" action="/doctors" method="get">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <select name="city" defaultValue={city || ""} className="w-full bg-transparent outline-none text-sm">
              <option value="">همه شهرها</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q || ""}
              placeholder="نام پزشک یا تخصص"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:bg-primary/90">جستجو</button>
        </form>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {doctors.map((doc) => (
            <Link key={doc.id} href={`/doctors/${doc.slug}`} className="group rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-sky-500/30 hover:from-cyan-500/50 hover:to-sky-500/50 transition">
              <div className="rounded-2xl border bg-card p-5 h-full">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 text-white flex items-center justify-center font-semibold shadow-sm">
                    {initials(doc.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">{doc.name}</h3>
                        <span className="mt-1 inline-flex items-center text-xs rounded-full border px-2 py-0.5 bg-background">{doc.specialty}</span>
                      </div>
                      <span className="text-xs rounded-full border px-2 py-1 bg-background whitespace-nowrap">{doc._count.appointments} رزرو</span>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {doc.clinic.name}</p>
                      <p className="flex items-center gap-1.5 truncate"><MapPin className="h-4 w-4" /> {doc.clinic.city.name}</p>
                    </div>
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">مشاهده پروفایل <ArrowRight className="mr-1 h-4 w-4" /></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(" ");
  const ini = (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  return ini || "Dr";
}
