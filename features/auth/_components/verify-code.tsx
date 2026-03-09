"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, ArrowLeft, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getResetEmail, verifyResetCode, generateResetCode } from "@/lib/auth"
import { sendResetCodeEmail } from "@/lib/email"
import { useI18n } from "@/contexts/i18n-context"

export default function VerifyCode() {
  const router = useRouter()
  const { t } = useI18n()
  const l = t.auth.verifyCode

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [info, setInfo] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const email = getResetEmail()

  useEffect(() => {
    if (!email) router.replace("/unauthenticated/forgot-password")
  }, [email, router])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    setError(null)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(""))
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const code = digits.join("")
    if (code.length < 6) { setError(l.errFill); return }
    if (!email) return

    setLoading(true)
    const valid = verifyResetCode(email, code)
    if (!valid) { setError(l.errInvalid); setLoading(false); return }

    router.push("/unauthenticated/reset-password")
  }

  const handleResend = async () => {
    if (!email || resending) return
    setResending(true)
    setError(null)
    const code = generateResetCode(email)
    const sent = await sendResetCodeEmail(email, code)
    setResending(false)
    setDigits(["", "", "", "", "", ""])
    if (sent) {
      setInfo(l.resent)
      setTimeout(() => setInfo(null), 5000)
    } else {
      setError(l.resentFailed)
    }
  }

  if (!email) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <Card className="bg-white dark:bg-gray-800 w-[420px] rounded-2xl shadow-2xl p-8 border-0">

        <div className="text-center mb-6">
          <h2 className="text-purple-600 dark:text-purple-400 font-semibold tracking-wide">{t.auth.brand}</h2>
        </div>

        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
            <KeyRound className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{l.subtitle(email)}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {info && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400">{info}</p>
            </div>
          )}

          {/* 6-digit code inputs */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            ))}
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white flex items-center justify-center rounded-md text-sm font-medium transition-colors">
            {loading ? l.submitting : l.submit}
          </button>

          <div className="text-center">
            <button type="button" onClick={handleResend} disabled={resending}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50">
              {resending ? l.resending : l.resend}
            </button>
          </div>
        </form>

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
