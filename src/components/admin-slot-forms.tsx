"use client";

import { useTransition } from "react";

type CreateSlotFormProps = {
  doctors: any[];
  createSlot: (prevState: any, formData: FormData) => Promise<void>;
};

export function CreateSlotForm({ doctors, createSlot }: CreateSlotFormProps) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await createSlot(undefined, formData);
    startTransition(() => {
      // revalidate /admin after success
      fetch("/api/revalidate", { method: "POST", body: JSON.stringify({ path: "/admin" }) });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="block text-sm mb-1">پزشک</label>
        <select name="doctorId" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.specialty}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">تاریخ و ساعت</label>
        <input
          name="datetime"
          type="datetime-local"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          required
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending ? "در حال افزودن..." : "افزودن"}
        </button>
      </div>
    </form>
  );
}

type DeleteSlotFormProps = {
  slotId: number;
  deleteSlot: (prevState: any, formData: FormData) => Promise<void>;
};

export function DeleteSlotForm({ slotId, deleteSlot }: DeleteSlotFormProps) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await deleteSlot(undefined, formData);
    startTransition(() => {
      // revalidate /admin after success
      fetch("/api/revalidate", { method: "POST", body: JSON.stringify({ path: "/admin" }) });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <input type="hidden" name="slotId" value={slotId} />
      <button
        className="text-red-600 hover:underline text-sm"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "در حال حذف..." : "حذف"}
      </button>
    </form>
  );
}
