"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { findUserByEmail, createUser, getSession, savePrefill } from "@/lib/auth"

function Register() {
  const router = useRouter()
  const [name, setName]             = useState("")
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [confirm, setConfirm]       = useState("")
  const [showPwd, setShowPwd]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [loading, setLoading]       = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (getSession()) router.replace("/protected/dashboard")
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    // Check if account already exists
    if (findUserByEmail(email)) {
      setError("An account with this email already exists. Please sign in.")
      return
    }

    setLoading(true)
    createUser(name.trim(), email.trim(), password)
    savePrefill(email.trim(), password)
    router.push("/unauthenticated/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">

      <Card className="bg-white w-[380px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide">HARMONIA</h2>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Please fill in the information below</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => { setName(e.target.value); setError(null) }}
            className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />

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

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(null) }}
              className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {confirm && password && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2">
                {confirm === password
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  : <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                }
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-md text-sm font-medium transition-colors"
          >
            {loading ? "Creating account…" : "Sign Up"}
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
            Sign up with Google
          </button>

        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/unauthenticated/login" className="text-purple-600 cursor-pointer hover:underline">
            Sign in
          </Link>
        </div>

      </Card>
    </div>
  )
}

export default Register
