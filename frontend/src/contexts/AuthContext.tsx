import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from "@/lib/storage"

const VALID_USERNAME = "khushijain"
const DEFAULT_PASSWORD = "12345"

interface AuthContextValue {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string, rememberMe: boolean) => boolean
  logout: () => void
  getPassword: () => string
  updatePassword: (password: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readAuthState(): boolean {
  return (
    localStorage.getItem(STORAGE_KEYS.isAuthenticated) === "true" ||
    sessionStorage.getItem(STORAGE_KEYS.isAuthenticated) === "true"
  )
}

function readUsername(): string | null {
  return (
    readStorage(STORAGE_KEYS.username, true) ??
    readStorage(STORAGE_KEYS.username, false)
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthState)
  const [username, setUsername] = useState<string | null>(readUsername)

  const login = useCallback(
    (inputUsername: string, password: string, rememberMe: boolean) => {
      const savedPassword =
        localStorage.getItem(STORAGE_KEYS.userPassword) ?? DEFAULT_PASSWORD

      if (inputUsername !== VALID_USERNAME || password !== savedPassword) {
        return false
      }

      writeStorage(STORAGE_KEYS.isAuthenticated, "true", rememberMe)
      writeStorage(STORAGE_KEYS.username, inputUsername, rememberMe)
      writeStorage(
        STORAGE_KEYS.rememberMe,
        rememberMe ? "true" : "false",
        rememberMe
      )

      if (!rememberMe) {
        localStorage.removeItem(STORAGE_KEYS.isAuthenticated)
        localStorage.removeItem(STORAGE_KEYS.username)
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated)
        sessionStorage.removeItem(STORAGE_KEYS.username)
      }

      setIsAuthenticated(true)
      setUsername(inputUsername)
      return true
    },
    []
  )

  const logout = useCallback(() => {
  removeStorage(STORAGE_KEYS.isAuthenticated)
  removeStorage(STORAGE_KEYS.username)

  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("sessionExpiry")

  setIsAuthenticated(false)
  setUsername(null)
}, [])

  const getPassword = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.userPassword) ?? DEFAULT_PASSWORD
  }, [])

  const updatePassword = useCallback((password: string) => {
    localStorage.setItem(STORAGE_KEYS.userPassword, password)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      username,
      login,
      logout,
      getPassword,
      updatePassword,
    }),
    [isAuthenticated, username, login, logout, getPassword, updatePassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
