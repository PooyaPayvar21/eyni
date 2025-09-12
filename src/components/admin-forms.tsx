"use client";

import { createClinic, createDoctor, createSecretary } from "../app/admin/actions";
import type { Clinic } from "@/types";

function ClinicForm() {
  return (
    <form action={createClinic} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <div>
        <label className="block text-sm mb-1">نام کلینیک</label>
        <input name="name" type="text" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
      </div>
      <button type="submit" className="rounded-md bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:bg-primary/90">
        افزودن کلینیک
      </button>
    </form>
  );
}

function DoctorForm({ clinics }: { clinics: Clinic[] }) {
  return (
    <form action={createDoctor} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">نام پزشک</label>
          <input
            name="name"
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">تخصص</label>
          <input
            name="specialty"
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">ایمیل</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-md border bg-background px-3 py-2 text-left"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">رمز عبور</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-left"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">شناسه URL (slug)</label>
          <input
            name="slug"
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2 text-left"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">کلینیک</label>
          <select name="clinicId" className="w-full rounded-md border bg-background px-3 py-2" required>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">بیوگرافی</label>
        <textarea
          name="bio"
          className="w-full rounded-md border bg-background px-3 py-2 min-h-[100px]"
        />
      </div>

      <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:bg-primary/90">
        افزودن پزشک جدید
      </button>
    </form>
  );
}

function SecretaryForm({ doctors }: { doctors: Array<{ id: number; name: string; clinic: { name: string } }> }) {
  return (
    <form action={createSecretary} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">نام منشی</label>
          <input
            name="name"
            type="text"
            className="w-full rounded-md border bg-background px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">پزشک مربوطه</label>
          <select name="doctorId" className="w-full rounded-md border bg-background px-3 py-2" required>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.clinic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">ایمیل</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-md border bg-background px-3 py-2 text-left"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">رمز عبور</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-left"
            dir="ltr"
            required
          />
        </div>
      </div>

      <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:bg-primary/90">
        افزودن منشی جدید
      </button>
    </form>
  );
}

export { ClinicForm, DoctorForm, SecretaryForm };
