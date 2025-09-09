"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Trash2, Search, Filter, Calendar, Clock, Users, Phone, Mail } from "lucide-react"

interface Reservation {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  reservation_date: string
  reservation_time: string
  status: string
  special_requests?: string
  created_at: string
  confirmed_at?: string
}

export function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchReservations()
      }
    } catch (error) {
      console.error("Error updating reservation:", error)
    }
  }

  const deleteReservation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchReservations()
      }
    } catch (error) {
      console.error("Error deleting reservation:", error)
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customer_phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Management</CardTitle>
        <CardDescription>View and manage all restaurant reservations</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reservations Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading reservations...
                  </TableCell>
                </TableRow>
              ) : filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No reservations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.customer_name}</div>
                        <div className="text-sm text-gray-500">{reservation.customer_email}</div>
                        <div className="text-sm text-gray-500">{reservation.customer_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>{formatDate(reservation.reservation_date)}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(reservation.reservation_time)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        {reservation.party_size}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(reservation.status)}>{reservation.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReservation(reservation)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Reservation Details</DialogTitle>
                              <DialogDescription>ID: #{reservation.id.slice(-8).toUpperCase()}</DialogDescription>
                            </DialogHeader>
                            {selectedReservation && (
                              <div className="space-y-4">
                                <div className="grid gap-3">
                                  <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-rose-600" />
                                    <div>
                                      <p className="font-medium">{selectedReservation.customer_name}</p>
                                      <p className="text-sm text-gray-600">{selectedReservation.party_size} guests</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-rose-600" />
                                    <div>
                                      <p className="font-medium">{formatDate(selectedReservation.reservation_date)}</p>
                                      <p className="text-sm text-gray-600">
                                        {formatTime(selectedReservation.reservation_time)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-rose-600" />
                                    <p className="text-sm">{selectedReservation.customer_phone}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-rose-600" />
                                    <p className="text-sm">{selectedReservation.customer_email}</p>
                                  </div>
                                  {selectedReservation.special_requests && (
                                    <div className="flex items-start gap-3">
                                      <div className="w-4 h-4 mt-0.5">
                                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Special Requests</p>
                                        <p className="text-sm text-gray-600">{selectedReservation.special_requests}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 pt-4">
                                  {selectedReservation.status === "pending" && (
                                    <Button
                                      onClick={() => updateReservationStatus(selectedReservation.id, "confirmed")}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                  {selectedReservation.status === "confirmed" && (
                                    <Button
                                      onClick={() => updateReservationStatus(selectedReservation.id, "completed")}
                                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                      Mark Complete
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() => updateReservationStatus(selectedReservation.id, "cancelled")}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
