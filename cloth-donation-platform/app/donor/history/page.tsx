"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, XCircle, Package, Search, Calendar, Filter } from "lucide-react"
import Image from "next/image"
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

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  // Fetch donations from backend
  useEffect(() => {
    fetchDonations()
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchDonations, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filter donations based on search and status
  useEffect(() => {
    let filtered = donations

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((donation) => donation.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDonations(filtered)
  }, [donations, searchTerm, statusFilter])

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view your donations.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("http://localhost:5000/api/cloth/my-donations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDonations(data)
        setFilteredDonations(data)
      } else {
        throw new Error("Failed to fetch donations")
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast({
        title: "Error",
        description: "Failed to load donation history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStats = () => {
    return {
      total: donations.length,
      pending: donations.filter((d) => d.status === "pending").length,
      approved: donations.filter((d) => d.status === "approved").length,
      rejected: donations.filter((d) => d.status === "rejected").length,
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your donation history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Donation History</h1>
          <p className="text-muted-foreground mt-1">Track all your clothing donations in one place</p>
        </div>
        <Button onClick={fetchDonations} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Did not meet criteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by type, condition, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      {filteredDonations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No donations found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {donations.length === 0
                ? "You haven't made any donations yet. Start making a difference today!"
                : "No donations match your current filters. Try adjusting your search."}
            </p>
            {donations.length === 0 && (
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                <a href="/donor/donate">Make Your First Donation</a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDonations.map((donation) => (
            <Card key={donation._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100">
                {donation.imageUrl ? (
                  <Image
                    src={`http://localhost:5000${donation.imageUrl}`}
                    alt={donation.type}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">{getStatusBadge(donation.status)}</div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{donation.type}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  {formatDate(donation.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{donation.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-medium capitalize">{donation.condition}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs mb-1">Description:</p>
                    <p className="text-sm line-clamp-2">{donation.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredDonations.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredDonations.length} of {donations.length} donations
        </div>
      )}
    </div>
  )
}

