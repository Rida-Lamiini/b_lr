"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid email or password.")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-background/80">
      {/* Decorative grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(90deg, var(--color-border) 1px, transparent 1px), linear-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/15 border border-primary/20 mb-4">
            <Icons.Brain size={24} weight="bold" className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your Brain/Locus system</p>
        </div>

        {/* Main card */}
        <Card className="border-border/60">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-lg">Access Your System</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">Email Address</Label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                    <Icons.Envelope size={16} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                    <Icons.Lock size={16} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <Icons.EyeSlash size={16} /> : <Icons.Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <Icons.WarningCircle size={16} className="text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-9 gap-2" 
                disabled={loading}
                size="default"
              >
                {loading ? (
                  <>
                    <Icons.Spinner size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Icons.SignIn size={16} />
                    Sign In
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-card text-muted-foreground">New to Brain?</span>
                </div>
              </div>

              {/* Sign up link */}
              <Button 
                variant="outline" 
                className="w-full h-9 gap-2"
                asChild
              >
                <a href="/setup">
                  <Icons.Plus size={16} />
                  Create your account
                </a>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>Your personal operating system for cognitive productivity</p>
          <p className="pt-2">
            <a href="#" className="underline-animated text-muted-foreground hover:text-foreground transition-colors">
              Learn more about Brain/Locus
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
