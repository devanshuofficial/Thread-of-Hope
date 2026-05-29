"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Phone, Mail, Calendar, Users, Award, Edit, Save, X } from "lucide-react"
import { useState } from "react"

export default function NGOProfile() {
  const [isEditing, setIsEditing] = useState(false)
  
  const [profileData, setProfileData] = useState({
    organizationName: "Hope Foundation",
    registrationNumber: "NGO-2023-001",
    email: "contact@hopefoundation.org",
    phone: "+1 (555) 123-4567",
    address: "123 Community Street, City, State 12345",
    website: "https://hopefoundation.org",
    establishedDate: "2020-01-15",
    mission: "To provide essential clothing and support to underserved communities, helping families maintain dignity and warmth through difficult times.",
    focusAreas: ["Homeless Support", "Family Assistance", "Emergency Relief"],
    teamSize: "15-20 volunteers",
    serviceArea: "Metropolitan area and surrounding counties",
    description: "Hope Foundation has been serving the community for over 4 years, providing clothing assistance to over 2,000 families. We work closely with local shelters, schools, and community centers to identify families in need.",
    verificationStatus: "Verified",
    rating: 4.8,
    totalRequests: 156,
    successfulDeliveries: 142
  })

  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Profile</h1>
          <p className="text-muted-foreground">Manage your NGO profile information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-logo.png" alt="Organization Logo" />
                  <AvatarFallback>
                    <Building2 className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profileData.organizationName}</CardTitle>
              <CardDescription>
                <Badge className="bg-green-500 hover:bg-green-600">
                  {profileData.verificationStatus}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{profileData.rating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{profileData.totalRequests}</div>
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{profileData.successfulDeliveries}</div>
                  <div className="text-xs text-muted-foreground">Deliveries</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Established</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(profileData.establishedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Team Size</div>
                  <div className="text-xs text-muted-foreground">{profileData.teamSize}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Success Rate</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((profileData.successfulDeliveries / profileData.totalRequests) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your organization's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={profileData.organizationName}
                    onChange={(e) => setProfileData({...profileData, organizationName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input
                    id="regNumber"
                    value={profileData.registrationNumber}
                    onChange={(e) => setProfileData({...profileData, registrationNumber: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={profileData.mission}
                  onChange={(e) => setProfileData({...profileData, mission: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Organization Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How people can reach your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isEditing}
                    className="pl-9"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                  disabled={!isEditing}
                  placeholder="https://your-website.org"
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Additional information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Area</Label>
                  <Input
                    id="serviceArea"
                    value={profileData.serviceArea}
                    onChange={(e) => setProfileData({...profileData, serviceArea: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    value={profileData.teamSize}
                    onChange={(e) => setProfileData({...profileData, teamSize: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Focus Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="text-sm text-muted-foreground">
                    Focus areas can be updated through your organization settings.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
