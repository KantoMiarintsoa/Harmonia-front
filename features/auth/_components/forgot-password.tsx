"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { findUserByEmail, generateResetCode, saveResetEmail } from "@/lib/auth"
import { useI18n } from "@/contexts/i18n-context"

const inputClass = "w-full h-11 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"

export default function ForgotPassword() {
  const router = useRouter()
  const { t } = useI18n()
  const l = t.auth.forgotPassword

  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) { setError(l.errFill); return }

    setLoading(true)
    const user = findUserByEmail(email)
    if (!user) { setError(l.errNoAccount); setLoading(false); return }

    const code = generateResetCode(email)
    saveResetEmail(email)
    setCodeSent(code)
    setLoading(false)
  }

  const goToVerify = () => {
    router.push("/unauthenticated/verify-code")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <Card className="bg-white dark:bg-gray-800 w-[380px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 dark:text-purple-400 font-semibold tracking-wide">{t.auth.brand}</h2>
        </div>

        {!codeSent ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <Mail className="h-7 w-7 text-purple-600 dark:text-purple-400" />
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

              <input
                type="email" placeholder={l.emailPlaceholder}
                value={email} onChange={e => { setEmail(e.target.value); setError(null) }}
                className={inputClass}
              />

              <button type="submit" disabled={loading}
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white flex items-center justify-center rounded-md text-sm font-medium transition-colors">
                {loading ? l.submitting : l.submit}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="mb-6 text-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.codeSentTitle}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{l.codeSentMsg(codeSent)}</p>
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-xl border border-purple-200 dark:border-purple-800">
                <p className="text-3xl font-mono font-bold text-purple-600 dark:text-purple-400 tracking-[0.3em]">{codeSent}</p>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3">
                {t.auth.brand} — Simulation (no real email)
              </p>
            </div>

            <button onClick={goToVerify}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center rounded-md text-sm font-medium transition-colors">
              {t.auth.verifyCode.submit}
            </button>
          </>
        )}

        <div className="text-center mt-6">
          <Link href="/unauthenticated/login" className="inline-flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline">
            <ArrowLeft className="h-3 w-3" />
            {l.backToLogin}
          </Link>
        </div>

      </Card>
    </div>
  )
}
