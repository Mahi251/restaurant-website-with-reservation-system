import { ReservationForm } from "@/components/reservation-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Make a Reservation - Bella Vista Restaurant",
  description: "Reserve your table at Bella Vista Restaurant. Easy online booking for authentic Italian dining.",
}

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Make a Reservation</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Reserve your table for an unforgettable dining experience. We'll send you a confirmation code to verify
              your booking.
            </p>
          </div>
        </div>
      </header>

      {/* Reservation Form */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <ReservationForm />
          </div>

          {/* Restaurant Info */}
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Restaurant Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Thursday</span>
                  <span className="font-medium">5:00 PM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Friday - Saturday</span>
                  <span className="font-medium">5:00 PM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">4:00 PM - 9:00 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground block">Phone</span>
                  <span className="font-medium">(555) 123-4567</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Email</span>
                  <span className="font-medium">info@bellavista.com</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Address</span>
                  <span className="font-medium">
                    123 Main Street
                    <br />
                    Downtown, NY 10001
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Reservation Policy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Reservations can be made up to 30 days in advance</li>
                <li>• Maximum party size is 12 guests</li>
                <li>• Please arrive within 15 minutes of your reservation time</li>
                <li>• Cancellations must be made at least 2 hours in advance</li>
              </ul>
            </div>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/menu">View Our Menu</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
