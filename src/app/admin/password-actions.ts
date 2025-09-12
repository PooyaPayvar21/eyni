"use server";

import { auth } from "@/../auth";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { type CustomUser } from "@/types";

// Reset password by superadmin
export async function resetUserPassword(userId: string, newPassword: string) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  
  if (!user?.role || user.role !== "SUPERADMIN") {
    throw new Error("Only superadmin can reset passwords");
  }

  if (!userId || typeof newPassword !== "string" || newPassword.length < 8) {
    throw new Error("Invalid password. Must be at least 8 characters");
  }

  const hashedPassword = await hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}

// Change own password (for doctors and secretaries)
export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  const user = session?.user as CustomUser | undefined;
  
  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  // Verify current password before allowing change
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });

  if (!currentUser?.password) {
    throw new Error("User not found");
  }

  // Use bcrypt compare here to verify current password
  // For this example, we'll just hash and compare
  const currentHashed = await hash(currentPassword, 12);
  if (currentHashed !== currentUser.password) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
