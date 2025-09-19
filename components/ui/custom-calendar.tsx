"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CustomCalendarProps = {
  onSelect?: (date: Date) => void
  selected?: Date
  className?: string
}

function CustomCalendar({ onSelect, selected, className }: CustomCalendarProps) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Calculate available dates (next 30 days excluding today)
  const availableDates: Date[] = []
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    availableDates.push(date)
  }

  // Group dates by month
  const datesByMonth = availableDates.reduce(
    (acc, date) => {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(date)
      return acc
    },
    {} as Record<string, Date[]>,
  )

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDateClick = (date: Date) => {
    onSelect?.(date)
  }

  const isDateSelected = (date: Date) => {
    if (!selected) return false
    return date.toDateString() === selected.toDateString()
  }

  const isDateAvailable = (date: Date) => {
    return availableDates.some((availableDate) => availableDate.toDateString() === date.toDateString())
  }

  const renderMonth = (monthKey: string, dates: Date[]) => {
    const firstDate = dates[0]
    const month = firstDate.getMonth()
    const year = firstDate.getFullYear()
    const monthName = monthNames[month]

    // Get all days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Create calendar grid
    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      calendarDays.push(date)
    }

    return (
      <div key={monthKey} className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            {monthName} {year}
          </h3>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-10" />
            }

            const isAvailable = isDateAvailable(date)
            const isSelected = isDateSelected(date)
            const isPast = date < today

            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-10 w-full p-0 font-normal transition-all duration-200",
                  isAvailable && !isSelected && "hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  !isAvailable && !isPast && "opacity-30 cursor-not-allowed text-muted-foreground",
                  isPast && "opacity-20 cursor-not-allowed text-muted-foreground",
                )}
                disabled={!isAvailable}
                onClick={() => isAvailable && handleDateClick(date)}
              >
                {date.getDate()}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-4 space-y-6 bg-background rounded-lg", className)}>
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold">Select Reservation Date</h2>
        <p className="text-sm text-muted-foreground">Available dates for the next 30 days (excluding today)</p>
      </div>

      <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2">
        {Object.entries(datesByMonth).map(([monthKey, dates]) => renderMonth(monthKey, dates))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-muted rounded opacity-30"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}

CustomCalendar.displayName = "CustomCalendar"

export { CustomCalendar }
