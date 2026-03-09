"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getResetEmail, resetPassword, clearResetEmail, savePrefill } from "@/lib/auth"
import { useI18n } from "@/contexts/i18n-context"

const inputClass = "w-full h-11 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"

export default function ResetPassword() {
  const router = useRouter()
  const { t } = useI18n()
  const l = t.auth.resetPassword

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const email = getResetEmail()

  useEffect(() => {
    if (!email) router.replace("/unauthenticated/forgot-password")
  }, [email, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!password || !confirm) { setError(l.errFill); return }
    if (password.length < 6) { setError(l.errShortPwd); return }
    if (password !== confirm) { setError(l.errMismatch); return }
    if (!email) return

    setLoading(true)
    const ok = resetPassword(email, password)
    if (ok) {
      savePrefill(email, password)
      clearResetEmail()
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push("/unauthenticated/login"), 2000)
    }
  }

  if (!email) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <Card className="bg-white dark:bg-gray-800 w-[380px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 dark:text-purple-400 font-semibold tracking-wide">{t.auth.brand}</h2>
        </div>

        {success ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.success}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t.auth.login.submitting}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <Lock className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="mb-6 text-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{l.subtitle}</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} placeholder={l.newPassword}
                  value={password} onChange={e => { setPassword(e.target.value); setError(null) }}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} placeholder={l.confirmPassword}
                  value={confirm} onChange={e => { setConfirm(e.target.value); setError(null) }}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white flex items-center justify-center rounded-md text-sm font-medium transition-colors">
                {loading ? l.submitting : l.submit}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6">
          <Link href="/unauthenticated/login" className="inline-flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline">
            <ArrowLeft className="h-3 w-3" />
            {t.auth.forgotPassword.backToLogin}
          </Link>
        </div>

      </Card>
    </div>
  )
}
