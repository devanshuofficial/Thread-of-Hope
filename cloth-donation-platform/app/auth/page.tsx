"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package2, ArrowLeft } from 'lucide-react'

function AuthContent() {
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(
    modeParam === 'signup' ? 'signup' : 'login'
  )

  useEffect(() => {
    if (modeParam === 'signup') {
      setAuthMode('signup')
    } else if (modeParam === 'login') {
      setAuthMode('login')
    }
  }, [modeParam])

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package2 className="h-12 w-12 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">ClothConnect AI</h1>
          </div>
          <p className="text-gray-600">
            {authMode === 'login' 
              ? 'Welcome back! Sign in to continue making a difference.' 
              : 'Join our platform to start donating or distributing clothes to those in need.'
            }
          </p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {authMode === 'signup' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAuthMode('login')}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="text-2xl font-bold flex-1 text-center">
                {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              {authMode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Create your account and choose your role'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authMode === 'login' ? <LoginForm /> : <SignupForm />}
            
            {/* Toggle Button */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                {authMode === 'login' 
                  ? "Don't have an account?" 
                  : "Already have an account?"
                }
              </p>
              <Button 
                variant="outline" 
                onClick={toggleAuthMode}
                className="w-full"
              >
                {authMode === 'login' ? 'Create Account' : 'Sign In Instead'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
