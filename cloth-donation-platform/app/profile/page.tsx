"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/contexts/auth-context'
import { User, Building2, Edit, Save, X, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ProfilePage() {
  const { user, token } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    ngoName: user?.ngoName || '',
    ngoDescription: user?.ngoDescription || '',
    ngoAddress: user?.ngoAddress || '',
    ngoPhone: user?.ngoPhone || '',
    ngoWebsite: user?.ngoWebsite || ''
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        ngoName: user.ngoName || '',
        ngoDescription: user.ngoDescription || '',
        ngoAddress: user.ngoAddress || '',
        ngoPhone: user.ngoPhone || '',
        ngoWebsite: user.ngoWebsite || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        }),
      })

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        ngoName: user.ngoName || '',
        ngoDescription: user.ngoDescription || '',
        ngoAddress: user.ngoAddress || '',
        ngoPhone: user.ngoPhone || '',
        ngoWebsite: user.ngoWebsite || ''
      })
    }
    setIsEditing(false)
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Approval</Badge>
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={loading}
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{user.address || 'Not provided'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {user.role === 'ngo' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  Account Details
                </CardTitle>
                <CardDescription>
                  Your role and account status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                      {user.role === 'ngo' ? (
                        <>
                          <Building2 className="h-3 w-3 mr-1" />
                          NGO
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Donor
                        </>
                      )}
                    </Badge>
                    {user.role === 'ngo' && getStatusBadge(user.ngoStatus)}
                  </div>
                </div>

                {user.role === 'ngo' && (
                  <>
                    <div className="space-y-2">
                      <Label>Organization Name</Label>
                      <p className="text-gray-900">{user.ngoName}</p>
                    </div>

                    {user.ngoStatus === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-yellow-900">Application Under Review</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Your NGO application is currently being reviewed by our admin team. 
                              You'll receive an email notification once approved.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {user.ngoStatus === 'accepted' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-green-900">Account Approved!</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Your NGO account has been approved. You now have full access to the NGO portal.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {user.ngoStatus === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-red-900">Application Rejected</h4>
                            <p className="text-sm text-red-700 mt-1">
                              Your NGO application was not approved. Please contact support for more information.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
