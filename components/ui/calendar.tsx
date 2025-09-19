"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = {
  onSelect?: (date: Date) => void
  selected?: Date
  className?: string
}

function Calendar({ onSelect, selected, className }: CalendarProps) {
  const today = new Date()
  const fromDate = new Date(today)
  fromDate.setDate(today.getDate() + 1) // start from tomorrow
  const toDate = new Date(today)
  toDate.setDate(today.getDate() + 30) // 30 days ahead

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(date) => {
        if (date) {
          onSelect?.(date)
          // Close calendar automatically by dispatching blur event
          document.activeElement instanceof HTMLElement && document.activeElement.blur()
        }
      }}
      fromDate={fromDate}
      toDate={toDate}
      showOutsideDays={false}
      className={cn("p-3 w-full max-w-sm bg-white rounded-md shadow", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
