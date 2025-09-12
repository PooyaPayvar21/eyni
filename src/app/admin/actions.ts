"use server";

import { auth } from "@/../auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { type CustomUser } from "@/types";
import { hash } from "bcrypt";

export async function createCity(formData: FormData) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  if (!user?.role || !["SUPERADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid city name");
  }

  await prisma.city.create({
    data: {
      name: name.trim(),
      isActive: true,
    },
  });

  revalidatePath("/admin");
}

export async function updateCity(formData: FormData) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  if (!user?.role || !["SUPERADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  const name = formData.get("name");
  const isActive = formData.get("isActive") === "true";

  if (!id || typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid input");
  }

  await prisma.city.update({
    where: { id },
    data: {
      name: name.trim(),
      isActive,
    },
  });

  revalidatePath("/admin");
}

export async function deleteCity(formData: FormData) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  if (!user?.role || !["SUPERADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  if (!id) {
    throw new Error("Invalid input");
  }

  // Check if city has any clinics
  const city = await prisma.city.findUnique({
    where: { id },
    include: { clinics: { select: { id: true } } },
  });

  if (!city) {
    throw new Error("City not found");
  }

  if (city.clinics.length > 0) {
    throw new Error("Cannot delete city with existing clinics");
  }

  await prisma.city.delete({ where: { id } });
  revalidatePath("/admin");
}


export async function createClinic(formData: FormData) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  if (!user?.role || !["SUPERADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name");
  const address = formData.get("address");
  const cityId = Number(formData.get("cityId"));

  if (typeof name !== "string" || name.trim() === "" || 
      typeof address !== "string" || address.trim() === "" || 
      !cityId) {
    throw new Error("Invalid input");
  }

  await prisma.clinic.create({
    data: {
      name: name.trim(),
      address: address.trim(),
      cityId,
    },
  });

  revalidatePath("/admin");
}

export async function updateClinic(formData: FormData) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  if (!user?.role || !["SUPERADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  const name = formData.get("name");
  const address = formData.get("address");
  const cityId = Number(formData.get("cityId"));

  if (!id || typeof name !== "string" || name.trim() === "" || 
      typeof address !== "string" || address.trim() === "" || 
      !cityId) {
    throw new Error("Invalid input");
  }

  await prisma.clinic.update({
    where: { id },
    data: {
      name: name.trim(),
      address: address.trim(),
      cityId,
    },
  });

  revalidatePath("/admin");
}

export async function deleteClinic(formData: FormData) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  if (!user?.role || !["SUPERADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  if (!id) {
    throw new Error("Invalid input");
  }

  // Check if clinic has any doctors
  const clinic = await prisma.clinic.findUnique({
    where: { id },
    include: { doctors: { select: { id: true } } },
  });

  if (!clinic) {
    throw new Error("Clinic not found");
  }

  if (clinic.doctors.length > 0) {
    throw new Error("Cannot delete clinic with existing doctors");
  }

  await prisma.clinic.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createDoctor(formData: FormData) {
  const name = formData.get("name");
  const specialty = formData.get("specialty");
  const slug = formData.get("slug");
  const clinicId = Number(formData.get("clinicId"));
  if (
    typeof name !== "string" || name.trim() === "" ||
    typeof specialty !== "string" || specialty.trim() === "" ||
    typeof slug !== "string" || slug.trim() === "" ||
    !clinicId
  ) {
    throw new Error("Invalid input");
  }
  await prisma.doctor.create({
    data: {
      name: name.trim(),
      specialty: specialty.trim(),
      slug: slug.trim(),
      clinicId,
    },
  });
  revalidatePath("/admin");
}

export async function createSecretary(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  
  if (
    typeof name !== "string" || name.trim() === "" ||
    typeof email !== "string" || email.trim() === "" ||
    typeof password !== "string" || password.trim().length < 8
  ) {
    throw new Error("Invalid input. Password must be at least 8 characters long.");
  }

  const trimmedPassword = password.trim();
  
  // Basic password strength validation
  if (!/[A-Z]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one number");
  }
  if (!/[^A-Za-z0-9]/.test(trimmedPassword)) {
    throw new Error("Password must contain at least one special character");
  }

  const hashedPassword = await hash(trimmedPassword, 12); // Using 12 rounds for better security

  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: "SECRETARY",
      secretary: {
        create: {
          name: name.trim()
        },
      },
    },
  });
  revalidatePath("/admin");
}

function assertCanManageDoctor(user: { id: string; role: string }, doctorId: number) {
  if (user.role === "SUPERADMIN" || user.role === "ADMIN") return Promise.resolve();
  // SECRETARY: must own the doctor
  return prisma.doctor.findFirst({ where: { id: doctorId, secretary: { userId: user.id } }, select: { id: true } }).then((d) => {
    if (!d) throw new Error("Unauthorized");
  });
}

export async function createSlot(prevState: unknown, formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) throw new Error("Unauthorized");
  
  const userWithRole = {
    id: user.id,
    role: (user as { role?: string }).role || "USER"
  };

  const doctorId = Number(formData.get("doctorId"));
  const datetimeStr = String(formData.get("datetime"));
  if (!doctorId || !datetimeStr) throw new Error("Invalid input");

  await assertCanManageDoctor(userWithRole, doctorId);

  const datetime = new Date(datetimeStr);
  if (isNaN(datetime.getTime())) throw new Error("Invalid datetime");

  await prisma.availabilitySlot.create({
    data: { doctorId, datetime },
  });

  revalidatePath("/admin");
}

export async function deleteSlot(prevState: unknown, formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) throw new Error("Unauthorized");
  
  const userWithRole = {
    id: user.id,
    role: (user as { role?: string }).role || "USER"
  };

  const slotId = Number(formData.get("slotId"));
  if (!slotId) throw new Error("Invalid slot");

  // Ensure ownership for secretaries
  const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId }, include: { doctor: { select: { secretary: { select: { userId: true } } } } } });
  if (!slot) throw new Error("Not found");
  if (userWithRole.role === "SECRETARY" && slot.doctor.secretary?.userId !== userWithRole.id) throw new Error("Unauthorized");

  await prisma.availabilitySlot.delete({ where: { id: slotId } });
  revalidatePath("/admin");
}
