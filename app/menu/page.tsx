import { createClient } from "@/lib/supabase/server"
import { MenuDisplay } from "@/components/menu-display"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Menu - Bella Vista Restaurant",
  description: "Explore our authentic Italian menu featuring fresh pasta, premium steaks, and traditional desserts.",
}

async function getMenuData() {
  const supabase = await createClient()

  // Fetch categories with their menu items
  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select(`
      *,
      menu_items (*)
    `)
    .eq("is_active", true)
    .order("display_order")

  if (categoriesError) {
    console.error("Error fetching menu categories:", categoriesError)
    return []
  }

  // Sort menu items within each category
  const sortedCategories =
    categories?.map((category) => ({
      ...category,
      menu_items:
        category.menu_items
          ?.filter((item: any) => item.is_available)
          ?.sort((a: any, b: any) => a.display_order - b.display_order) || [],
    })) || []

  return sortedCategories
}

export default async function MenuPage() {
  const menuData = await getMenuData()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-balance">Our Menu</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Authentic Italian cuisine crafted with the finest ingredients
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/reservations">Make a Reservation</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <MenuDisplay categories={menuData} />
      </main>

      {/* CTA Section */}
      <section className="bg-card py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Ready to Experience These Flavors?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Reserve your table today and let our chef create an unforgettable dining experience for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/reservations">Make a Reservation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
