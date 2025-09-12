"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const appointmentSchema = z.object({
  doctorId: z.number(),
  patientName: z.string().min(2, "Name is too short"),
  patientPhone: z.string().min(10, "Invalid phone number"),
  // datetime-local input is not RFC3339; validate presence here and parse manually below
  datetime: z.string().min(1, "Invalid date and time"),
});

export async function createAppointment(formData: FormData): Promise<void> {
  const validatedFields = appointmentSchema.safeParse({
    doctorId: Number(formData.get("doctorId")),
    patientName: formData.get("patientName"),
    patientPhone: formData.get("patientPhone"),
    datetime: formData.get("datetime"),
  });

  if (!validatedFields.success) {
    // In a more advanced flow, you'd return field errors via server actions + useFormStatus.
    // For MVP, throw to surface an error state.
    throw new Error("Validation failed");
  }

  const parsedDate = new Date(validatedFields.data.datetime);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date and time");
  }

  // Enforce secretary-defined availability: slot must exist and not be booked
  const slug = await prisma.$transaction(async (tx) => {
    // Temporary cast to unblock TS until `yarn prisma generate` runs with AvailabilitySlot
    const client = tx as any;
    const reserve = await client.availabilitySlot.updateMany({
      where: {
        doctorId: validatedFields.data.doctorId,
        datetime: parsedDate,
        isBooked: false,
      },
      data: { isBooked: true },
    });

    if (reserve.count === 0) {
      throw new Error("Selected time is no longer available");
    }

    await client.appointment.create({
      data: {
        doctorId: validatedFields.data.doctorId,
        patientName: validatedFields.data.patientName,
        patientPhone: validatedFields.data.patientPhone,
        datetime: parsedDate,
      },
    });
    const d = await client.doctor.findUnique({ where: { id: validatedFields.data.doctorId }, select: { slug: true } });
    return d?.slug || "";
  });

  revalidatePath(`/doctors/${slug}`);
  redirect(`/doctors/${slug}?booked=1`);
}
