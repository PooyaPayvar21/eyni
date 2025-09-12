"use client";

import { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";

export function BookingSuccessToast() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 flex max-w-[300px] items-center gap-3 rounded-lg border bg-card p-4 shadow-lg animate-in slide-in-from-left-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <CheckCheck className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h5 className="font-medium">نوبت با موفقیت ثبت شد</h5>
        <p className="text-sm text-muted-foreground">پیامک تایید برای شما ارسال خواهد شد.</p>
      </div>
    </div>
  );
}
