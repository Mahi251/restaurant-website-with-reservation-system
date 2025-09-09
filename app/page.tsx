import { Hero } from "@/components/hero"
import { FeaturedMenu } from "@/components/featured-menu"
import { About } from "@/components/about"
import { ReservationCTA } from "@/components/reservation-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedMenu />
      <About />
      <ReservationCTA />
      <Footer />
    </main>
  )
}
