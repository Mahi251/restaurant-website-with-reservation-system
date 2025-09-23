"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"

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

    // Validation
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

    // Check if date is not in the past
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

      // Redirect to OTP verification page
      router.push(`/reservations/verify?id=${result.reservation.id}`)
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

  // Calculate min and max dates (today to 30 days from now)
  const minDate = new Date()
  const maxDate = addDays(new Date(), 30)

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl">Reservation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Select
                value={formData.partySize.toString()}
                onValueChange={(value) => updateFormData("partySize", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select party size" />
                </SelectTrigger>
                <SelectContent>
                  {partySizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} {size === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reservation Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.reservationDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.reservationDate ? format(formData.reservationDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.reservationDate || undefined}
                    onSelect={(date) => updateFormData("reservationDate", date)}
                    disabled={(date) => isBefore(date, minDate) || date > maxDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Reservation Time *</Label>
              <Select
                value={formData.reservationTime}
                onValueChange={(value) => updateFormData("reservationTime", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
