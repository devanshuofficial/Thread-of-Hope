"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'donor' | 'ngo' | 'admin'
  ngoStatus?: 'pending' | 'accepted' | 'rejected'
  ngoName?: string
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signupDonor: (data: SignupDonorData) => Promise<void>
  signupNGO: (data: SignupNGOData) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  canAccessDonorPortal: boolean
  canAccessNGOPortal: boolean
  checkNGStatus: () => Promise<void>
}

interface SignupDonorData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
}

interface SignupNGOData {
  name: string
  email: string
  password: string
  ngoName: string
  ngoDescription: string
  ngoAddress: string
  ngoPhone: string
  ngoWebsite?: string
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    // Check for existing token on app load
    const existingToken = localStorage.getItem('token')
    if (existingToken) {
      setToken(existingToken)
      fetchUserProfile(existingToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('token', data.token)
    } catch (error) {
      throw error
    }
  }

  const signupDonor = async (data: SignupDonorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/donor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Signup failed')
      }

      setToken(responseData.token)
      setUser(responseData.user)
      localStorage.setItem('token', responseData.token)
    } catch (error) {
      throw error
    }
  }

  const signupNGO = async (data: SignupNGOData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/ngo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Signup failed')
      }

      setToken(responseData.token)
      setUser(responseData.user)
      localStorage.setItem('token', responseData.token)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const checkNGStatus = async () => {
    if (!user || user.role !== 'ngo') return

    try {
      const response = await fetch(`${API_BASE_URL}/auth/ngo/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(prev => prev ? { ...prev, ngoStatus: data.ngoStatus } : null)
      }
    } catch (error) {
      console.error('Error checking NGO status:', error)
    }
  }

  const isAuthenticated = !!user && !!token
  const canAccessDonorPortal = user?.role === 'donor'
  const canAccessNGOPortal = user?.role === 'ngo' && user?.ngoStatus === 'accepted'

  const value: AuthContextType = {
    user,
    token,
    login,
    signupDonor,
    signupNGO,
    logout,
    isLoading,
    isAuthenticated,
    canAccessDonorPortal,
    canAccessNGOPortal,
    checkNGStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
