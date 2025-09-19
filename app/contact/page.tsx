import { ContactForm } from "@/components/contact-form"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Contact Form and Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Contact Form - Left Side */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
                <ContactForm />
              </div>

              {/* Google Maps - Right Side */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Find Us</h2>
                <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew%20York%2C%20NY%2010001%2C%20USA!5e0!3m2!1sen!2sus!4v1635959542742!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Rustica Restaurant Location"
                  />
                </div>
              </div>
            </div>

            {/* Visit Us Section - Bottom */}
            <div className="bg-muted rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Visit Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center space-y-3">
                  <MapPin className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Italian Street
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <Phone className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                    <p className="text-muted-foreground text-sm">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <Mail className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground text-sm">info@rustica.com</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <p>Mon-Thu: 5PM-10PM</p>
                      <p>Fri-Sat: 5PM-11PM</p>
                      <p>Sun: 4PM-9PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
