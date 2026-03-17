"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const passwordsMatch = password === confirmPassword && password.length > 0
  const passwordStrength = password.length >= 8 ? (password.length >= 12 ? "strong" : "medium") : "weak"

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2)
    } else if (step === 2 && email.includes("@")) {
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        router.push("/login")
      } else {
        const data = await response.json()
        setError(data.error || "An error occurred during setup")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Initialize Your Brain</h1>
          <p className="text-sm text-muted-foreground">Set up your personal operating system</p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                step >= s
                  ? "bg-primary"
                  : "bg-border/50"
              )}
            />
          ))}
        </div>

        {/* Main card */}
        <Card className="border-border/60">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Name */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">What&apos;s your name?</h2>
                    <p className="text-sm text-muted-foreground mb-4">This helps personalize your Brain system</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide">Full Name</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-muted-foreground">
                        <Icons.User size={16} />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Alex Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9"
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Email */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Your email address</h2>
                    <p className="text-sm text-muted-foreground mb-4">We&apos;ll use this to secure your account</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">Email Address</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-muted-foreground">
                        <Icons.Envelope size={16} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Create a password</h2>
                    <p className="text-sm text-muted-foreground mb-4">Keep your system secure with a strong password</p>
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
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9"
                        autoFocus
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
                    {/* Password strength indicator */}
                    {password.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all",
                              i === 1 ? "bg-success" :
                              i === 2 && passwordStrength !== "weak" ? (passwordStrength === "strong" ? "bg-success" : "bg-warning") :
                              i === 3 && passwordStrength === "strong" ? "bg-success" :
                              "bg-border/30"
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {password.length === 0 ? "Minimum 8 characters" : 
                       password.length < 8 ? `${8 - password.length} more characters needed` :
                       passwordStrength === "strong" ? "Strong password ✓" :
                       "Good password"}
                    </p>
                  </div>

                  {/* Confirm password field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wide">Confirm Password</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-muted-foreground">
                        <Icons.Lock size={16} />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn(
                          "pl-9 pr-9",
                          confirmPassword && !passwordsMatch && "border-destructive/50"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <Icons.EyeSlash size={16} /> : <Icons.Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={cn(
                        "text-xs",
                        passwordsMatch ? "text-success" : "text-destructive"
                      )}>
                        {passwordsMatch ? "Passwords match ✓" : "Passwords do not match"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <Icons.WarningCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="h-9"
                  >
                    <Icons.CaretLeft size={16} />
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !name.trim()) ||
                      (step === 2 && !email.includes("@"))
                    }
                    className={cn(step > 1 ? "flex-1" : "w-full", "h-9 gap-2")}
                  >
                    Continue
                    <Icons.CaretRight size={16} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading || !passwordsMatch || password.length < 8}
                    className="flex-1 h-9 gap-2"
                  >
                    {loading ? (
                      <>
                        <Icons.Spinner size={16} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <Icons.CheckCircle size={16} />
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Step indicator text */}
              <p className="text-center text-xs text-muted-foreground">
                Step {step} of 3
              </p>
            </form>

            {/* Bottom link */}
            {step === 1 && (
              <div className="mt-6 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors underline-animated">
                    Sign in instead
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Your data is secure and encrypted</p>
        </div>
      </div>
    </div>
  )
}
