import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Globe, Target, Award, Recycle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-emerald-600">ClothConnect AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between generous donors and those in need through intelligent cloth donation and distribution powered by AI.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-emerald-600" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To create a sustainable ecosystem where clothing donations reach those who need them most efficiently. 
                  We leverage AI technology to match donations with recipients, ensuring maximum impact and minimal waste.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-8 w-8 text-emerald-600" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  A world where no usable clothing goes to waste, and everyone has access to dignified clothing. 
                  We envision communities connected through compassion and technology working together for social good.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How We Make a Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Easy Donations</CardTitle>
                <CardDescription>
                  Simple, user-friendly platform for donors to contribute clothing items
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>NGO Network</CardTitle>
                <CardDescription>
                  Verified NGOs and organizations working directly with communities in need
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Recycle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  AI-powered system to match donations with the right recipients efficiently
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-emerald-800 mb-4">Our Impact</CardTitle>
              <CardDescription className="text-emerald-700 text-lg">
                Together, we're making a real difference in communities worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">10,000+</div>
                  <div className="text-emerald-800">Clothing Items Donated</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-emerald-800">Families Helped</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
                  <div className="text-emerald-800">Partner NGOs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3 text-lg py-2 px-4">
                Transparency
              </Badge>
              <p className="text-gray-600">
                Open tracking of donations from donor to recipient
              </p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3 text-lg py-2 px-4">
                Dignity
              </Badge>
              <p className="text-gray-600">
                Ensuring respectful treatment for all participants
              </p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3 text-lg py-2 px-4">
                Efficiency
              </Badge>
              <p className="text-gray-600">
                Maximizing impact through smart technology
              </p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3 text-lg py-2 px-4">
                Community
              </Badge>
              <p className="text-gray-600">
                Building connections between givers and receivers
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="py-12">
              <Award className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-xl mb-6 opacity-90">
                Whether you're looking to donate or distribute, every action makes a difference
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/auth" 
                  className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started Today
                </a>
                <a 
                  href="/contact" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
