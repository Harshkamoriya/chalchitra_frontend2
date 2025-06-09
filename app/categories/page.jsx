"use client"

import { useAppContext } from "@/app/context/AppContext"
import { useEffect, useRef, useCallback, memo } from "react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-toastify"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/navigation"

import { FaArrowRight, FaArrowLeft, FaStar, FaHeart } from "react-icons/fa"
import { HiOutlineLocationMarker } from "react-icons/hi"

// Memoized GigCard component to prevent unnecessary re-renders


const GigCard = memo(({ gig ,onClick}) => {
  return (
    <div onClick={onClick} className="group bg-white rounded-xl mb-15 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={gig.image ||"/1.jpg" }
          alt={gig.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay on hover */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            View Details
          </button>
        </div> */}
        {/* Favorite Icon */}
        {/* <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50">
          <FaHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button> */}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-0">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium ">
            {gig.category || "General"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900  line-clamp-2 group-hover:text-blue-600 transition-colors">
          {gig.title}
        </h3>

        {/* Description */}
<p className="text-gray-600 text-lg mb-2 cursor-pointer hover:text-gray-900 hover:underline">
  {gig.description}
</p>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">4.9</span>
            <span className="ml-1 text-sm text-gray-500">(127)</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-lg text-black-500 font-bold">From</span>
            <span className="text-xl font-medium text-green-600">${gig.price}</span>
          </div>
         
        </div>

        {/* Gallery Preview (Optional - small thumbnails) */}
        {/* {gig.gallery && gig.gallery.length > 0 && (
          <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
            {gig.gallery.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Gallery ${index + 1}`}
                className="w-8 h-8 object-cover rounded border border-gray-200 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                loading="lazy"
              />
            ))}
            {gig.gallery.length > 3 && (
              <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                +{gig.gallery.length - 3}
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  )
})

GigCard.displayName = "GigCard"

const Gigs = () => {

  const { session, gigs, getAllGigs ,postGig} = useAppContext()
  const scrollRef = useRef(null)
  const [showAll, setShowAll] = useState(false)
  const Router = useRouter();

  useEffect(() => {
    getAllGigs()
  }, [])

  // Memoized scroll handlers
  const handleScrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      })
    }
  }, [])

  const handleScrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      })
    }
  }, [])

  const categories = [
    { name: "Editing & Post Production", href: "/Editing & Post Production" },
    { name: "Social and Marketing", href: "/social-and-marketing" },
    { name: "Explainer Videos", href: "/explainer-videos" },
    { name: "Animation", href: "/animation" },
    { name: "Product Videos", href: "/product-videos" },
    { name: "Motion Videos", href: "/motion-videos" },
    { name: "Filmed Video Production", href: "/filmed-video-production" },
    { name: "Miscellaneous", href: "/miscellaneous" },
  ]

  const Agigs = [
  {
    title: "Social Media Promo Videos",
    description: "Create eye-catching promos for Instagram and Facebook.",
    price: 30,
    image: "/1.jpg",
    gallery: [
      "https://source.unsplash.com/featured/?promo1",
      "https://source.unsplash.com/featured/?promo2",
      "https://source.unsplash.com/featured/?promo3",
    ],
    category: "Social & Marketing",
  },
  {
    title: "Presenter Spokesperson Video",
    description: "Hire a professional presenter to explain your product or service.",
    price: 70,
    image: "/presenter1.png",
    gallery: [
      "https://source.unsplash.com/featured/?presenter1",
      "https://source.unsplash.com/featured/?presenter2",
      "https://source.unsplash.com/featured/?presenter3",
    ],
    category: "Presenter Videos",
  },
  {
    title: "Animated Explainer Videos",
    description: "2D animation explainer videos for startups and apps.",
    price: 120,
    image: "/1a.jpg",
    gallery: [
      "https://source.unsplash.com/featured/?explainer1",
      "https://source.unsplash.com/featured/?explainer2",
      "https://source.unsplash.com/featured/?explainer3",
    ],
    category: "Explainer Videos",
  },
  {
    title: "Custom Logo Animation",
    description: "Professional logo animations in 24 hours.",
    price: 25,
    image: "/animation2.jpg",
    gallery: [
      "https://source.unsplash.com/featured/?logo1",
      "https://source.unsplash.com/featured/?logo2",
      "https://source.unsplash.com/featured/?logo3",
    ],
    category: "Animation",
  },
  {
    title: "Product Showcase Video",
    description: "High-quality product demo videos with transitions and effects.",
    price: 60,
    image: "/product1.png",
    gallery: [
      "https://source.unsplash.com/featured/?product1",
      "https://source.unsplash.com/featured/?product2",
      "https://source.unsplash.com/featured/?product3",
    ],
    category: "Product Videos",
  },
  {
    title: "Motion Graphics Intro",
    description: "Stylish and modern intros using After Effects.",
    price: 40,
    image:"motion1.jpg",
    gallery: [
      "https://source.unsplash.com/featured/?motion1",
      "https://source.unsplash.com/featured/?motion2",
      "https://source.unsplash.com/featured/?motion3",
    ],
    category: "Motion Graphics",
  },
  {
    title: "Cinematic Film Production",
    description: "End-to-end film production for commercials and short films.",
    price: 300,
    image: "film1.png",
    gallery: [
      "https://source.unsplash.com/featured/?film1",
      "https://source.unsplash.com/featured/?film2",
      "https://source.unsplash.com/featured/?film3",
    ],
    category: "Filmed Video Production",
  },
  {
    title: "Unique Video Editing Requests",
    description: "Handling unique and out-of-the-box video projects.",
    price: 75,
    image: "motion2.png",
    gallery: [
      "https://source.unsplash.com/featured/?misc1",
      "https://source.unsplash.com/featured/?misc2",
      "https://source.unsplash.com/featured/?misc3",
    ],
    category: "Miscellaneous",
  },
];

  const handlePostAll = async () => {
    for (const gig of Agigs) {
      try {
        await postGig(gig);
        toast.success(`Posted gig: ${gig.title}`);
      } catch (error) {
        console.error("Error posting gig:", gig.title, error);
        toast.error(`Failed to post gig: ${gig.title}`);
      }
    }}

    const handleClick = (id)=>{
Router.push(`/categories/${id}`)
    }


  return (
    <div className="min-h-screen bg-gray-50">
        <button
      onClick={() => handlePostAll()}
      className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Post All Gigs
    </button>
      {/* Enhanced Category Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Scroll Button */}
          <button
            onClick={handleScrollLeft}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Categories */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto mx-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            <div className="flex gap-8 text-lg font-md whitespace-nowrap py-1">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 relative group py-2"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={handleScrollRight}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-900 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {session?.user?.name || "User"}</h1>
              <p className="text-amber-100 text-lg">Discover amazing gigs and grow your business</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-amber-200 text-sm">Made on Chalchitra by Marie</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gigs Section */}
      <div className="container mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Gigs</h2>
          <p className="text-gray-600">Discover top-rated services from talented professionals</p>
        </div>

        {/* Gigs Grid */}
    {gigs && gigs.length > 0 ? (
 <div className="relative">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-8 transition-all duration-500 ${
          showAll ? "max-h-full" : "max-h-[900px] overflow-hidden"
        }`}
      >


        {gigs.map((gig) => (
<GigCard
  key={gig._id}
  gig={gig}
  onClick={() => handleClick(`/${encodeURIComponent(gig.title)}/${gig._id}`)}
/>
 
        ))}
      </div>

      {!showAll && gigs.length > 10 && (
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent flex justify-center items-end pb-4 pointer-events-none" />
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
        >
          {showAll ? (
            <>
              Show Less <FaChevronUp />
            </>
          ) : (
            <>
              Show More <FaChevronDown />
            </>
          )}
        </button>
      </div>
    </div>
) : (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HiOutlineLocationMarker className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs available</h3>
      <p className="text-gray-600 mb-6">Be the first to post a gig in this category and start earning!</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        Post Your First Gig
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default Gigs
