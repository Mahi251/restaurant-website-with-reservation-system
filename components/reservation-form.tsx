"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, Clock, Users } from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"

interface ReservationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  partySize: number
  reservationDate: Date | null
  reservationTime: string
  specialRequests: string
}

const timeSlots = [
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
]

const partySizes = Array.from({ length: 12 }, (_, i) => i + 1)

export function ReservationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isTimeOpen, setIsTimeOpen] = useState(false)
  const [isPartySizeOpen, setIsPartySizeOpen] = useState(false)
  const [formData, setFormData] = useState<ReservationData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    partySize: 2,
    reservationDate: null,
    reservationTime: "",
    specialRequests: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation checks
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (!formData.reservationDate || !formData.reservationTime) {
      setError("Please select a date and time for your reservation")
      setIsLoading(false)
      return
    }

    if (isBefore(formData.reservationDate, startOfDay(new Date()))) {
      setError("Please select a future date")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          party_size: formData.partySize,
          reservation_date: format(formData.reservationDate, "yyyy-MM-dd"),
          reservation_time: formData.reservationTime,
          special_requests: formData.specialRequests,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create reservation")
      }

      router.push(`/reservation-confirmed?id=${result.reservation.id}`)
    } catch (error) {
      console.error("Reservation error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: keyof ReservationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Booking window: tomorrow → +30 days
  const startDate = startOfDay(addDays(new Date(), 1))
  const endDate = addDays(startDate, 29)

  // Close calendar immediately on date select
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    updateFormData("reservationDate", date)
    setIsCalendarOpen(false)
  }

  const handleCustomDateSelect = (date: Date) => {
    updateFormData("reservationDate", date)
    setIsCalendarOpen(false)
  }

  const handleTimeSelect = (time: string) => {
    updateFormData("reservationTime", time)
    setIsTimeOpen(false)
  }

  const handlePartySizeSelect = (size: number) => {
    updateFormData("partySize", size)
    setIsPartySizeOpen(false)
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Reservation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.customerName}
                onChange={(e) => updateFormData("customerName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.customerEmail}
                onChange={(e) => updateFormData("customerEmail", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.customerPhone}
                onChange={(e) => updateFormData("customerPhone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="party-size">Party Size *</Label>
              <Dialog open={isPartySizeOpen} onOpenChange={setIsPartySizeOpen}>
                <DialogTrigger asChild>
                  <Button
                    id="party-size"
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {formData.partySize} {formData.partySize === 1 ? "Guest" : "Guests"}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Select Party Size</h2>
                    <p className="text-sm text-muted-foreground">Choose the number of guests</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-4 max-h-[300px] overflow-y-auto">
                    {partySizes.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={formData.partySize === size ? "default" : "outline"}
                        onClick={() => handlePartySizeSelect(size)}
                        className="h-12"
                      >
                        {size} {size === 1 ? "Guest" : "Guests"}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Reservation Date *</Label>
              <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <DialogTrigger asChild>
                  <Button
                    id="date"
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.reservationDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.reservationDate ? format(formData.reservationDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg p-0">
                  <CustomCalendar selected={formData.reservationDate || undefined} onSelect={handleCustomDateSelect} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time">Reservation Time *</Label>
              <Dialog open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                <DialogTrigger asChild>
                  <Button
                    id="time"
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.reservationTime && "text-muted-foreground",
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {formData.reservationTime ? formData.reservationTime : <span>Select time</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Select a Time</h2>
                    <p className="text-sm text-muted-foreground">Choose your preferred reservation time</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-4 max-h-[300px] overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.reservationTime === time ? "default" : "outline"}
                        onClick={() => handleTimeSelect(time)}
                        className="h-12"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests (Optional)</Label>
            <Textarea
              id="requests"
              placeholder="Any dietary restrictions, special occasions, or seating preferences..."
              value={formData.specialRequests}
              onChange={(e) => updateFormData("specialRequests", e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                Creating Reservation...
              </div>
            ) : (
              "Create Reservation"
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            You'll receive a verification code via email to confirm your reservation.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
