import { Film, Upload, Rocket, ChevronRight, Edit3, Clock, DollarSign } from "lucide-react"
import Link from "next/link"


const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Responsive container - video left, content right on large screens */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 ">
          {/* Video Section */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0  z-10 pointer-events-none"></div>
              <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                <source src="/seller_form.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video overlay elements */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-whit rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Preview</span>
                </div>
              </div>
            </div>

              <div className=" hidden lg:block">
             {/* Benefits section */}
            <div className="mt-10 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Why join as an editor?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Competitive rates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Flexible schedule</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Film className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Build your portfolio</span>
                </div>
              </div>
            </div>

            {/* Call to action button */}
            <div className="mt-10">
           <Link href="/seller_form/tips">
              <button className="bg-green-600 cursor-pointer text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                Become a Video Editor
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
           
           </Link>
            </div>
          </div>

          </div>

        


          {/* Content Section */}
          <div className="lg:w-1/2 animate-fade-in-delay">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">earn</span>{" "}
                doing what you love?
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Here's how to get started as a professional video editor on our platform:
              </p>
            </div>

            {/* Three step process */}
            <div className="mt-10 space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 text-gray-700 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Edit3 className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-700 transition-colors">
                    Build Your Editing Profile
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Showcase your editing style, preferred tools (like Adobe Premiere, Final Cut Pro), and highlight
                    your unique experience and skills.
                  </p>
                </div>
              </div>
              <hr />

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0  p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-700 group-hover:text-purple-700 transition-colors">
                    Upload Your Best Work
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Add samples that highlight your skill—vlogs, cinematic edits, reels, wedding videos, and more to
                    attract the right clients.
                  </p>
                </div>
              </div>
              <hr />

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0  p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-700  transition-colors">
                    Launch Your Editing Gig
                  </h3>
                  <p className="mt-2 text-gray-600 mb-7">
                    Set your pricing, define turnaround time, and start accepting client requests right away.
                  </p>
                </div>
              </div>
            </div>
            <hr />

            {/* Benefits section */}
            <div className="mt-10 lg:hidden bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Why join as an editor?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Competitive rates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Flexible schedule</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Film className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Build your portfolio</span>
                </div>
              </div>
            </div>

            {/* Call to action button */}
            <div className="mt-10 lg:hidden">
             <Link href="/seller_form/tips"
             > <button className="bg-green-600 cursor-pointer text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                Become a Video Editor
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button></Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
