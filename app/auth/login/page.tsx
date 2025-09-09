"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ChefHat } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (email !== "genet@ithiopica.eatery") {
        throw new Error("Access denied. Only authorized admin can login.")
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
        },
      })
      if (error) throw error
      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    if (email !== "genet@ithiopica.eatery") {
      setError("Password reset is only available for authorized admin")
      return
    }

    setIsResetting(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()

      // Call the custom function to handle password reset
      const { data, error } = await supabase.rpc("send_admin_password_reset", {
        user_email: email,
      })

      if (error) throw error

      if (data?.error) {
        throw new Error(data.error)
      }

      setSuccess(`Password reset instructions have been sent to ${data.notification_email}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to send reset email")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-secondary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-secondary">Admin Login</CardTitle>
            <CardDescription className="text-gray-600">Sign in to access the restaurant dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="genet@ithiopica.eatery"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-secondary/20 focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-secondary/20 focus:border-primary"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-primary/20 bg-primary/5">
                  <AlertDescription className="text-primary">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-secondary/20 text-secondary hover:bg-secondary/5 bg-transparent"
                onClick={handlePasswordReset}
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending reset email...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">Authorized admin access only</div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to restaurant
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
