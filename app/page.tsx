import { Hero } from "@/components/hero"
import { FeaturedMenu } from "@/components/featured-menu"
import { About } from "@/components/about"
import { ReservationCTA } from "@/components/reservation-cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
      <About />
      <ReservationCTA />
    </>
  )
}
