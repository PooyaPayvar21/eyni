'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { JalaliDateTimePicker } from './jalali-datetime-picker';

interface BulkSlotCreationProps {
  doctorId: number;
  onCreateSlots: (slots: { datetime: string }[]) => Promise<void>;
}

export function BulkSlotCreationDialog({ doctorId, onCreateSlots }: BulkSlotCreationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleCreateSlots = async () => {
    if (!selectedDate) return;

    const baseDate = new Date(selectedDate);
    const slots: { datetime: string }[] = [];
    
    // Create slots every 5 minutes from 10 AM to 5 PM
    const startHour = 10;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const slotTime = new Date(baseDate);
        slotTime.setHours(hour, minute, 0, 0);
        slots.push({ datetime: slotTime.toISOString() });
      }
    }

    await onCreateSlots(slots);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        ایجاد زمان‌های خودکار
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ایجاد زمان‌های خودکار</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <JalaliDateTimePicker
                label="تاریخ"
                onChange={setSelectedDate}
                doctorId={doctorId}
                dateOnly
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              زمان‌های نوبت هر ۵ دقیقه از ساعت ۱۰ صبح تا ۵ عصر ایجاد خواهند شد.
            </div>

            <Button onClick={handleCreateSlots} className="w-full">
              ایجاد زمان‌ها
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
