"use client";

import { MapPin, Search, Building2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { City } from "@prisma/client";

type SearchFormProps = {
  cities: City[];
  specialties: { specialty: string }[];
};

export function SearchForm({ cities, specialties }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams();

      const city = formData.get("city");
      const specialty = formData.get("specialty");
      const q = formData.get("q");

      if (city) params.set("city", city as string);
      if (specialty) params.set("specialty", specialty as string);
      if (q) params.set("q", q as string);

      router.push(`/doctors?${params.toString()}`);
    },
    [router]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card p-4 rounded-lg border"
    >
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <select
          name="city"
          defaultValue={searchParams.get("city") || ""}
          className="w-full bg-transparent outline-none text-sm"
        >
          <option value="">همه شهرها</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <select
          name="specialty"
          defaultValue={searchParams.get("specialty") || ""}
          className="w-full bg-transparent outline-none text-sm"
        >
          <option value="">همه تخصص‌ها</option>
          {specialties.map((s) => (
            <option key={s.specialty} value={s.specialty}>
              {s.specialty}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          name="q"
          defaultValue={searchParams.get("q") || ""}
          placeholder="جستجو نام پزشک..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
    </form>
  );
}
