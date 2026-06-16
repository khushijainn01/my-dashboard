export const STORAGE_KEYS = {
  theme: "theme",
  isAuthenticated: "isAuthenticated",
  rememberMe: "rememberMe",
  username: "username",
  userPassword: "userPassword",
  profileImage: "profileImage",
  siteName: "siteName",
  companyName: "companyName",
  emailNotifications: "emailNotifications",
  systemAlerts: "systemAlerts",
} as const

function getStorage(persistent: boolean): Storage {
  return persistent ? localStorage : sessionStorage
}

export function readStorage(key: string, persistent = true): string | null {
  return getStorage(persistent).getItem(key) ?? localStorage.getItem(key)
}

export function writeStorage(
  key: string,
  value: string,
  persistent = true
): void {
  getStorage(persistent).setItem(key, value)
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

export function readBoolean(key: string, fallback: boolean): boolean {
  const value = localStorage.getItem(key)
  if (value === null) return fallback
  return value === "true"
}

export function writeBoolean(key: string, value: boolean): void {
  localStorage.setItem(key, value ? "true" : "false")
}
