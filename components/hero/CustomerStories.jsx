"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

const CustomerStories = () => {
  const containerRef = useRef(null)
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const successStories = [
    {
      id: 1,
      title: "YouTube Creator Success",
      description: "Sarah grew her channel by 400% using our video editing services",
      author: "Sarah Chen",
      role: "Content Creator",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
      category: "YouTube",
      results: "400% Growth",
    },
    {
      id: 2,
      title: "Agency Transformation",
      description: "Marketing agency scaled video production without hiring more staff",
      author: "Marcus Rodriguez",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
      category: "Agency",
      results: "300% ROI",
    },
    {
      id: 3,
      title: "Small Business Viral Success",
      description: "Local bakery's Instagram reels went viral, boosting sales by 250%",
      author: "Emily Watson",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      category: "Small Business",
      results: "250% Sales",
    },
    {
      id: 4,
      title: "Freelancer to 6-Figure Business",
      description: "Video editor built thriving business earning $12K+ monthly",
      author: "Alex Thompson",
      role: "Video Editor",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
      category: "Freelancer",
      results: "$12K+/month",
    },
    {
      id: 5,
      title: "Corporate Video Success",
      description: "Enterprise client improved training video engagement by 500%",
      author: "Jennifer Liu",
      role: "HR Director",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      category: "Corporate",
      results: "500% Engagement",
    },
    {
      id: 6,
      title: "Wedding Videographer Growth",
      description: "Wedding videographer booked 6 months in advance with premium rates",
      author: "David Kim",
      role: "Wedding Videographer",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      category: "Wedding",
      results: "100% Booked",
    },
  ]

  const scroll = (direction) => {
    const container = scrollRef.current
    if (container) {
      const scrollAmount = 320
      const newScrollLeft =
        direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const checkScrollButtons = () => {
    const container = scrollRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      checkScrollButtons()
      return () => container.removeEventListener("scroll", checkScrollButtons)
    }
  }, [])

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <motion.section ref={containerRef} style={{ opacity }} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <motion.div style={{ y }} className="lg:w-2/5 lg:sticky lg:top-24">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={fadeUpVariants}>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-sm mb-6">
                  Success Stories
                </Badge>
              </motion.div>

              <motion.h2
                variants={fadeUpVariants}
                className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight"
              >
                Customer
                <br />
                <span className="text-emerald-600">Success Stories</span>
              </motion.h2>

              <motion.p variants={fadeUpVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
                Discover how our customers are empowering their teams and transforming their organizations to create a
                safer, more efficient, and more sustainable future.
              </motion.p>

              <motion.div variants={fadeUpVariants}>
                <Button
                  variant="link"
                  className="text-emerald-600 hover:text-emerald-700 p-0 h-auto font-semibold text-base group"
                >
                  See all stories
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Scrollable Cards */}
          <div className="lg:w-3/5 relative">
            {/* Navigation Buttons */}
            <div className="hidden lg:flex absolute -top-16 right-0 gap-2 z-10">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  canScrollLeft
                    ? "bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  canScrollRight
                    ? "bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitScrollbar: { display: "none" },
              }}
            >
              {successStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex-shrink-0 w-80 lg:w-72 group cursor-pointer"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${story.image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                        {story.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <Avatar className="w-8 h-8 mr-2 ring-2 ring-white/30">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32&text=${story.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}`}
                            />
                            <AvatarFallback className="bg-emerald-600 text-white text-xs">
                              {story.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{story.author}</p>
                            <p className="text-xs text-white/80">{story.role}</p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-2 leading-tight">{story.title}</h3>

                      <p className="text-sm text-white/90 mb-3 leading-relaxed">{story.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-semibold text-sm">{story.results}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="lg:hidden flex justify-center mt-4 gap-2">
              {successStories.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  )
}

export default CustomerStories
