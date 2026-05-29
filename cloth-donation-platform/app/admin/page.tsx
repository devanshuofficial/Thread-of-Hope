"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/contexts/auth-context'
import { Building2, Users, Package, CheckCircle, XCircle, Clock, ShoppingCart, Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

interface NGO {
  _id: string
  name: string
  email: string
  ngoName: string
  ngoStatus: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  totalDonors: number
  totalNGOs: number
  pendingNGOs: number
  acceptedNGOs: number
  rejectedNGOs: number
  pendingRequests?: number
}

interface Request {
  _id: string
  ngoId: {
    _id: string
    name: string
    email: string
    ngoName: string
    ngoPhone?: string
    ngoAddress?: string
  }
  clothId: {
    _id: string
    type: string
    size: string
    condition: string
    description: string
    imageUrl: string
    status: string
    donorId?: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const { token } = useAuth()
  const [ngos, setNgos] = useState<NGO[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (token || localStorage.getItem('token')) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get token from context or localStorage as fallback
      const authToken = token || localStorage.getItem('token')
      
      if (!authToken) {
        setError('No authentication token found. Please log in again.')
        setLoading(false)
        return
      }

      const [ngosResponse, statsResponse, requestsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/ngos`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/admin/requests`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        })
      ])

      // Handle NGOs response
      if (ngosResponse.ok) {
        const ngosData = await ngosResponse.json()
        setNgos(ngosData.ngos || [])
      } else {
        const ngosError = await ngosResponse.json().catch(() => ({ error: 'Failed to fetch NGOs' }))
        console.error('NGOs fetch error:', ngosError)
        setError(prev => prev ? `${prev}; NGOs: ${ngosError.error || 'Failed'}` : `Failed to fetch NGOs: ${ngosError.error || 'Unknown error'}`)
      }

      // Handle stats response
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      } else {
        const statsError = await statsResponse.json().catch(() => ({ error: 'Failed to fetch stats' }))
        console.error('Stats fetch error:', statsError)
        setError(prev => prev ? `${prev}; Stats: ${statsError.error || 'Failed'}` : `Failed to fetch stats: ${statsError.error || 'Unknown error'}`)
      }

      // Handle requests response
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        setRequests(requestsData.requests || [])
      } else {
        const requestsError = await requestsResponse.json().catch(() => ({ error: 'Failed to fetch requests' }))
        console.error('Requests fetch error:', requestsError)
        // Don't set error for requests if it's the only failure, just log it
        if (!ngosResponse.ok && !statsResponse.ok) {
          setError(prev => prev ? `${prev}; Requests: ${requestsError.error || 'Failed'}` : '')
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(`Error fetching data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (ngoId: string, action: 'approve' | 'reject') => {
    try {
      const authToken = token || localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/admin/ngos/${ngoId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: action === 'reject' ? 'Admin decision' : undefined }),
      })

      if (response.ok) {
        // Refresh data
        fetchData()
      } else {
        setError(`Failed to ${action} NGO`)
      }
    } catch (err) {
      setError(`Error ${action}ing NGO`)
    }
  }

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject' | 'fulfill') => {
    try {
      setProcessingRequestId(requestId)
      const authToken = token || localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/admin/requests/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes: '' }),
      })

      if (response.ok) {
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || `Failed to ${action} request`)
      }
    } catch (err) {
      setError(`Error ${action}ing request`)
    } finally {
      setProcessingRequestId(null)
    }
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case 'fulfilled':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Fulfilled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users and NGO approvals</p>
            </div>
            <Button onClick={fetchData} variant="outline">
              Refresh Data
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDonors}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalNGOs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending NGOs</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingNGOs}</div>
                </CardContent>
              </Card>

              {stats.pendingRequests !== undefined && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tabs for NGO Management and Requests */}
          <Tabs defaultValue="ngos" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ngos">NGO Management</TabsTrigger>
              <TabsTrigger value="requests">
                Requests ({requests.filter(r => r.status === 'pending').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ngos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>NGO Management</CardTitle>
                  <CardDescription>
                    Review and manage NGO applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ngos.map((ngo) => (
                        <TableRow key={ngo._id}>
                          <TableCell className="font-medium">{ngo.ngoName}</TableCell>
                          <TableCell>{ngo.name}</TableCell>
                          <TableCell>{ngo.email}</TableCell>
                          <TableCell>{getStatusBadge(ngo.ngoStatus)}</TableCell>
                          <TableCell>{new Date(ngo.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {ngo.ngoStatus === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproval(ngo._id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleApproval(ngo._id, 'reject')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {ngo.ngoStatus === 'accepted' && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Approved
                              </Badge>
                            )}
                            {ngo.ngoStatus === 'rejected' && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                Rejected
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>NGO Requests</CardTitle>
                  <CardDescription>
                    Review and manage clothing item requests from NGOs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No requests found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <Card key={request._id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Item Image */}
                              <div className="lg:w-48">
                                {request.clothId?.imageUrl ? (
                                  <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                      src={`http://localhost:5000${request.clothId.imageUrl}`}
                                      alt={request.clothId.type}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="h-16 w-16 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Request Details */}
                              <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold capitalize">
                                      {request.clothId?.type || 'Unknown Item'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      Requested by: <span className="font-medium">{request.ngoId?.ngoName || request.ngoId?.name}</span>
                                    </p>
                                  </div>
                                  {getRequestStatusBadge(request.status)}
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">NGO Contact</p>
                                    <p className="font-medium">{request.ngoId?.name}</p>
                                    <p className="text-sm text-muted-foreground">{request.ngoId?.email}</p>
                                    {request.ngoId?.ngoPhone && (
                                      <p className="text-sm text-muted-foreground">{request.ngoId.ngoPhone}</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Item Details</p>
                                    <p className="font-medium">Size: {request.clothId?.size?.toUpperCase()}</p>
                                    <p className="text-sm capitalize">Condition: {request.clothId?.condition}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Request Date</p>
                                    <p className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Item ID</p>
                                    <p className="font-mono text-xs">{request.clothId?._id?.slice(-8)}</p>
                                  </div>
                                </div>

                                {request.notes && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">NGO Notes:</p>
                                    <p className="text-sm bg-gray-50 p-2 rounded">{request.notes}</p>
                                  </div>
                                )}

                                {request.adminNotes && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Admin Notes:</p>
                                    <p className="text-sm bg-blue-50 p-2 rounded">{request.adminNotes}</p>
                                  </div>
                                )}

                                {/* Actions */}
                                {request.status === 'pending' && (
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleRequestAction(request._id, 'approve')}
                                      disabled={processingRequestId === request._id}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      {processingRequestId === request._id ? 'Processing...' : 'Approve'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRequestAction(request._id, 'reject')}
                                      disabled={processingRequestId === request._id}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {request.status === 'approved' && (
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleRequestAction(request._id, 'fulfill')}
                                      disabled={processingRequestId === request._id}
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      {processingRequestId === request._id ? 'Processing...' : 'Mark as Fulfilled'}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
