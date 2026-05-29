"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Package, Eye, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

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

export default function NGOInventory() {
  const [inventoryItems, setInventory] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [displayCount, setDisplayCount] = useState(12) // Show 12 items initially
  const [requestingItemId, setRequestingItemId] = useState<string | null>(null)
  const [requestedItemIds, setRequestedItemIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

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

  const getConditionBadge = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Excellent</Badge>
      case "good":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Good</Badge>
      case "bad":
        return <Badge variant="destructive">Bad</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{condition || "N/A"}</Badge>
    }
  }

  // Fetch items and existing requests from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          console.error("No token found")
          setLoading(false)
          return
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        
        // Fetch both items and existing requests in parallel
        const [itemsResponse, requestsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/cloth/clothes`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          }),
          fetch(`${API_BASE_URL}/requests/my-requests`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          })
        ])
        
        if (itemsResponse.ok) {
          const data = await itemsResponse.json()
          console.log("Fetched items:", data.length, "total items")
          console.log("Items breakdown:", {
            approved: data.filter((item: InventoryItem) => item.status === "approved").length,
            pending: data.filter((item: InventoryItem) => item.status === "pending").length,
            rejected: data.filter((item: InventoryItem) => item.status === "rejected").length,
          })
          
          // Show approved items first, but also show pending items (NGOs can see what's coming)
          const approvedItems = data.filter((item: InventoryItem) => item.status === "approved")
          const pendingItems = data.filter((item: InventoryItem) => item.status === "pending")
          
          // Combine approved and pending items (approved first)
          const allAvailableItems = [...approvedItems, ...pendingItems]
          
          console.log("Setting inventory:", allAvailableItems.length, "items")
          setInventory(allAvailableItems)
          setFilteredItems(allAvailableItems)
        } else {
          const errorData = await itemsResponse.json().catch(() => ({}))
          console.error("API Error:", itemsResponse.status, errorData)
        }

        // Fetch existing requests to check which items are already requested
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()
          const requests = requestsData.requests || []
          
          // Get cloth IDs that have pending or approved requests
          const requestedIds = new Set<string>(
            requests
              .filter((req: any) => req.status === 'pending' || req.status === 'approved')
              .map((req: any) => {
                const clothId = req.clothId?._id || req.clothId
                return clothId ? String(clothId) : null
              })
              .filter((id: string | null): id is string => id !== null) // Remove null values and ensure string type
          )
          
          console.log("Requested item IDs:", Array.from(requestedIds))
          setRequestedItemIds(requestedIds)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = [...inventoryItems]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter (using type)
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.type.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Size filter
    if (sizeFilter !== "all") {
      filtered = filtered.filter(item => item.size.toLowerCase() === sizeFilter.toLowerCase())
    }

    // Condition filter
    if (conditionFilter !== "all") {
      filtered = filtered.filter(item => item.condition.toLowerCase() === conditionFilter.toLowerCase())
    }

    setFilteredItems(filtered)
    setDisplayCount(12) // Reset display count when filters change
  }, [searchTerm, categoryFilter, sizeFilter, conditionFilter, inventoryItems])

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12)
  }

  const handleRequestItem = async (itemId: string) => {
    try {
      setRequestingItemId(itemId)
      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      const response = await fetch(`${API_BASE_URL}/requests/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
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
      } else {
        console.error("Request failed:", data)
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

  const displayedItems = filteredItems.slice(0, displayCount)
  const hasMore = displayCount < filteredItems.length
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Browse and request available clothing items</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
          </span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific items based on your requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by type, brand, or description..." 
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
                <SelectItem value="shirt">Shirt</SelectItem>
                <SelectItem value="pants">Pants</SelectItem>
                <SelectItem value="dress">Dress</SelectItem>
                <SelectItem value="jacket">Jacket</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
                <SelectItem value="xxl">XXL</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="bad">Bad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        </div>
      ) : displayedItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {filteredItems.length === 0 && inventoryItems.length > 0
                ? "No items match your current filters. Try adjusting your search."
                : inventoryItems.length === 0
                ? "No items available at the moment. Items will appear here once donors submit donations and they are approved."
                : "No items found."}
            </p>
            {inventoryItems.length === 0 && (
              <Button asChild variant="outline">
                <Link href="/ngo">Go to Dashboard</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedItems.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg capitalize">{item.type}</CardTitle>
                      <CardDescription className="text-sm">
                        Size {item.size.toUpperCase()} • {item.condition}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(item.status)}
                      {getConditionBadge(item.condition)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.imageUrl && (
                    <div className="relative h-48 w-full bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={item.type}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{item.size.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Item ID:</span>
                      <span className="font-mono text-xs">{item._id.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/ngo/inventory/${item._id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
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
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {requestingItemId === item._id 
                        ? "Submitting..." 
                        : requestedItemIds.has(String(item._id))
                        ? "Already Requested"
                        : item.status === "approved" 
                        ? "Request" 
                        : "Pending"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" size="lg" onClick={handleLoadMore}>
                Load More Items ({filteredItems.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
