import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const LandPage = () => {
  return (
<div className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] w-full overflow-hidden flex flex-col justify-between">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white/10 z-10" /> {/* Dark overlay for better contrast */}
        <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center">
          <h1
            className="font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight animate-fade-in"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Lights, Camera, <span className="text-white">Earn!</span>
          </h1>

          <p
            className="text-2xl sm:text-2xl text-white/90 font-medium max-w-2xl mx-auto animate-fade-in-delay"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            Start Exploring your earning potential today
          </p>

          <div className="animate-fade-in-delay-2">
            <Link href="/seller_form">
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 cursor-pointer text-white px-10 sm:px-16 lg:px-24 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 h-auto w-screen max-w-xs sm:max-w-md lg:max-w-lg">
  Become a Seller
  <ArrowRight className="h-5 w-5" />
</Button></Link>

          </div>
        </div> 
      </div>

      {/* Stats Section */}
      <div className="relative z-10 w-full py-8 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-around gap-8 sm:gap-4">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-medium text-gray-400">A Gig is Bought Every</h2>
              <span className="text-3xl sm:text-4xl font-medium text-white mt-2">4 SEC</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-medium text-gray-400">Transactions</h2>
              <span className="text-3xl sm:text-4xl font-medium text-white mt-2">50 M+</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-medium text-gray-400">Price Range</h2>
              <span className="text-3xl sm:text-4xl font-medium text-white mt-2">$5 - $10,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandPage
