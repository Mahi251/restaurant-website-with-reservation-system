import { Card, CardContent } from "./ui/card"

export function ReservationPolicy() {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Our Reservation Policy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">Booking Window</h3>
              <p className="text-muted-foreground">
                Reservations can be made up to 30 days in advance. We recommend booking early for weekends and special occasions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">Party Size</h3>
              <p className="text-muted-foreground">
                We accommodate parties of up to 12 guests through our online system. For larger groups, please contact us directly.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">Arrival Time</h3>
              <p className="text-muted-foreground">
                Please arrive within 15 minutes of your reservation time. Tables may be released after this grace period.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">Cancellations</h3>
              <p className="text-muted-foreground">
                Cancellations must be made at least 2 hours in advance. This helps us accommodate other guests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}