"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Apple, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { validateCredentials, setSession, getSession, findUserByEmail, consumePrefill } from "@/lib/auth"
import { useI18n } from "@/contexts/i18n-context"

const inputClass = "w-full h-11 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"

function Login() {
  const router = useRouter()
  const { t } = useI18n()
  const l = t.auth.login

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (getSession()) router.replace("/protected/dashboard")
  }, [router])

  useEffect(() => {
    const prefill = consumePrefill()
    if (prefill) { setEmail(prefill.email); setPassword(prefill.password) }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) { setError(l.errFill); return }
    setLoading(true)
    const existing = findUserByEmail(email)
    if (!existing) { setError(l.errNoAccount); setLoading(false); return }
    const user = validateCredentials(email, password)
    if (!user) { setError(l.errWrongPwd); setLoading(false); return }
    setSession(user)
    router.push("/protected/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <Card className="bg-white dark:bg-gray-800 w-[380px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 dark:text-purple-400 font-semibold tracking-wide">{t.auth.brand}</h2>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{l.welcome}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{l.subtitle}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <input
            type="email" placeholder="example@gmail.com"
            value={email} onChange={e => { setEmail(e.target.value); setError(null) }}
            className={inputClass}
          />

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"} placeholder="••••••••"
              value={password} onChange={e => { setPassword(e.target.value); setError(null) }}
              className={`${inputClass} pr-10`}
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-right text-xs text-purple-600 dark:text-purple-400 cursor-pointer">{l.forgotPassword}</div>

          <button type="submit" disabled={loading}
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white flex items-center justify-center rounded-md text-sm font-medium transition-colors">
            {loading ? l.submitting : l.submit}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>

          <button type="button"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            {l.googleLogin}
          </button>

          <button type="button"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
            <Apple className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            {l.appleLogin}
          </button>

        </form>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          {l.noAccount}{" "}
          <Link href="/unauthenticated/register" className="text-purple-600 dark:text-purple-400 hover:underline">{l.signUp}</Link>
        </div>

      </Card>
    </div>
  )
}

export default Login
