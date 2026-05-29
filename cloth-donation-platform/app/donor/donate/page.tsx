"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function NewDonationPage() {
  const [formData, setFormData] = useState({
    type: "",
    size: "",
    condition: "",
    description: "",
    image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiResult, setAiResult] = useState<{
    condition: string
    status: string
    confidence: string
    analysis: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAiResult(null)
    
    const token = localStorage.getItem("token") || ""
    
    // Validate required fields
    if (!formData.type || !formData.size || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.image) {
      toast({
        title: "Image Required",
        description: "Please upload an image of the clothing item.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }
    
    // Create FormData object
    const formDataToSend = new FormData()
    formDataToSend.append('type', formData.type)
    formDataToSend.append('size', formData.size)
    formDataToSend.append('condition', formData.condition)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('image', formData.image)

    try {
      const response = await fetch(`http://localhost:5000/api/cloth/add-cloth`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        // Show AI analysis result
        if (data.aiAnalysis) {
          setAiResult(data.aiAnalysis)
        }

        // Show appropriate toast based on status
        if (data.aiAnalysis?.status === 'approved') {
          toast({
            title: "✅ Donation Approved!",
            description: "Your item passed AI verification and has been accepted.",
          })
        } else if (data.aiAnalysis?.status === 'rejected') {
          toast({
            title: "❌ Donation Rejected",
            description: "The item did not meet quality standards based on AI analysis.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "⏳ Pending Review",
            description: "Your donation is pending manual review.",
          })
        }

        // Reset form after successful submission
        setFormData({
          type: "",
          size: "",
          condition: "",
          description: "",
          image: null,
        })
        const fileInput = document.getElementById("image") as HTMLInputElement
        if (fileInput) {
          fileInput.value = ""
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "There was an issue submitting your donation. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting donation:", error)
      toast({
        title: "Error",
        description: "There was an issue submitting your donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Cloth Donation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Cloth Details</CardTitle>
          <CardDescription>Provide information about the clothes you wish to donate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="type">Cloth Type</Label>
              <Select onValueChange={(value) => handleSelectChange("type", value)} value={formData.type}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shirt">Shirt</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="dress">Dress</SelectItem>
                  <SelectItem value="jacket">Jacket</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size">Size</Label>
              <Select onValueChange={(value) => handleSelectChange("size", value)} value={formData.size}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="condition">Condition</Label>
              <Select onValueChange={(value) => handleSelectChange("condition", value)} value={formData.condition}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New with tags</SelectItem>
                  <SelectItem value="excellent">Excellent (like new)</SelectItem>
                  <SelectItem value="good">Good (minor wear)</SelectItem>
                  <SelectItem value="fair">Fair (visible wear, no major damage)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Blue denim jeans, slightly faded, no tears."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Upload Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
              {formData.image && <p className="text-sm text-muted-foreground">Selected: {formData.image.name}</p>}
            </div>
            <Button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing with AI..." : "Submit Donation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiResult && (
        <Card className={aiResult.status === 'approved' ? 'border-green-500' : aiResult.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {aiResult.status === 'approved' && '✅ AI Verification Result'}
              {aiResult.status === 'rejected' && '❌ AI Verification Result'}
              {aiResult.status === 'pending' && '⏳ AI Verification Result'}
            </CardTitle>
            <CardDescription>
              {aiResult.status === 'approved' && 'Your donation has been approved!'}
              {aiResult.status === 'rejected' && 'Your donation did not meet quality standards.'}
              {aiResult.status === 'pending' && 'Your donation is pending manual review.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Condition</p>
                <p className="font-semibold capitalize">{aiResult.condition}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-semibold capitalize">{aiResult.status}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                <p className="font-semibold capitalize">{aiResult.confidence}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">AI Analysis:</p>
              <p className="text-sm text-muted-foreground">{aiResult.analysis}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
