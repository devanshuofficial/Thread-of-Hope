"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Clock, XCircle, Info, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Donation {
  _id: string
  type: string
  size: string
  condition: string
  description: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("http://localhost:5000/api/cloth/my-donations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDonations(data)
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const recentDonations = donations.slice(0, 3)

  const aiUpdates = [
    {
      id: "AI001",
      message: "AI verification complete for recent donations. Items are being categorized automatically.",
      type: "info",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStats = () => {
    return {
      total: donations.length,
      pending: donations.filter((d) => d.status === "pending").length,
      approved: donations.filter((d) => d.status === "approved").length,
    }
  }

  const stats = getStats()

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <XCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Donor Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully verified</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Overview of your latest cloth donations.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No donations yet. Start making a difference today!</p>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                <Link href="/donor/donate">Make Your First Donation</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 font-semibold">Item Type</th>
                      <th className="p-2 font-semibold">Size</th>
                      <th className="p-2 font-semibold">Condition</th>
                      <th className="p-2 font-semibold">Status</th>
                      <th className="p-2 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDonations.map((donation) => (
                      <tr key={donation._id} className="border-b last:border-b-0">
                        <td className="p-2">{donation.type}</td>
                        <td className="p-2">{donation.size}</td>
                        <td className="p-2 capitalize">{donation.condition}</td>
                        <td className="p-2">{getStatusBadge(donation.status)}</td>
                        <td className="p-2">{formatDate(donation.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Button asChild variant="link">
                  <Link href="/donor/history">View All History</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Status Updates & Notifications</CardTitle>
          <CardDescription>Real-time updates on your donations from our AI system.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiUpdates.map((update) => (
            <div key={update.id} className="flex items-start gap-3 p-3 border rounded-md bg-gray-50">
              {getUpdateIcon(update.type)}
              <p className="text-sm text-gray-700 flex-1">{update.message}</p>
            </div>
          ))}
          {aiUpdates.length === 0 && <p className="text-sm text-gray-500">No new AI updates at the moment.</p>}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          asChild
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg font-semibold rounded-md shadow-lg"
        >
          <Link href="/donor/donate">Make a New Donation</Link>
        </Button>
      </div>
    </div>
  )
}
