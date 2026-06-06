"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'PROCUREMENT_OFFICER' | 'VENDOR'
  phone?: string | null
  status: string
  companyName?: string | null
  gstNumber?: string | null
  website?: string | null
  department?: string | null
  isVerified: boolean
  vendor?: any | null
}

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (data: any) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const body = await res.json()
        if (body.success && body.data?.user) {
          setCurrentUser(body.data.user)
          // Sync with legacy localStorage keys for existing pages
          const dbRole = body.data.user.role
          const uiRole = dbRole === 'PROCUREMENT_OFFICER' ? 'procurement' : dbRole.toLowerCase()
          localStorage.setItem("vb_role", uiRole)
          localStorage.setItem("vb_email", body.data.user.email)
          localStorage.setItem("vb_is_logged", "true")
          if (body.data.user.companyName) {
            localStorage.setItem("vb_user_profile", JSON.stringify(body.data.user))
          }
        } else {
          setCurrentUser(null)
          clearLegacyStorage()
        }
      } else {
        setCurrentUser(null)
        clearLegacyStorage()
      }
    } catch (err) {
      console.error('Session restore error:', err)
      setCurrentUser(null)
      clearLegacyStorage()
    } finally {
      setLoading(false)
    }
  }

  const clearLegacyStorage = () => {
    localStorage.removeItem("vb_role")
    localStorage.removeItem("vb_email")
    localStorage.removeItem("vb_is_logged")
    localStorage.removeItem("vb_user_profile")
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body = await res.json()
      if (res.ok && body.success) {
        setCurrentUser(body.data.user)
        const dbRole = body.data.user.role
        const uiRole = dbRole === 'PROCUREMENT_OFFICER' ? 'procurement' : dbRole.toLowerCase()
        localStorage.setItem("vb_role", uiRole)
        localStorage.setItem("vb_email", body.data.user.email)
        localStorage.setItem("vb_is_logged", "true")
        return { success: true }
      } else {
        return { success: false, error: body.message || 'Login failed' }
      }
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout API error:', err)
    } finally {
      setCurrentUser(null)
      clearLegacyStorage()
      router.push('/login')
    }
  }

  const register = async (data: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json()
      if (res.ok && body.success) {
        setCurrentUser(body.data.user)
        const dbRole = body.data.user.role
        const uiRole = dbRole === 'PROCUREMENT_OFFICER' ? 'procurement' : dbRole.toLowerCase()
        localStorage.setItem("vb_role", uiRole)
        localStorage.setItem("vb_email", body.data.user.email)
        localStorage.setItem("vb_is_logged", "true")
        return { success: true }
      } else {
        return { success: false, error: body.message || 'Registration failed' }
      }
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
