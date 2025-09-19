"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Clock, Save } from "lucide-react"

export function AdminSettings() {
  const { toast } = useToast()

  const handleSaveInformation = () => {
    // Simulate API call
    toast({
      variant: "success",
      title: "Success",
      description: "Restaurant information saved successfully",
    })
  }

  const handleSaveHours = () => {
    // Simulate API call
    toast({
      variant: "success",
      title: "Success",
      description: "Operating hours saved successfully",
    })
  }

  const handleSaveSettings = () => {
    // Simulate API call
    toast({
      variant: "success",
      title: "Success",
      description: "Reservation settings saved successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Restaurant Settings</h3>
        <p className="text-gray-600">Manage your restaurant configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Restaurant Information
            </CardTitle>
            <CardDescription>Basic restaurant details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input id="restaurant-name" defaultValue="Bella Vista Restaurant" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="(555) 123-4567" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" defaultValue="123 Culinary Street, Foodie District, FD 12345" rows={2} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue="An upscale casual dining experience featuring contemporary cuisine with a focus on fresh, locally-sourced ingredients."
                rows={3}
              />
            </div>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSaveInformation}>
              <Save className="h-4 w-4 mr-2" />
              Save Information
            </Button>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
            <CardDescription>Set your restaurant's operating schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <div key={day} className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20">
                    <Label>{day}</Label>
                  </div>
                  <Switch defaultChecked={day !== "Monday"} />
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue="11:00" className="w-32" disabled={day === "Monday"} />
                    <span className="text-gray-500">to</span>
                    <Input type="time" defaultValue="22:00" className="w-32" disabled={day === "Monday"} />
                  </div>
                </div>
              </div>
            ))}
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSaveHours}>
              <Save className="h-4 w-4 mr-2" />
              Save Hours
            </Button>
          </CardContent>
        </Card>

        {/* Reservation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Reservation Settings</CardTitle>
            <CardDescription>Configure reservation policies and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max-party-size">Maximum Party Size</Label>
                <Input id="max-party-size" type="number" defaultValue="12" />
              </div>
              <div>
                <Label htmlFor="advance-booking">Advance Booking (days)</Label>
                <Input id="advance-booking" type="number" defaultValue="30" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-notice">Minimum Notice (hours)</Label>
                <Input id="min-notice" type="number" defaultValue="2" />
              </div>
              <div>
                <Label htmlFor="table-hold">Table Hold Time (minutes)</Label>
                <Input id="table-hold" type="number" defaultValue="15" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Phone Verification</Label>
                  <p className="text-sm text-gray-600">Send OTP codes for reservation confirmation</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Online Cancellation</Label>
                  <p className="text-sm text-gray-600">Let customers cancel reservations online</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Send Confirmation Emails</Label>
                  <p className="text-sm text-gray-600">Email confirmation after successful booking</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
