import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Restaurant Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Ithiopica Coffee & Eatery</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              Authentic Italian cuisine in the heart of downtown. Experience the finest flavors and warmest hospitality.
            </p>
            <div className="space-y-2 text-white/80">
              <p>123 Main Street, Downtown, NY 10001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@bellavista.com</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <div className="space-y-2 text-white/80 text-sm">
              <div className="flex justify-between">
                <span>Mon - Thu</span>
                <span>5:00 PM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri - Sat</span>
                <span>5:00 PM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>4:00 PM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/menu" className="block text-white/80 hover:text-white transition-colors">
                Menu
              </Link>
              <Link href="/reservations" className="block text-white/80 hover:text-white transition-colors">
                Reservations
              </Link>
              <Link href="/about" className="block text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60">
          <p>&copy; 2024 Ithiopica Coffee & Eatery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
