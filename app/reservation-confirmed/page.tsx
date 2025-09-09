"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, Users, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

interface ReservationDetails {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  reservation_date: string
  reservation_time: string
  special_requests?: string
  status: string
}

export default function ReservationConfirmedPage() {
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = searchParams.get("id")

  useEffect(() => {
    if (!reservationId) {
      router.push("/reservations")
      return
    }

    fetchReservationDetails()
  }, [reservationId, router])

  const fetchReservationDetails = async () => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`)
      if (response.ok) {
        const data = await response.json()
        setReservation(data)
      } else {
        router.push("/reservations")
      }
    } catch (error) {
      console.error("Error fetching reservation:", error)
      router.push("/reservations")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600">Reservation not found</p>
            <Button asChild className="mt-4">
              <Link href="/reservations">Make New Reservation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Reservation Confirmed!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Thank you for choosing Bella Vista Restaurant
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Reservation Details</CardTitle>
            <CardDescription>Confirmation ID: #{reservation.id.slice(-8).toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">{formatDate(reservation.reservation_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="font-medium text-gray-900">Time</p>
                  <p className="text-gray-600">{formatTime(reservation.reservation_time)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="font-medium text-gray-900">Party Size</p>
                  <p className="text-gray-600">
                    {reservation.party_size} {reservation.party_size === 1 ? "guest" : "guests"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">{reservation.customer_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">{reservation.customer_email}</p>
                </div>
              </div>

              {reservation.special_requests && (
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5">
                    <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Special Requests</p>
                    <p className="text-gray-600">{reservation.special_requests}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">
                    Bella Vista Restaurant
                    <br />
                    123 Culinary Street
                    <br />
                    Foodie District, FD 12345
                    <br />
                    (555) 123-4567
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-rose-800 font-medium mb-2">Important Notes:</p>
              <ul className="text-sm text-rose-700 space-y-1">
                <li>• Please arrive 10 minutes before your reservation time</li>
                <li>• Cancellations must be made at least 2 hours in advance</li>
                <li>• For parties of 6 or more, a 18% gratuity will be added</li>
                <li>• We hold tables for 15 minutes past reservation time</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button asChild className="flex-1 bg-rose-600 hover:bg-rose-700">
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
