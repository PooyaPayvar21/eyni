"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createAppointment } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { JalaliDateTimePicker } from "@/components/jalali-datetime-picker";

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  patientPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
  datetime: z.string().min(1, { message: "Please select a date and time." }),
});

export function BookingForm({ doctor }: { doctor: { id: number, slots: Array<{ datetime: Date }> } }) {
  const { register, setValue, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form action={createAppointment} className="space-y-4 mt-8">
      <input type="hidden" name="doctorId" value={doctor.id} />
      {/* Hidden ISO datetime value synced from Jalali picker */}
      <input type="hidden" {...register("datetime")}/>
      <JalaliDateTimePicker
        label="زمان نوبت"
        onChange={(iso) => setValue("datetime", iso, { shouldValidate: true })}
        doctorId={doctor.id}
        availableDates={doctor.slots.map(slot => slot.datetime)}
      />
      {errors.datetime && <p className="mt-2 text-sm text-red-600">{errors.datetime.message}</p>}
      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">نام و نام خانوادگی</label>
        <input
          type="text"
          id="patientName"
          {...register("patientName")}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm bg-input text-foreground p-2"
        />
        {errors.patientName && <p className="mt-2 text-sm text-red-600">{errors.patientName.message}</p>}
      </div>
      <div>
        <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">شماره تماس</label>
        <input
          type="tel"
          id="patientPhone"
          {...register("patientPhone")}
          inputMode="tel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm bg-input text-foreground p-2"
        />
        {errors.patientPhone && <p className="mt-2 text-sm text-red-600">{errors.patientPhone.message}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Booking..." : "Book Appointment"}
    </button>
  );
}
