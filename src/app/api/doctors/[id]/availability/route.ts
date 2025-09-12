import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD (Gregorian)
  const doctorId = Number(params.id);
  if (!doctorId || !date) {
    return NextResponse.json({ slots: [] }, { status: 200 });
  }

  // Compute day bounds in UTC
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const slots = await prisma.availabilitySlot.findMany({
    where: {
      doctorId,
      isBooked: false,
      datetime: { gte: start, lte: end },
    },
    orderBy: { datetime: "asc" },
  });

  return NextResponse.json({ slots: slots.map((s) => s.datetime.toISOString()) });
}
