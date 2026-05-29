"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Package, Handshake, Search, Filter, Loader2, Eye, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface InventoryItem {
  _id: string
  type: string
  size: string
  condition: string
  description: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface Request {
  _id: string
  clothId: InventoryItem | string
  status: "pending" | "approved" | "rejected" | "fulfilled"
  createdAt: string
  updatedAt: string
}

interface DashboardStats {
  availableInventory: number
  pendingRequests: number
  totalFulfilledRequests: number
}

export default function NGODashboard() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    availableInventory: 0,
    pendingRequests: 0,
    totalFulfilledRequests: 0
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [requestingItemId, setRequestingItemId] = useState<string | null>(null)
  const [requestedItemIds, setRequestedItemIds] = useState<Set<string>>(new Set())

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const authToken = token || localStorage.getItem("token")
      
      if (!authToken) {
        console.error("No token found")
        setLoading(false)
        return
      }

      // Fetch inventory items and requests in parallel
      const [itemsResponse, requestsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/cloth/clothes`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
          }
        }),
        fetch(`${API_BASE_URL}/requests/my-requests`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
          }
        })
      ])

      if (itemsResponse.ok) {
        const data = await itemsResponse.json()
        // Filter to show only approved and pending items
        const availableItems = data.filter((item: InventoryItem) => 
          item.status === "approved" || item.status === "pending"
        )
        setInventoryItems(availableItems)
        setFilteredItems(availableItems)
        
        // Calculate stats
        const approvedCount = data.filter((item: InventoryItem) => item.status === "approved").length
        setStats(prev => ({ ...prev, availableInventory: approvedCount }))
      } else {
        console.error("Failed to fetch inventory items")
      }

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        const requestsList = requestsData.requests || []
        setRequests(requestsList)
        
        // Calculate request stats
        const pendingCount = requestsList.filter((req: Request) => req.status === "pending").length
        const fulfilledCount = requestsList.filter((req: Request) => req.status === "fulfilled").length
        
        setStats(prev => ({
          ...prev,
          pendingRequests: pendingCount,
          totalFulfilledRequests: fulfilledCount
        }))

        // Track which items have been requested
        const requestedIds = new Set<string>(
          requestsList
            .filter((req: Request) => req.status === "pending" || req.status === "approved")
            .map((req: Request) => {
              const clothId = typeof req.clothId === 'object' ? req.clothId._id : req.clothId
              return clothId ? String(clothId) : null
            })
            .filter((id: string | null): id is string => id !== null)
        )
        setRequestedItemIds(requestedIds)
      } else {
        console.error("Failed to fetch requests")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = [...inventoryItems]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter (type)
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => {
        const itemType = item.type.toLowerCase()
        switch (categoryFilter) {
          case "mens":
            return itemType.includes("shirt") || itemType.includes("pant") || itemType.includes("jean") || itemType.includes("men")
          case "womens":
            return itemType.includes("dress") || itemType.includes("skirt") || itemType.includes("women") || itemType.includes("blouse")
          case "kids":
            return itemType.includes("kid") || itemType.includes("child") || itemType.includes("baby")
          case "accessories":
            return itemType.includes("hat") || itemType.includes("scarf") || itemType.includes("bag")
          default:
            return true
        }
      })
    }

    // Size filter
    if (sizeFilter !== "all") {
      filtered = filtered.filter(item => item.size.toLowerCase() === sizeFilter.toLowerCase())
    }

    setFilteredItems(filtered)
  }, [searchTerm, categoryFilter, sizeFilter, inventoryItems])

  const handleRequestItem = async (itemId: string) => {
    try {
      setRequestingItemId(itemId)
      const authToken = token || localStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/requests/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clothId: itemId,
          notes: ""
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Request Submitted!",
          description: "Your request has been sent to the admin for approval.",
        })
        // Add to requested items set
        setRequestedItemIds(prev => new Set([...prev, String(itemId)]))
        // Refresh data
        fetchData()
      } else {
        toast({
          title: "Request Failed",
          description: data.error || data.message || "Failed to submit request. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting your request.",
        variant: "destructive",
      })
    } finally {
      setRequestingItemId(null)
    }
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Approval</Badge>
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "fulfilled":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Fulfilled</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get recent requests for display (limit to 5)
  const recentRequests = requests.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">NGO Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableInventory}</div>
            <p className="text-xs text-muted-foreground">Items ready for request</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fulfilled</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFulfilledRequests}</div>
            <p className="text-xs text-muted-foreground">Successfully fulfilled</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Browse available clothes and filter by criteria.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mens">Men's Wear</SelectItem>
                <SelectItem value="womens">Women's Wear</SelectItem>
                <SelectItem value="kids">Kids Wear</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {inventoryItems.length === 0 
                    ? "No items available at the moment." 
                    : "No items match your current filters."}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Item ID</th>
                    <th className="p-2 font-semibold">Type</th>
                    <th className="p-2 font-semibold">Size</th>
                    <th className="p-2 font-semibold">Condition</th>
                    <th className="p-2 font-semibold">Status</th>
                    <th className="p-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.slice(0, 10).map((item) => (
                    <tr key={item._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{item._id.slice(-6)}</td>
                      <td className="p-2 capitalize">{item.type}</td>
                      <td className="p-2 font-medium">{item.size.toUpperCase()}</td>
                      <td className="p-2 capitalize">{item.condition}</td>
                      <td className="p-2">{getStatusBadge(item.status)}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link href={`/ngo/inventory/${item._id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={
                              item.status !== "approved" || 
                              requestingItemId === item._id ||
                              requestedItemIds.has(String(item._id))
                            }
                            onClick={() => handleRequestItem(item._id)}
                            title={
                              item.status !== "approved" 
                                ? "Item is not yet approved for requests" 
                                : requestedItemIds.has(String(item._id))
                                ? "You have already requested this item"
                                : "Request this item"
                            }
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            {requestingItemId === item._id 
                              ? "Submitting..." 
                              : requestedItemIds.has(String(item._id))
                              ? "Requested"
                              : "Request"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {filteredItems.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/ngo/inventory">View All Items ({filteredItems.length})</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Request Status</CardTitle>
          <CardDescription>Track the status of your recent cloth requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't made any requests yet.</p>
              <Button asChild>
                <Link href="/ngo/inventory">Browse Inventory</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 font-semibold">Request ID</th>
                      <th className="p-2 font-semibold">Item</th>
                      <th className="p-2 font-semibold">Status</th>
                      <th className="p-2 font-semibold">Date</th>
                      <th className="p-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => {
                      const cloth = typeof request.clothId === 'object' ? request.clothId : null
                      const clothId = typeof request.clothId === 'object' ? request.clothId._id : request.clothId
                      
                      return (
                        <tr key={request._id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="p-2 font-mono text-xs">{request._id.slice(-6)}</td>
                          <td className="p-2">
                            {cloth ? (
                              <span className="capitalize">{cloth.type} (Size: {cloth.size.toUpperCase()})</span>
                            ) : (
                              <span className="text-muted-foreground">Item unavailable</span>
                            )}
                          </td>
                          <td className="p-2">{getRequestStatusBadge(request.status)}</td>
                          <td className="p-2">{formatDate(request.createdAt)}</td>
                          <td className="p-2">
                            {cloth && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/ngo/inventory/${clothId}`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {requests.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/ngo/requests">View All Requests ({requests.length})</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button
          asChild
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg font-semibold rounded-md shadow-lg"
        >
          <Link href="/ngo/inventory">Browse Inventory</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="px-8 py-4 text-lg font-semibold rounded-md shadow-lg"
        >
          <Link href="/ngo/requests">View My Requests</Link>
        </Button>
      </div>
    </div>
  )
}
