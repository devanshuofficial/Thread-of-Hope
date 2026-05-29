"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, Clock, CheckCircle, XCircle, Eye, Plus, Package, Loader2 } from "lucide-react"
import Image from "next/image"

interface ClothItem {
  _id: string
  type: string
  size: string
  condition: string
  description: string
  imageUrl: string
  status: string
}

interface Request {
  _id: string
  ngoId: string
  clothId: ClothItem | string
  status: "pending" | "approved" | "rejected" | "fulfilled"
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export default function NGORequests() {
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("Please log in to view your requests")
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/requests/my-requests`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to fetch requests")
      }
    } catch (err) {
      console.error("Error fetching requests:", err)
      setError("Error loading requests. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-500 hover:bg-blue-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "fulfilled":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Fulfilled</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getConditionBadge = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Excellent</Badge>
      case "good":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Good</Badge>
      case "bad":
        return <Badge variant="destructive">Bad</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{condition || "N/A"}</Badge>
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

  // Filter requests based on search and status filter
  const getFilteredRequests = () => {
    let filtered = requests

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req => {
        const cloth = typeof req.clothId === 'object' ? req.clothId : null
        const searchLower = searchTerm.toLowerCase()
        return (
          req._id.toLowerCase().includes(searchLower) ||
          req.notes?.toLowerCase().includes(searchLower) ||
          req.adminNotes?.toLowerCase().includes(searchLower) ||
          cloth?.type.toLowerCase().includes(searchLower) ||
          cloth?.description.toLowerCase().includes(searchLower)
        )
      })
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    return filtered
  }

  // Get requests by status for tabs
  const getRequestsByStatus = (status: string) => {
    if (status === "all") return getFilteredRequests()
    return getFilteredRequests().filter(req => req.status === status)
  }

  const pendingRequests = requests.filter(req => req.status === "pending")
  const approvedRequests = requests.filter(req => req.status === "approved")
  const fulfilledRequests = requests.filter(req => req.status === "fulfilled")
  const rejectedRequests = requests.filter(req => req.status === "rejected")

  const renderRequestCard = (request: Request) => {
    const cloth = typeof request.clothId === 'object' ? request.clothId : null
    const clothId = typeof request.clothId === 'object' ? request.clothId._id : request.clothId

    return (
      <Card key={request._id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Request #{request._id.slice(-6).toUpperCase()}</CardTitle>
              <CardDescription>
                Submitted on {formatDate(request.createdAt)}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {getStatusBadge(request.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cloth ? (
            <>
              <div className="flex gap-4">
                {cloth.imageUrl && (
                  <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={`${API_BASE_URL.replace('/api', '')}${cloth.imageUrl}`}
                      alt={cloth.type}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-2 capitalize">{cloth.type}</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">Size: {cloth.size.toUpperCase()}</Badge>
                    {getConditionBadge(cloth.condition)}
                  </div>
                  {cloth.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{cloth.description}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-sm">Item details unavailable</span>
            </div>
          )}
          
          {request.notes && (
            <div>
              <h4 className="font-medium mb-1 text-sm">Your Notes:</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{request.notes}</p>
            </div>
          )}

          {request.adminNotes && (
            <div>
              <h4 className="font-medium mb-1 text-sm">Admin Notes:</h4>
              <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded border border-blue-200 dark:border-blue-800">
                {request.adminNotes}
              </p>
            </div>
          )}
          
          <div className="flex justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="font-medium">{formatDate(request.updatedAt)}</span>
          </div>
          
          <div className="flex gap-2 pt-2">
            {cloth && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/ngo/inventory/${clothId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Item
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    )
  }

  if (error && requests.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Requests</h1>
            <p className="text-muted-foreground">Track and manage your clothing requests</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Requests</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchRequests}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredRequests = getFilteredRequests()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">Track and manage your clothing requests</p>
        </div>
        <Button 
          className="bg-emerald-500 hover:bg-emerald-600"
          onClick={() => router.push("/ngo/inventory")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">{approvedRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Fulfilled</p>
                <p className="text-2xl font-bold">{fulfilledRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">{rejectedRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific requests or filter by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by request ID, notes, or item type..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled ({fulfilledRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "You haven't made any requests yet. Start by browsing the inventory."}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button onClick={() => router.push("/ngo/inventory")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Inventory
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredRequests.map(renderRequestCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {getRequestsByStatus("pending").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground text-center">You don't have any pending requests at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {getRequestsByStatus("pending").map(renderRequestCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {getRequestsByStatus("approved").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Approved Requests</h3>
                <p className="text-muted-foreground text-center">You don't have any approved requests at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {getRequestsByStatus("approved").map(renderRequestCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="fulfilled" className="space-y-4">
          {getRequestsByStatus("fulfilled").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Fulfilled Requests</h3>
                <p className="text-muted-foreground text-center">You don't have any fulfilled requests at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {getRequestsByStatus("fulfilled").map(renderRequestCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {getRequestsByStatus("rejected").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Rejected Requests</h3>
                <p className="text-muted-foreground text-center">You don't have any rejected requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {getRequestsByStatus("rejected").map(renderRequestCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
