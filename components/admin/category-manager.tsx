"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, FolderOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuCategory {
  id: string
  name: string
  description: string
  display_order: number
  item_count?: number
}

interface CategoryManagerProps {
  isOpen: boolean
  onClose: () => void
  onCategoryChange: () => void
}

export function CategoryManager({ isOpen, onClose, onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [buttonLoading, setButtonLoading] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/menu-categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const actionKey = editingCategory ? `edit-${editingCategory.id}` : "add"
    setButtonLoading({ ...buttonLoading, [actionKey]: true })

    try {
      const url = editingCategory ? `/api/admin/menu-categories/${editingCategory.id}` : "/api/admin/menu-categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCategories()
        onCategoryChange()
        resetForm()
      }
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setButtonLoading({ ...buttonLoading, [actionKey]: false })
    }
  }

  const deleteCategory = async (category: MenuCategory) => {
    if (
      !confirm(
        `Are you sure you want to delete "${category.name}"? This will delete ALL menu items in this category and cannot be undone.`,
      )
    ) {
      return
    }

    const deleteKey = `delete-${category.id}`
    setButtonLoading({ ...buttonLoading, [deleteKey]: true })

    try {
      const response = await fetch(`/api/admin/menu-categories/${category.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCategories()
        onCategoryChange()
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    } finally {
      setButtonLoading({ ...buttonLoading, [deleteKey]: false })
    }
  }

  const startEdit = (category: MenuCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
    })
    setIsAddingCategory(true)
  }

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setEditingCategory(null)
    setIsAddingCategory(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Category Management
          </DialogTitle>
          <DialogDescription>
            Manage menu categories. Each category creates its own table in the database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add/Edit Category Form */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold mb-4">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Appetizers, Main Courses"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Input
                    id="categoryDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={buttonLoading[editingCategory ? `edit-${editingCategory.id}` : "add"]}>
                  {buttonLoading[editingCategory ? `edit-${editingCategory.id}` : "add"] ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      {editingCategory ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {editingCategory ? "Update Category" : "Create Category"}
                    </>
                  )}
                </Button>
                {(editingCategory || isAddingCategory) && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Categories Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Items Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No categories found. Create your first category above.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <TableCell>
                        <div className="font-medium">{category.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{category.description || "No description"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.item_count || 0} items</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(category)}
                            className="hover:shadow-md transition-all duration-200"
                            disabled={Object.values(buttonLoading).some(Boolean)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCategory(category)}
                            className="text-red-600 hover:text-red-700 hover:shadow-md transition-all duration-200"
                            disabled={buttonLoading[`delete-${category.id}`]}
                          >
                            {buttonLoading[`delete-${category.id}`] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
