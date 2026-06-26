"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateRangeFilterProps = {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
};

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);
  const range: DateRange | undefined = from || to ? { from, to } : undefined;

  const label =
    from && to
      ? `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`
      : from
        ? `From ${format(from, "MMM d, yyyy")}`
        : "Custom range";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Last 7 days", days: 7 },
          { label: "Last 30 days", days: 30 },
          { label: "This year", days: null as number | null },
          { label: "All time", days: -1 },
        ].map((preset) => (
          <Button
            key={preset.label}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (preset.days === -1) {
                onChange({});
                return;
              }
              const toDate = new Date();
              const fromDate = new Date();
              if (preset.days) {
                fromDate.setDate(fromDate.getDate() - preset.days);
              } else {
                fromDate.setMonth(0, 1);
              }
              onChange({ from: fromDate, to: toDate });
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !from && !to && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {from || to ? label : "Pick a date range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(next) => {
              onChange({ from: next?.from, to: next?.to });
              if (next?.from && next?.to) setOpen(false);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
