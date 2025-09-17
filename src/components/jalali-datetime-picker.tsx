/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { cn } from "@/lib/utils";

// Load DatePicker and TimePicker only on client to avoid SSR issues
// Using a more permissive type to accommodate the library's actual props
const DatePicker = dynamic(() => import("react-multi-date-picker"), {
  ssr: false,
}) as React.ComponentType<{
  calendar: typeof persian;
  locale: typeof persian_fa;
  value?: unknown;
  onChange?: (value: unknown) => void;
  format?: string;
  disabled?: boolean;
  calendarPosition?: string;
  className?: string;
  inputClass?: string;
  placeholder?: string;
}>;

interface Props {
  label?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  doctorId?: number;
  availableDates?: Date[];
  disabled?: boolean;
  dateOnly?: boolean;
}

export function JalaliDateTimePicker({
  label = "زمان نوبت",
  onChange,
  defaultValue,
  doctorId,
  availableDates = [],
  disabled = false,
  dateOnly = false,
}: Props) {
  type DateObject = { toDate: () => Date };
  const [dateValue, setDateValue] = useState<DateObject | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIso, setSelectedIso] = useState<string>("");

  useEffect(() => {
    const fetchSlots = async () => {
      if (!dateValue?.toDate) {
        setSlots([]);
        return;
      }
      const jsDate: Date = dateValue.toDate();
      const yyyy = jsDate.getFullYear();
      const mm = String(jsDate.getMonth() + 1).padStart(2, "0");
      const dd = String(jsDate.getDate()).padStart(2, "0");
      const dateParam = `${yyyy}-${mm}-${dd}`;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/doctors/${doctorId}/availability?date=${dateParam}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setSlots(Array.isArray(data?.slots) ? data.slots : []);
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [doctorId, dateValue]);

  const timeLabel = (iso: string) => {
    try {
      const d = new Date(iso);
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        format="YYYY/MM/DD"
        value={dateValue}
        onChange={(v: unknown) => {
          setDateValue(v as DateObject | null);
          setSelectedIso("");
          onChange("");
        }}
        className="w-full"
        inputClass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm bg-input text-foreground p-2"
        placeholder="تاریخ را انتخاب کنید"
      />
      <div className="mt-3 min-h-10">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            در حال بارگذاری زمان‌های خالی...
          </p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            برای تاریخ انتخاب‌شده زمانی موجود نیست.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((iso) => (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  setSelectedIso(iso);
                  onChange(iso);
                }}
                className={`px-3 py-1.5 rounded-lg cursor-pointer focus:bg-[#AEDCEA] border text-sm ${
                  selectedIso === iso
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {timeLabel(iso)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
