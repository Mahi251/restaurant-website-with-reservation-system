import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Bella Vista Restaurant - Authentic Italian Cuisine",
  description:
    "Experience authentic Italian cuisine in an elegant atmosphere. Reserve your table today at Bella Vista Restaurant in downtown.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Header />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          }
        >
          <main className="min-h-screen">{children}</main>
        </Suspense>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
