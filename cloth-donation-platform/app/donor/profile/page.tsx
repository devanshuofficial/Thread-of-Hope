"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { User, Mail, Phone, MapPin, Edit, Save, X, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DonorProfilePage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your profile has been updated successfully.",
        })
        setIsEditing(false)
        // Optionally refresh user data
        window.location.reload()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error updating profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
    setIsEditing(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-emerald-500 hover:bg-emerald-600">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
              <Badge className="mt-2 bg-emerald-500 hover:bg-emerald-600">Donor</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user.name || "Not provided"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone || "Not provided"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Member Since</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your address"
                rows={3}
              />
            ) : (
              <div className="flex items-start gap-2 p-2 border rounded-md bg-gray-50">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>{user.address || "Not provided"}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Your donation activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 border rounded-lg bg-emerald-50">
              <div className="text-2xl font-bold text-emerald-600">Donor</div>
              <p className="text-sm text-muted-foreground mt-1">Account Type</p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <p className="text-sm text-muted-foreground mt-1">Account Status</p>
            </div>
            <div className="p-4 border rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{user.id?.slice(-6) || "N/A"}</div>
              <p className="text-sm text-muted-foreground mt-1">User ID</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

