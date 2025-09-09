import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const featuredItems = [
  {
    name: "Bruschetta Trio",
    description: "Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella",
    price: "$14.99",
    image: "/bruschetta-with-tomatoes-and-basil-on-rustic-bread.jpg",
  },
  {
    name: "Lobster Ravioli",
    description: "House-made ravioli filled with lobster in a creamy tomato sauce",
    price: "$32.99",
    image: "/elegant-lobster-ravioli-in-creamy-sauce.jpg",
  },
  {
    name: "Ribeye Steak",
    description: "12oz prime ribeye with garlic mashed potatoes and asparagus",
    price: "$42.99",
    image: "/perfectly-grilled-ribeye-steak-with-vegetables.jpg",
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: "$9.99",
    image: "/tiramisu.png",
  },
]

export function FeaturedMenu() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Featured Dishes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Discover our chef's signature creations, crafted with the finest ingredients and traditional Italian
            techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredItems.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-foreground text-balance">{item.name}</h3>
                  <span className="text-lg font-bold text-primary">{item.price}</span>
                </div>
                <p className="text-muted-foreground text-pretty leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
            <Link href="/menu">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
