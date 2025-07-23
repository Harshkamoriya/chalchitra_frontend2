"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Grid3X3, List, Heart, Clock, ArrowLeft, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

const CategoryPage = () => {
  const params = useParams()
  const router = useRouter()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    maxDelivery: "",
    minRating: "",
  })

  const categorySlug = params.categorySlug

  const categoryInfo = {
    "music-video-editing": {
      title: "Music Video Editing",
      description: "Professional music video editing services for artists and labels",
      gradient: "from-purple-500 to-pink-500",
    },
    "wedding-event-editing": {
      title: "Wedding & Event Editing",
      description: "Capture your special moments with professional wedding video editing",
      gradient: "from-rose-500 to-pink-500",
    },
    "commercial-ad-editing": {
      title: "Commercial & Ad Editing",
      description: "High-impact commercial and advertisement video editing",
      gradient: "from-blue-500 to-cyan-500",
    },
    "youtube-vlog-editing": {
      title: "YouTube & Vlog Editing",
      description: "Engaging YouTube and vlog editing to grow your channel",
      gradient: "from-red-500 to-orange-500",
    },
    "gaming-editing": {
      title: "Gaming Content Editing",
      description: "Epic gaming video editing for streamers and content creators",
      gradient: "from-green-500 to-emerald-500",
    },
    "podcast-editing": {
      title: "Podcast Editing",
      description: "Professional podcast editing and audio enhancement",
      gradient: "from-indigo-500 to-purple-500",
    },
    "short-form-reels-shorts": {
      title: "Short Form & Reels",
      description: "Viral-ready short form content for TikTok, Instagram, and YouTube",
      gradient: "from-teal-500 to-cyan-500",
    },
    "faceless-youtube-channel-editing": {
      title: "Faceless YouTube Editing",
      description: "Engaging faceless YouTube content editing and automation",
      gradient: "from-amber-500 to-orange-500",
    },
    "corporate-educational-editing": {
      title: "Corporate & Educational",
      description: "Professional corporate and educational video editing services",
      gradient: "from-slate-500 to-gray-600",
    },
  }

  const currentCategory = categoryInfo[categorySlug] || {
    title: "Video Editing Services",
    description: "Professional video editing services",
    gradient: "from-gray-500 to-gray-600",
  }

  useEffect(() => {
    fetchGigs()
  }, [categorySlug, sortBy, filters])

  const fetchGigs = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        category: categorySlug,
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.maxDelivery && { maxDelivery: filters.maxDelivery }),
        ...(filters.minRating && { minRating: filters.minRating }),
        sort: sortBy,
      })

      const response = await fetch(`/api/gigs/categorypage?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setGigs(data.gigs)
      }
    } catch (error) {
      console.error("Error fetching gigs:", error)
    } finally {
      setLoading(false)
    }
  }

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
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${currentCategory.gradient} text-white py-20`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/20 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">{currentCategory.title}</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">{currentCategory.description}</p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {gigs.length} Services Available
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Starting from $25
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                24-48h Delivery
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.minRating || "any"}
                onValueChange={(value) => setFilters({ ...filters, minRating: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Minimum Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.8">4.8+ Stars</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.maxDelivery || "any"}
                onValueChange={(value) => setFilters({ ...filters, maxDelivery: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Delivery Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="1">24 Hours</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gigs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">Loading gigs...</span>
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No gigs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new services.</p>
              <Link href="/categories">
                <Button>Browse All Categories</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {gigs.map((gig, index) => (
                <motion.div key={gig._id} variants={fadeUpVariants} custom={index}>
                  <GigCard gig={gig} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

const GigCard = ({ gig, viewMode }) => {
  const isListView = viewMode === "list"

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card
        className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
          isListView ? "flex flex-row" : ""
        }`}
      >
        <div className={`relative ${isListView ? "w-80 flex-shrink-0" : ""}`}>
          <img
            src={gig.images?.[0] || "/placeholder.svg?height=200&width=300"}
            alt={gig.title}
            className={`w-full object-cover ${isListView ? "h-48" : "h-48"}`}
          />
          <div className="absolute top-3 right-3">
            <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className={`p-4 ${isListView ? "flex-1" : ""}`}>
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={gig.seller?.profilePicture || "/placeholder.svg"} />
              <AvatarFallback>
                {gig.seller?.firstName?.[0]}
                {gig.seller?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {gig.seller?.firstName} {gig.seller?.lastName}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">
                  {gig.rating?.average?.toFixed(1) || "5.0"} ({gig.rating?.count || 0})
                </span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title}</h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {gig.tags?.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{gig.packages?.deliveryTime || 3} days</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Starting at</p>
              <p className="text-lg font-bold text-gray-900">${gig.packages?.price || 25}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CategoryPage
