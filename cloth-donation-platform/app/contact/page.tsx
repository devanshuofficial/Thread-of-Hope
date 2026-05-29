import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in <span className="text-emerald-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our platform? Need help with donations or partnerships? 
            We're here to help you make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="h-6 w-6 text-emerald-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@clothconnect.ai</p>
                    <p className="text-gray-600">partnerships@clothconnect.ai</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">123 Innovation Drive</p>
                    <p className="text-gray-600">Tech Valley, CA 94000</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I become a donor?</h4>
                  <p className="text-gray-600 text-sm">
                    Simply create an account and select "Donor" as your role. You can then start donating clothes immediately.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How can my NGO join the platform?</h4>
                  <p className="text-gray-600 text-sm">
                    Register as an NGO and provide your organization details. We'll verify your NGO status and approve your account within 2-3 business days.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is there a fee to use the platform?</h4>
                  <p className="text-gray-600 text-sm">
                    No, our platform is completely free for both donors and NGOs. We believe in making charity accessible to everyone.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-xl text-red-800">Emergency Contact</CardTitle>
                <CardDescription className="text-red-700">
                  For urgent matters or emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-800 font-semibold">Emergency Hotline: +1 (555) 911-HELP</p>
                <p className="text-red-700 text-sm mt-1">Available 24/7 for urgent donation needs</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Support Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
              <p className="text-xl mb-6 opacity-90">
                Check out our help center or join our community forum
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                >
                  Visit Help Center
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-emerald-600"
                >
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
