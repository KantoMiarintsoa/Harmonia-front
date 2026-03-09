import emailjs from "@emailjs/browser"

/*
  ── EmailJS Configuration ──
  1. Go to https://www.emailjs.com/ and create a free account
  2. Add an Email Service (Gmail) → copy the Service ID
  3. Create an Email Template with these variables:
       {{to_email}}   — recipient email
       {{code}}       — the 6-digit verification code
       {{app_name}}   — "Harmonia"
     Example template subject: "{{app_name}} — Your verification code"
     Example template body:    "Your verification code is: {{code}}"
  4. Copy the Template ID and Public Key below
*/

const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? ""
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ""
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? ""

export function isEmailConfigured(): boolean {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
}

export async function sendResetCodeEmail(toEmail: string, code: string): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn("[Harmonia] EmailJS not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.local")
    return false
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: toEmail,
        code,
        app_name: "Harmonia",
      },
      EMAILJS_PUBLIC_KEY,
    )
    return true
  } catch (err) {
    console.error("[Harmonia] Failed to send email:", err)
    return false
  }
}
