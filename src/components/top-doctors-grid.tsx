"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";

type City = {
  id: number;
  name: string;
};

type Doctor = {
  id: number;
  slug: string;
  name: string;
  specialty: string;
  _count: { appointments: number };
  clinic: { name: string; city: { name: string } };
};

function avatarFromName(name: string) {
  const parts = name.trim().split(" ");
  const initials =
    (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  return initials || "Dr";
}

export function TopDoctorsGrid({
  doctors,
  cities,
}: {
  doctors: Doctor[];
  cities: City[];
}) {
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const filtered = useMemo(() => {
    if (selectedCity === "all") return doctors;
    return doctors.filter((d) => d.clinic.city.name === selectedCity);
  }, [selectedCity, doctors]);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-animate]") || []
    );
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-2");
            entry.target.classList.add("opacity-100", "translate-y-0");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, [filtered]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <label className="w-full sm:w-auto text-sm text-muted-foreground">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="mt-1 w-full sm:w-56 rounded-lg border border-[#AEDCEA] cursor-pointer bg-background px-3 py-2 text-sm focus:border-[#AEDCEA]"
            aria-label="انتخاب شهر"
          >
            <option value="all">همه شهرها</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-7"
      >
        {filtered.map((doc) => (
          <Link
            key={doc.id}
            href={`/doctors/${doc.slug}`}
            className="w-[350px] group rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-sky-500/30 hover:from-cyan-500/50 hover:to-sky-500/50 transition will-change-transform overflow-hidden"
          >
            <div
              data-animate
              className="opacity-0 translate-y-2 rounded-2xl border bg-card p-5 h-full transition duration-500 ease-out"
            >
              <div className="flex items-start gap-3 ">
                <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-sky-500 text-white flex items-center justify-center font-semibold shadow-sm">
                  {avatarFromName(doc.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                        {doc.name}
                      </h3>
                      <span className="mt-1 inline-flex items-center text-xs rounded-full border px-2 py-0.5 bg-background">
                        {doc.specialty}
                      </span>
                    </div>
                    <span className="text-xs rounded-full border px-2 py-1 bg-background whitespace-nowrap">
                      {doc._count.appointments} رزرو
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> {doc.clinic.name}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-4 w-4" /> {doc.clinic.city.name}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    مشاهده پروفایل <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
