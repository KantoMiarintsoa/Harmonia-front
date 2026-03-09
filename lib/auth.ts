export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface Session {
  userId: string
  email: string
  name: string
}

const USERS_KEY   = "harmonia_users"
const SESSION_KEY = "harmonia_session"
const PREFILL_KEY = "harmonia_login_prefill"

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | null {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function createUser(name: string, email: string, password: string): User {
  const users = getUsers()
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, user])
  return user
}

export function validateCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email)
  if (!user || user.password !== password) return null
  return user
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(user: User): void {
  const session: Session = { userId: user.id, email: user.email, name: user.name }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

/** Save credentials so login page can pre-fill after register */
export function savePrefill(email: string, password: string): void {
  localStorage.setItem(PREFILL_KEY, JSON.stringify({ email, password }))
}

/** Read and immediately clear the prefill */
export function consumePrefill(): { email: string; password: string } | null {
  try {
    const raw = localStorage.getItem(PREFILL_KEY)
    if (!raw) return null
    localStorage.removeItem(PREFILL_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/* ── Password reset flow ── */

const RESET_KEY = "harmonia_reset_code"

interface ResetData {
  email: string
  code: string
  expiresAt: number
}

/** Generate a 6-digit code, store it with 10-min expiry, return the code */
export function generateResetCode(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const data: ResetData = { email, code, expiresAt: Date.now() + 10 * 60 * 1000 }
  localStorage.setItem(RESET_KEY, JSON.stringify(data))
  return code
}

/** Verify the code matches and is not expired */
export function verifyResetCode(email: string, code: string): boolean {
  try {
    const raw = localStorage.getItem(RESET_KEY)
    if (!raw) return false
    const data: ResetData = JSON.parse(raw)
    return data.email.toLowerCase() === email.toLowerCase()
      && data.code === code
      && Date.now() < data.expiresAt
  } catch {
    return false
  }
}

/** Update the user's password and clear the reset code */
export function resetPassword(email: string, newPassword: string): boolean {
  const users = getUsers()
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return false
  users[idx].password = newPassword
  saveUsers(users)
  localStorage.removeItem(RESET_KEY)
  return true
}

/** Store email for the reset flow navigation */
export function saveResetEmail(email: string): void {
  localStorage.setItem("harmonia_reset_email", email)
}

export function getResetEmail(): string | null {
  return localStorage.getItem("harmonia_reset_email")
}

export function clearResetEmail(): void {
  localStorage.removeItem("harmonia_reset_email")
}
