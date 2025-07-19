"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, TrendingUp, DollarSign, Clock, Users, PlayCircle, ArrowRight } from "lucide-react"

const CustomerStories = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const buyerStories = [
    {
      name: "Sarah Chen",
      role: "YouTube Creator",
      avatar: "/placeholder.svg?height=80&width=80&text=SC",
      company: "TechReview Channel",
      subscribers: "2.3M",
      story:
        "I was spending 15+ hours editing each video. Now I upload 3x more content and my channel grew by 400% in 6 months! The quality is incredible and I can focus on creating content.",
      results: {
        timesSaved: "20+ hours/week",
        growthRate: "400%",
        videosPerMonth: "12 videos",
      },
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      avatar: "/placeholder.svg?height=80&width=80&text=MR",
      company: "GrowthCorp Agency",
      teamSize: "25 employees",
      story:
        "Our video marketing campaigns now convert 3x better. The quality and turnaround time exceeded all expectations. We've scaled our video production without hiring more staff.",
      results: {
        conversionRate: "+300%",
        clientSatisfaction: "98%",
        projectsCompleted: "150+",
      },
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Small Business Owner",
      avatar: "/placeholder.svg?height=80&width=80&text=EW",
      company: "Bloom Bakery",
      location: "Portland, OR",
      story:
        "My Instagram reels went viral after working with editors here. Sales increased by 250% in just 3 months! The ROI has been absolutely incredible.",
      results: {
        salesIncrease: "+250%",
        socialFollowers: "50K+",
        monthlyOrders: "500+",
      },
      rating: 5,
    },
  ]

  const sellerStories = [
    {
      name: "Alex Thompson",
      role: "Video Editor",
      avatar: "/placeholder.svg?height=80&width=80&text=AT",
      specialty: "YouTube & Social Media",
      experience: "3 years",
      story:
        "I went from struggling freelancer to running a 6-figure editing business. This platform changed my life completely! I now have a steady stream of high-quality clients.",
      results: {
        monthlyEarnings: "$12,000+",
        clientsServed: "200+",
        rating: "4.9/5",
      },
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Motion Graphics Artist",
      avatar: "/placeholder.svg?height=80&width=80&text=PS",
      specialty: "Corporate & Explainer Videos",
      location: "Mumbai, India",
      story:
        "Started as a side hustle, now it's my full-time career. I work with global brands and earn more than my corporate job! The platform's tools make everything so professional.",
      results: {
        monthlyIncome: "$8,500+",
        globalClients: "15 countries",
        projectsCompleted: "300+",
      },
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Cinematic Editor",
      avatar: "/placeholder.svg?height=80&width=80&text=DK",
      specialty: "Wedding & Event Videos",
      awards: "3 industry awards",
      story:
        "My wedding video business exploded after joining. I'm booked 6 months in advance and charge premium rates! The quality of clients here is unmatched.",
      results: {
        bookingRate: "100%",
        averageProject: "$2,500",
        clientRetention: "95%",
      },
      rating: 5,
    },
  ]

  const stats = [
    { icon: Users, value: "10,000+", label: "Success Stories" },
    { icon: DollarSign, value: "$50M+", label: "Earned by Editors" },
    { icon: TrendingUp, value: "300%", label: "Average Growth" },
    { icon: Clock, value: "24/7", label: "Support Available" },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={fadeUpVariants}>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-sm mb-6">
              Success Stories
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Real People,
            <span className="block text-emerald-600 mt-2">Real Results</span>
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our platform has transformed businesses and careers around the world
          </motion.p>
        </motion.div>

        {/* Stats Section - Clean Design */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div key={index} variants={fadeUpVariants} className="text-center">
                  <div className="bg-emerald-600 text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Client Success Stories - Professional Layout */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Client Success Stories</h3>
            <p className="text-lg text-gray-600">See how businesses transformed their content strategy</p>
          </motion.div>

          <div className="space-y-16">
            {buyerStories.map((story, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content Side */}
                <div className="lg:w-1/2">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    {/* Profile Header */}
                    <div className="flex items-center mb-6">
                      <Avatar className="w-16 h-16 mr-4 ring-4 ring-emerald-100">
                        <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                        <AvatarFallback className="bg-emerald-600 text-white text-lg font-bold">
                          {story.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{story.name}</h4>
                        <p className="text-gray-600">
                          {story.role} • {story.company}
                        </p>
                        <div className="flex items-center mt-2">
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">5.0</span>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="relative mb-6">
                      <Quote className="w-8 h-8 text-emerald-200 absolute -top-2 -left-2" />
                      <p className="text-gray-700 text-lg leading-relaxed pl-6 italic">{story.story}</p>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                      {Object.entries(story.results).map(([key, value], i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="lg:w-1/2">
                  <div className="bg-emerald-50 rounded-2xl h-80 flex items-center justify-center border border-emerald-100">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                        <TrendingUp className="w-12 h-12" />
                      </div>
                      <p className="text-emerald-700 font-bold text-lg">Success Visualization</p>
                      <p className="text-emerald-600 text-sm">{story.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Editor Success Stories - Clean Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Editor Success Stories</h3>
            <p className="text-lg text-gray-600">Discover how editors built thriving businesses</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {sellerStories.map((story, index) => (
              <motion.div key={index} variants={fadeUpVariants}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                  {/* Profile */}
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 mr-3 ring-4 ring-emerald-100">
                      <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                      <AvatarFallback className="bg-emerald-600 text-white font-bold">
                        {story.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-gray-900">{story.name}</h4>
                      <p className="text-sm text-gray-600">{story.role}</p>
                      <p className="text-xs text-emerald-600 font-medium">{story.specialty}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">5.0</span>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="w-6 h-6 text-emerald-200 absolute -top-1 -left-1" />
                    <p className="text-gray-700 text-sm leading-relaxed pl-5 italic">{story.story}</p>
                  </div>

                  {/* Results */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    {Object.entries(story.results).map(([key, value], i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="font-bold text-emerald-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section - Fiverr Style */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center bg-gray-900 rounded-3xl p-12 text-white shadow-2xl"
        >
          <motion.h3 variants={fadeUpVariants} className="text-3xl font-bold mb-4">
            Ready to Write Your Success Story?
          </motion.h3>
          <motion.p variants={fadeUpVariants} className="text-xl mb-8 opacity-90">
            Join thousands of creators and editors who are already transforming their careers
          </motion.p>
          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold bg-transparent"
            >
              View All Stories
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CustomerStories
