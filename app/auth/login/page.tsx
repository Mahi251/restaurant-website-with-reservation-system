"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ChefHat } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSecretReset, setShowSecretReset] = useState(false)
  const [secretCode, setSecretCode] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (data.success) {
        // Store admin session
        localStorage.setItem(
          "admin_session",
          JSON.stringify({
            username: data.username,
            loginTime: Date.now(),
          }),
        )
        router.push("/admin")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecretReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/auth/reset-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secretCode,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Reset failed")
      }

      setSuccess("Admin credentials updated successfully!")
      setShowSecretReset(false)
      setSecretCode("")
      setNewUsername("")
      setNewPassword("")

      // Update the username field if it was changed
      if (newUsername) {
        setUsername(newUsername)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Reset failed")
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
            {!showSecretReset ? (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="genet@ithiopica.eatery"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    onClick={() => setShowSecretReset(true)}
                  >
                    Reset Username/Password
                  </Button>
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleSecretReset} className="space-y-4">
                  <div>
                    <Label htmlFor="secretCode">Secret Code</Label>
                    <Input
                      id="secretCode"
                      type="password"
                      placeholder="Enter secret reset code"
                      required
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      className="border-secondary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUsername">New Username (optional)</Label>
                    <Input
                      id="newUsername"
                      type="text"
                      placeholder="Leave empty to keep current"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="border-secondary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password (optional)</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Leave empty to keep current"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isResetting}>
                      {isResetting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Credentials"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowSecretReset(false)
                        setError(null)
                        setSuccess(null)
                      }}
                      className="border-secondary/20 text-secondary hover:bg-secondary/5"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </>
            )}

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
