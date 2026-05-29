"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Save,
  Key,
  Trash2,
  Download,
  Upload
} from "lucide-react"
import { useState } from "react"

export default function NGOSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    requestUpdates: true,
    inventoryAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
    smsNotifications: false
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showContactInfo: true,
    showRequestHistory: false,
    allowDirectMessages: true,
    dataSharing: false
  })

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    itemsPerPage: "20",
    theme: "system"
  })

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    console.log("Settings saved:", { notifications, privacy, preferences })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-emerald-500 hover:bg-emerald-600">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure how you receive email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailNotifications: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Request Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when your requests are approved or shipped</p>
                </div>
                <Switch
                  checked={notifications.requestUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, requestUpdates: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new items matching your criteria are available</p>
                </div>
                <Switch
                  checked={notifications.inventoryAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, inventoryAlerts: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly summary reports of your activity</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, weeklyReports: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and platform news</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, marketingEmails: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
              <CardDescription>Configure SMS notifications for urgent updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive urgent notifications via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, smsNotifications: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Profile Visibility
              </CardTitle>
              <CardDescription>Control who can see your organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="verified">Verified NGOs only</SelectItem>
                    <SelectItem value="private">Private - Only you can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Contact Information</Label>
                  <p className="text-sm text-muted-foreground">Display your contact details on your profile</p>
                </div>
                <Switch
                  checked={privacy.showContactInfo}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, showContactInfo: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Request History</Label>
                  <p className="text-sm text-muted-foreground">Display your request history on your profile</p>
                </div>
                <Switch
                  checked={privacy.showRequestHistory}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, showRequestHistory: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Direct Messages</Label>
                  <p className="text-sm text-muted-foreground">Allow other users to send you direct messages</p>
                </div>
                <Switch
                  checked={privacy.allowDirectMessages}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, allowDirectMessages: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymized data to be used for platform improvements</p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, dataSharing: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>Set your language and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({...preferences, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences({...preferences, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize how content is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Items Per Page</Label>
                <Select
                  value={preferences.itemsPerPage}
                  onValueChange={(value) => setPreferences({...preferences, itemsPerPage: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({...preferences, theme: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your account data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground">Download a copy of your account data</p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
