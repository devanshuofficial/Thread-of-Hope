"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { Loader2, User, Building2 } from 'lucide-react'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [activeTab, setActiveTab] = useState('donor')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signupDonor, signupNGO } = useAuth()

  // Donor form state
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })

  // NGO form state
  const [ngoData, setNgoData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ngoName: '',
    ngoDescription: '',
    ngoAddress: '',
    ngoPhone: '',
    ngoWebsite: '',
    phone: '',
    address: ''
  })

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (donorData.password !== donorData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await signupDonor({
        name: donorData.name,
        email: donorData.email,
        password: donorData.password,
        phone: donorData.phone || undefined,
        address: donorData.address || undefined
      })
      setSuccess('Donor account created successfully!')
      // Call onSuccess after a short delay to show success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNGOSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (ngoData.password !== ngoData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await signupNGO({
        name: ngoData.name,
        email: ngoData.email,
        password: ngoData.password,
        ngoName: ngoData.ngoName,
        ngoDescription: ngoData.ngoDescription,
        ngoAddress: ngoData.ngoAddress,
        ngoPhone: ngoData.ngoPhone,
        ngoWebsite: ngoData.ngoWebsite || undefined,
        phone: ngoData.phone || undefined,
        address: ngoData.address || undefined
      })
      setSuccess('NGO account created successfully! Your account is pending approval.')
      // Call onSuccess after a short delay to show success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donor" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Donor
            </TabsTrigger>
            <TabsTrigger value="ngo" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              NGO
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="donor" className="mt-6">
            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-name">Full Name</Label>
                  <Input
                    id="donor-name"
                    placeholder="Enter your full name"
                    value={donorData.name}
                    onChange={(e) => setDonorData({...donorData, name: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-email">Email</Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="Enter your email"
                    value={donorData.email}
                    onChange={(e) => setDonorData({...donorData, email: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-password">Password</Label>
                  <Input
                    id="donor-password"
                    type="password"
                    placeholder="Create a password"
                    value={donorData.password}
                    onChange={(e) => setDonorData({...donorData, password: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-confirm-password">Confirm Password</Label>
                  <Input
                    id="donor-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={donorData.confirmPassword}
                    onChange={(e) => setDonorData({...donorData, confirmPassword: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-phone">Phone (Optional)</Label>
                  <Input
                    id="donor-phone"
                    placeholder="Enter your phone number"
                    value={donorData.phone}
                    onChange={(e) => setDonorData({...donorData, phone: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-address">Address (Optional)</Label>
                  <Input
                    id="donor-address"
                    placeholder="Enter your address"
                    value={donorData.address}
                    onChange={(e) => setDonorData({...donorData, address: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Donor Account'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="ngo" className="mt-6">
            <form onSubmit={handleNGOSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ngo-name">Contact Person Name</Label>
                  <Input
                    id="ngo-name"
                    placeholder="Enter contact person name"
                    value={ngoData.name}
                    onChange={(e) => setNgoData({...ngoData, name: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-email">Email</Label>
                  <Input
                    id="ngo-email"
                    type="email"
                    placeholder="Enter your email"
                    value={ngoData.email}
                    onChange={(e) => setNgoData({...ngoData, email: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ngo-password">Password</Label>
                  <Input
                    id="ngo-password"
                    type="password"
                    placeholder="Create a password"
                    value={ngoData.password}
                    onChange={(e) => setNgoData({...ngoData, password: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-confirm-password">Confirm Password</Label>
                  <Input
                    id="ngo-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={ngoData.confirmPassword}
                    onChange={(e) => setNgoData({...ngoData, confirmPassword: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ngo-org-name">Organization Name</Label>
                <Input
                  id="ngo-org-name"
                  placeholder="Enter your organization name"
                  value={ngoData.ngoName}
                  onChange={(e) => setNgoData({...ngoData, ngoName: e.target.value})}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ngo-description">Organization Description</Label>
                <Textarea
                  id="ngo-description"
                  placeholder="Describe your organization and mission"
                  value={ngoData.ngoDescription}
                  onChange={(e) => setNgoData({...ngoData, ngoDescription: e.target.value})}
                  required
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ngo-org-address">Organization Address</Label>
                  <Input
                    id="ngo-org-address"
                    placeholder="Enter organization address"
                    value={ngoData.ngoAddress}
                    onChange={(e) => setNgoData({...ngoData, ngoAddress: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-org-phone">Organization Phone</Label>
                  <Input
                    id="ngo-org-phone"
                    placeholder="Enter organization phone"
                    value={ngoData.ngoPhone}
                    onChange={(e) => setNgoData({...ngoData, ngoPhone: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ngo-website">Website (Optional)</Label>
                  <Input
                    id="ngo-website"
                    type="url"
                    placeholder="Enter organization website"
                    value={ngoData.ngoWebsite}
                    onChange={(e) => setNgoData({...ngoData, ngoWebsite: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-contact-phone">Contact Phone (Optional)</Label>
                  <Input
                    id="ngo-contact-phone"
                    placeholder="Enter contact phone"
                    value={ngoData.phone}
                    onChange={(e) => setNgoData({...ngoData, phone: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ngo-contact-address">Contact Address (Optional)</Label>
                <Input
                  id="ngo-contact-address"
                  placeholder="Enter contact address"
                  value={ngoData.address}
                  onChange={(e) => setNgoData({...ngoData, address: e.target.value})}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create NGO Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
    </div>
  )
}
