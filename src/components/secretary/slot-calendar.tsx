"use client";

import { Card, Calendar, Badge, ConfigProvider, theme } from "antd";
import { type AvailabilitySlot } from "@/types";
import dayjs from "dayjs";
import jalaliday from "jalali-dayjs";
import locale from "antd/es/calendar/locale/fa_IR";
import { useTheme } from "next-themes";

dayjs.extend(jalaliday);

interface SlotCalendarProps {
  slots: AvailabilitySlot[];
  selectedDate: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs) => void;
}

export function SlotCalendar({ slots, selectedDate, onDateChange }: SlotCalendarProps) {
  const getDateCellData = (date: dayjs.Dayjs) => {
    const daySlots = slots.filter(s => dayjs(s.datetime).isSame(date, 'day'));
    const bookedCount = daySlots.filter(s => s.isBooked).length;
    const availableCount = daySlots.filter(s => !s.isBooked).length;

    if (daySlots.length === 0) return null;

    return {
      type: 'success',
      content: (
        <div>
          <Badge status="success" text={`${availableCount} خالی`} />
          <br />
          <Badge status="warning" text={`${bookedCount} رزرو شده`} />
        </div>
      ),
    };
  };

  const { theme: currentTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Card title="تقویم نوبت‌ها">
        <Calendar
          fullscreen={false}
          value={selectedDate}
          onChange={onDateChange}
          locale={locale}
          cellRender={(date, info) => {
            if (info.type === 'date') {
              const data = getDateCellData(date);
              return data?.content;
            }
            return info.originNode;
          }}
        />
      </Card>
    </ConfigProvider>
  );
}
