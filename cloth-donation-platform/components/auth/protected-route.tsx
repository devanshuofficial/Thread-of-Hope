"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'donor' | 'ngo' | 'admin'
  requireApproval?: boolean // For NGOs that need approval
}

export function ProtectedRoute({ children, requiredRole, requireApproval = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, canAccessDonorPortal, canAccessNGOPortal } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (!isLoading && isAuthenticated && requiredRole) {
      // Check if user has the required role
      if (requiredRole === 'donor' && !canAccessDonorPortal) {
        router.push('/auth')
        return
      }

      if (requiredRole === 'ngo' && !canAccessNGOPortal) {
        if (user?.role === 'ngo' && user.ngoStatus === 'pending') {
          // NGO is pending approval, redirect to pending page
          router.push('/ngo/pending')
          return
        } else {
          // User doesn't have NGO access, redirect to auth
          router.push('/auth')
          return
        }
      }

      if (requiredRole === 'admin' && user?.role !== 'admin') {
        router.push('/auth')
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, canAccessDonorPortal, canAccessNGOPortal, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to auth page
  }

  if (requiredRole && !user) {
    return null // Will redirect to auth page
  }

  // Check role-based access
  if (requiredRole === 'donor' && !canAccessDonorPortal) {
    return null // Will redirect to auth page
  }

  if (requiredRole === 'ngo' && !canAccessNGOPortal) {
    if (user?.role === 'ngo' && user.ngoStatus === 'pending') {
      return null // Will redirect to pending page
    }
    return null // Will redirect to auth page
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return null // Will redirect to auth page
  }

  return <>{children}</>
}
