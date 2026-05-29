"use client"

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Building2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function NGOPendingPage() {
  const { user, checkNGStatus } = useAuth()

  useEffect(() => {
    // Check NGO status periodically
    const interval = setInterval(() => {
      checkNGStatus()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [checkNGStatus])

  if (!user || user.role !== 'ngo') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Account Pending Approval
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Thank you for registering your NGO! We're currently reviewing your application.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* NGO Info */}
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                Organization Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Organization:</span>
                  <span className="ml-2 text-gray-900">{user.ngoName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Contact Person:</span>
                  <span className="ml-2 text-gray-900">{user.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                {user.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Our admin team will review your organization details</li>
                    <li>• We may contact you for additional verification</li>
                    <li>• You'll receive an email notification once approved</li>
                    <li>• After approval, you'll have full access to the NGO portal</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg p-6 border">
              <h4 className="font-semibold text-gray-900 mb-4">Application Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Application Submitted</p>
                    <p className="text-sm text-gray-500">Your NGO registration has been received</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-500">Currently being reviewed by our team</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-500">Approved</p>
                    <p className="text-sm text-gray-400">Access to NGO portal granted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                Check Status
              </Button>
              
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Have questions? Contact us at support@clothconnect.ai</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
