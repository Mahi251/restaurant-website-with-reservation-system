"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Users, Clock, Star } from "lucide-react"

interface AnalyticsData {
  totalReservations: number
  totalGuests: number
  avgPartySize: number
  peakHours: { hour: string; count: number }[]
  popularDays: { day: string; count: number }[]
  recentReservations: {
    id: string
    customer_name: string
    party_size: number
    reservation_date: string
    status: string
  }[]
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Unable to load analytics data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-gray-600">Restaurant performance insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalReservations}</div>
            <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalGuests}</div>
            <p className="text-xs text-muted-foreground">Avg {analytics.avgPartySize.toFixed(1)} per reservation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.peakHours[0]?.hour || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              Busiest hour ({analytics.peakHours[0]?.count || 0} reservations)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Hours
            </CardTitle>
            <CardDescription>Most popular reservation times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.peakHours.slice(0, 5).map((hour, index) => (
                <div key={hour.hour} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{hour.hour}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-600 h-2 rounded-full"
                        style={{
                          width: `${(hour.count / analytics.peakHours[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{hour.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Popular Days
            </CardTitle>
            <CardDescription>Busiest days of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularDays.slice(0, 7).map((day, index) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{day.day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-600 h-2 rounded-full"
                        style={{
                          width: `${(day.count / analytics.popularDays[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reservations</CardTitle>
          <CardDescription>Latest booking activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentReservations.slice(0, 5).map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium">{reservation.customer_name}</p>
                    <p className="text-sm text-gray-600">
                      {reservation.party_size} guests • {new Date(reservation.reservation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    reservation.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {reservation.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
