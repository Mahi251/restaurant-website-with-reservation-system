"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  allergens: string[]
  dietary_info: string[]
  is_featured: boolean
}

interface MenuCategory {
  id: string
  name: string
  description: string
  menu_items: MenuItem[]
}

interface MenuDisplayProps {
  categories: MenuCategory[]
  isLoading?: boolean
}

export function MenuDisplay({ categories, isLoading = false }: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = selectedCategory
    ? categories.filter((category) => category.id === selectedCategory)
    : categories

  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Category Filter Skeleton */}
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Menu Items Skeleton */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {/* Menu Categories */}
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <section key={category.id} className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">{category.name}</h2>
              {category.description && (
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {category.menu_items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.menu_items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No items available in this category.</p>
            )}
          </section>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Menu items are being updated. Please check back soon!</p>
        </div>
      )}
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 shadow-md hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground text-balance">{item.name}</h3>
              {item.is_featured && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-4 text-pretty leading-relaxed">{item.description}</p>

            {/* Dietary Info and Allergens */}
            <div className="flex flex-wrap gap-2 mb-3">
              {item.dietary_info?.map((info) => (
                <Badge key={info} variant="outline" className="text-xs bg-muted">
                  {info}
                </Badge>
              ))}
            </div>

            {item.allergens && item.allergens.length > 0 && (
              <p className="text-xs text-muted-foreground">Contains: {item.allergens.join(", ")}</p>
            )}
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
          </div>
        </div>

        {item.image_url && (
          <div className="mt-4 aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
