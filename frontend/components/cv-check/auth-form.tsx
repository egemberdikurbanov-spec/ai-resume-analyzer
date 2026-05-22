"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { register, login } from "@/lib/api"
import { cn } from "@/lib/utils"

// Custom logo URL
const customLogoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/acetone-2026520-16013-979%20%281%29-0nAx3Iqr392IwkaMtaRw7trnKYSAtR.png"

interface AuthFormProps {
  onAuth: (user: { email: string; name: string }) => void
  defaultTab?: "login" | "signup"
}

export function AuthForm({ onAuth, defaultTab = "signup" }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    name?: string
  }>({})
  
  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})
    
    try {
      if (isSignUp) {
        // Validate password length client-side
        if (password.length < 6) {
          setFieldErrors({ password: "Password must be at least 6 characters" })
          setIsLoading(false)
          return
        }
        
        const response = await register(name, email, password)
        onAuth({
          email: response.email,
          name: response.name,
        })
      } else {
        const response = await login(email, password)
        onAuth({
          email: response.email,
          name: response.name,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      
      // Map specific error messages to field errors
      if (errorMessage.includes("email already exists")) {
        setFieldErrors({ email: "An account with this email already exists" })
      } else if (errorMessage.includes("valid email")) {
        setFieldErrors({ email: "Must be a valid email" })
      } else if (errorMessage.includes("6 characters")) {
        setFieldErrors({ password: "Password must be at least 6 characters" })
      } else if (errorMessage.includes("Invalid email or password")) {
        setError("Invalid email or password")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleAuth = async () => {
    // Google OAuth not implemented in the backend
    // Show a message or disable this button
    setError("Google authentication is not available. Please use email and password.")
  }

  return (
    <div className="w-full max-w-md relative">
      {/* Background glow for auth form */}
      <div className="absolute -inset-10 bg-violet-600/20 rounded-full blur-[80px] animate-glow-pulse" />
      
      <Card className="relative shadow-2xl bg-card border-violet-500/20 bento-card">
        <CardHeader className="pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className="w-14 h-14 flex items-center justify-center"
              style={{
                filter: "drop-shadow(0 0 12px rgba(139, 92, 246, 0.9)) drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 50px rgba(139, 92, 246, 0.4))"
              }}
            >
              <img 
                src={customLogoUrl} 
                alt="CV Check Logo" 
                className="w-14 h-14 object-contain mix-blend-lighten"
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white text-glow">Welcome to CV Check</h2>
          <p className="text-sm text-white/60">
            Sign in to analyze your resume
          </p>
        </CardHeader>
        <CardContent>
          {/* General error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 border border-white/10">
              <TabsTrigger value="signup" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60">Sign Up</TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white/60">Log In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className={cn(
                      "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500",
                      fieldErrors.name && "border-red-500/50"
                    )}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-400">{fieldErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-white/80">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={cn(
                      "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500",
                      fieldErrors.email && "border-red-500/50"
                    )}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-white/80">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500",
                        fieldErrors.password && "border-red-500/50"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-white/40 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-red-400">{fieldErrors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-white/80">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={cn(
                      "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500",
                      error && "border-red-500/50"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="text-white/80">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-login"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500",
                        error && "border-red-500/50"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-white/40 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-white/40">Or continue with</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full border-white/10 text-white/80 hover:bg-white/5 hover:text-white hover:border-white/20"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          
          <p className="text-center text-xs text-white/40 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
