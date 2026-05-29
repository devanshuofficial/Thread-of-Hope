"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Scan, Handshake, Truck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface PublicStats {
  totalClothes: number
  approvedClothes: number
  totalDonors: number
  totalNGOs: number
  livesTouched: number
}

export default function LandingPage() {
  const { user, isAuthenticated, isLoading, canAccessDonorPortal, canAccessNGOPortal } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect authenticated users to their appropriate portal
      if (canAccessDonorPortal) {
        router.push('/donor')
      } else if (canAccessNGOPortal) {
        router.push('/ngo')
      } else if (user?.role === 'ngo' && user.ngoStatus === 'pending') {
        router.push('/ngo/pending')
      }
    }
  }, [isLoading, isAuthenticated, user, canAccessDonorPortal, canAccessNGOPortal, router])

  // Fetch public statistics
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cloth/public-stats`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          throw new Error('Failed to fetch stats')
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default stats if API fails
        setStats({
          totalClothes: 0,
          approvedClothes: 0,
          totalDonors: 0,
          totalNGOs: 0,
          livesTouched: 0
        })
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your portal...</p>
        </div>
      </div>
    )
  }

  // Show landing page for unauthenticated users
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Give Clothes, Change Lives with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-50 md:text-xl">
                Our AI-powered platform connects your donated clothes with NGOs in need, ensuring efficient and
                impactful distribution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <Button
                asChild
                className="bg-white text-emerald-600 hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-md shadow-lg"
              >
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-emerald-600 px-6 py-3 text-lg font-semibold rounded-md shadow-lg bg-transparent"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our seamless process ensures your donations make a real difference.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-5xl">
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <Upload className="h-12 w-12 text-emerald-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">1. Upload</CardTitle>
                <CardContent className="text-gray-600">Easily upload details and images of your clothes.</CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <Scan className="h-12 w-12 text-emerald-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">2. AI Verification</CardTitle>
                <CardContent className="text-gray-600">
                  Our AI verifies condition and categorizes items for optimal matching.
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <Handshake className="h-12 w-12 text-emerald-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">3. NGO Request</CardTitle>
                <CardContent className="text-gray-600">
                  NGOs browse inventory and request items based on their needs.
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <Truck className="h-12 w-12 text-emerald-500 mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">4. Distribution</CardTitle>
                <CardContent className="text-gray-600">
                  Clothes are efficiently distributed to those who need them most.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See the difference your donations are making.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-12 w-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-5xl font-bold text-emerald-600">
                      {stats ? (stats.approvedClothes >= 1000 ? `${(stats.approvedClothes / 1000).toFixed(1)}K+` : stats.approvedClothes) : '0'}
                    </CardTitle>
                    <CardContent className="text-gray-600 text-lg">Clothes Donated</CardContent>
                  </>
                )}
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-12 w-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-5xl font-bold text-emerald-600">
                      {stats ? (stats.totalNGOs >= 10 ? `${stats.totalNGOs}+` : stats.totalNGOs) : '0'}
                    </CardTitle>
                    <CardContent className="text-gray-600 text-lg">NGO Partners</CardContent>
                  </>
                )}
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-12 w-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-5xl font-bold text-emerald-600">
                      {stats ? (stats.livesTouched >= 1000 ? `${(stats.livesTouched / 1000).toFixed(1)}K+` : stats.livesTouched) : '0'}
                    </CardTitle>
                    <CardContent className="text-gray-600 text-lg">Lives Touched</CardContent>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What People Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our amazing donors and partners.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
              <Card className="p-6 shadow-md">
                <CardContent className="text-gray-700 italic">
                  "Donating clothes has never been easier! The AI verification gives me peace of mind that my donations
                  are going to the right place."
                </CardContent>
                <CardHeader className="pt-4 text-right">
                  <CardTitle className="text-lg font-semibold">- Jane Doe, Donor</CardTitle>
                </CardHeader>
              </Card>
              <Card className="p-6 shadow-md">
                <CardContent className="text-gray-700 italic">
                  "ClothConnect AI has revolutionized how we source clothes. The inventory filters save us so much time
                  and ensure we get exactly what our community needs."
                </CardContent>
                <CardHeader className="pt-4 text-right">
                  <CardTitle className="text-lg font-semibold">- NGO Partner, Hope Foundation</CardTitle>
                </CardHeader>
              </Card>
              <Card className="p-6 shadow-md">
                <CardContent className="text-gray-700 italic">
                  "The real-time status updates are fantastic. I always know where my donation is in the process, from
                  upload to distribution."
                </CardContent>
                <CardHeader className="pt-4 text-right">
                  <CardTitle className="text-lg font-semibold">- John Smith, Donor</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
