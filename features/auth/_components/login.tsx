"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Apple, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { validateCredentials, setSession, getSession, findUserByEmail, consumePrefill } from "@/lib/auth"

function Login() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (getSession()) router.replace("/protected/dashboard")
  }, [router])

  // Pre-fill credentials coming from register
  useEffect(() => {
    const prefill = consumePrefill()
    if (prefill) {
      setEmail(prefill.email)
      setPassword(prefill.password)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)

    // Check if account exists
    const existing = findUserByEmail(email)
    if (!existing) {
      setError("No account found with this email. Please sign up first.")
      setLoading(false)
      return
    }

    // Validate password
    const user = validateCredentials(email, password)
    if (!user) {
      setError("Incorrect password. Please try again.")
      setLoading(false)
      return
    }

    setSession(user)
    router.push("/protected/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">

      <Card className="bg-white w-[380px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide">HARMONIA</h2>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Please enter your login credentials</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null) }}
            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null) }}
              className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-right text-xs text-purple-600 cursor-pointer">Forgot password?</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white flex items-center justify-center rounded-md text-sm font-medium transition-colors"
          >
            {loading ? "Signing in…" : "Login"}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </button>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Apple className="w-4 h-4 text-gray-700" />
            Sign in with Apple ID
          </button>

        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/unauthenticated/register" className="text-purple-600 cursor-pointer hover:underline">
            Sign up
          </Link>
        </div>

      </Card>
    </div>
  )
}

export default Login
