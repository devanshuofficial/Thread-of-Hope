"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Lock, Bell, Mail, Shield, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DonorSettingsPage() {
  const { token, user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    donationUpdates: true,
    aiVerification: true,
    monthlyReport: false,
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your password has been changed successfully.",
        })
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error changing password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSave = () => {
    toast({
      title: "Saved!",
      description: "Your notification preferences have been updated.",
    })
    // In a real app, you would save these to the backend
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Account Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
              <Lock className="h-4 w-4 mr-2" />
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-600" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>Choose what updates you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="emailNotifications" className="text-base cursor-pointer">
                  Email Notifications
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="donationUpdates" className="text-base cursor-pointer">
                Donation Status Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your donation status changes
              </p>
            </div>
            <Switch
              id="donationUpdates"
              checked={notifications.donationUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, donationUpdates: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="aiVerification" className="text-base cursor-pointer">
                AI Verification Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about AI verification results
              </p>
            </div>
            <Switch
              id="aiVerification"
              checked={notifications.aiVerification}
              onCheckedChange={(checked) => setNotifications({ ...notifications, aiVerification: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="monthlyReport" className="text-base cursor-pointer">
                Monthly Impact Report
              </Label>
              <p className="text-sm text-muted-foreground">
                Get a monthly summary of your donations and their impact
              </p>
            </div>
            <Switch
              id="monthlyReport"
              checked={notifications.monthlyReport}
              onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
            />
          </div>

          <Button onClick={handleNotificationSave} className="bg-emerald-500 hover:bg-emerald-600">
            <Bell className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <CardTitle>Account Information</CardTitle>
          </div>
          <CardDescription>Your account details and security information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-muted-foreground mb-1">Account Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-muted-foreground mb-1">Account Type</p>
              <p className="font-medium">Donor Account</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-muted-foreground mb-1">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-muted-foreground mb-1">User ID</p>
              <p className="font-medium font-mono text-sm">{user?.id?.slice(-8) || "N/A"}</p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your account data is encrypted and stored securely. We never share your personal information with third parties.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Account deletion is currently disabled. Please contact support if you wish to delete your account.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

