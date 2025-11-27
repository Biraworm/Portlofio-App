"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })

      if (response.data.accessToken) {
        // Salvar token no localStorage
        localStorage.setItem('auth_token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        toast.success("Logged in successfully!")
        router.push("/")
        router.refresh()
      } else {
        toast.error("No token received. Please try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to login. Please check your credentials."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/register', {
        email: email.trim(),
        password,
      })

      if (response.data.accessToken) {
        // Salvar token no localStorage
        localStorage.setItem('auth_token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        toast.success("Account created successfully!")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Account created but no token received. Please login.")
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to create account. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Portfolio App</CardTitle>
          <CardDescription>
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            className="space-y-4"
            onSubmit={isSignUp ? handleSignUp : handleLogin}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setEmail("")
                  setPassword("")
                }}
                disabled={isLoading}
                className="flex-1"
              >
                {isSignUp ? "Back to Login" : "Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
