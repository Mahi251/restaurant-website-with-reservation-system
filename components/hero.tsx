import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-card to-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/elegant-restaurant-interior-with-warm-lighting-and.jpg"
          alt="Ithiopica Coffee & Eatery Interior"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">Ithiopica Coffee & Eatery</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
          Experience authentic Italian cuisine in an elegant atmosphere. Where every meal is a celebration of flavor and
          tradition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/reservations">Make a Reservation</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
            <Link href="/menu">View Our Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
