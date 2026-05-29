"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Calendar, Package, Ruler, Award, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ItemDetails {
  _id: string
  type: string
  size: string
  condition: string
  description: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  donorId?: string
}

export default function ItemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<ItemDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/cloth/clothes", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        })

        if (response.ok) {
          const data = await response.json()
          const foundItem = data.find((item: ItemDetails) => item._id === params.id)
          
          if (foundItem) {
            setItem(foundItem)
          } else {
            setError("Item not found")
          }
        } else {
          setError("Failed to load item details")
        }
      } catch (err) {
        console.error("Error fetching item:", err)
        setError("Error loading item details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchItemDetails()
    }
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Item Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {error || "The item you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild>
              <Link href="/ngo/inventory">Back to Inventory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Inventory
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>Item Image</CardTitle>
          </CardHeader>
          <CardContent>
            {item.imageUrl ? (
              <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.type}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <Package className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl capitalize">{item.type}</CardTitle>
                  <CardDescription className="mt-2">
                    Item ID: <span className="font-mono text-xs">{item._id}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(item.status)}
                  {getConditionBadge(item.condition)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-semibold">{item.size.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-semibold capitalize">{item.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold capitalize">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Added</p>
                    <p className="font-semibold text-sm">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  disabled={item.status !== "approved"}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Request This Item
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
              {item.status !== "approved" && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  This item is not available for request at the moment.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

