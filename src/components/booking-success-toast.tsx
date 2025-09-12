"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export function BookingSuccessToast() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 rounded-lg border bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200 p-3">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">نوبت با موفقیت ثبت شد</p>
          <p className="opacity-90">همکاران ما با شما تماس خواهند گرفت.</p>
        </div>
        <button className="ml-auto rounded-md p-1 hover:bg-black/5" onClick={() => setOpen(false)} aria-label="dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
