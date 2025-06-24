import { UserCircle, Film, Laptop, Camera, FileText, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock BackButton component for demo
const BackButton = () => (
  <button className="group relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
    Back
  </button>
)

export default function EditorProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 pt-5 pl-14 pr-14 pb-20 ">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center px-0 pt-2">
            <img
              src="/tips2c.jpg"
              alt="Video editing workspace"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 lg:w-3/5 xl:w-2/3 flex items-center justify-center p-6 lg:py-5 lg:pb-20 lg:px-5 ">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="relative pl-6 mb-8">
                {/* Gradient border bar */}
                <div className="absolute left-0 top-0 h-full w-1 rounded bg-gradient-to-b from-purple-600 to-pink-600" />

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  What makes a successful editor profile?
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Your profile is your portfolio. Make it count and attract clients who need top-notch video editing
                  services.
                </p>
              </div>

              {/* Tips Grid */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-gray-700 mb-8">
                {/* Tip 1 */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-300 group">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                    <UserCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors text-sm lg:text-base">
                      Craft a detailed profile
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      Highlight your editing style, years of experience, and what makes your work unique.
                    </p>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 group">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                    <Film className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors text-sm lg:text-base">
                      Showcase your work
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      Upload demo reels, short films, vlogs, or ad samples to impress potential clients.
                    </p>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 group">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                    <Laptop className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors text-sm lg:text-base">
                      List your tools & software
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      Mention tools you're proficient with — Adobe Premiere, Final Cut Pro, DaVinci Resolve, etc.
                    </p>
                  </div>
                </div>

                {/* Tip 4 */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300 group">
                  <div className="bg-pink-100 p-2 rounded-lg text-pink-600 group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-pink-700 transition-colors text-sm lg:text-base">
                      Upload a clear profile picture
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      Use a friendly, professional-looking photo to gain trust instantly.
                    </p>
                  </div>
                </div>

                {/* Tip 5 */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300 group">
                  <div className="bg-violet-100 p-2 rounded-lg text-violet-600 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-violet-700 transition-colors text-sm lg:text-base">
                      Clearly describe your services
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      Be specific about what kind of editing you do: Reels, Music Videos, Corporate Films, etc.
                    </p>
                  </div>
                </div>

                {/* Tip 6 */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all duration-300 group">
                  <div className="bg-cyan-100 p-2 rounded-lg text-cyan-600 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-cyan-700 transition-colors text-sm lg:text-base">
                      Verify your identity
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      Secure your account and boost client confidence by verifying your profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Image - Only visible on mobile */}
              {/* <div className="lg:hidden mb-8">
                <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Video editing workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}

              {/* Progress indicator */}
              {/* <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        step === 2 ? "w-8 bg-gradient-to-r from-purple-600 to-pink-600" : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div> */}

              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link href="/seller_form/avoid" className="w-full sm:w-auto order-2 sm:order-1">
                  <button className="group relative inline-flex items-center justify-center px-6 lg:px-8 py-3 rounded-xl font-medium text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <span className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-purple-600 to-pink-600 -z-10"></span>
                    <span className="absolute inset-[2px] rounded-[10px] bg-white"></span>
                    <span className="relative bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>

                <div className="w-full sm:w-auto order-1 sm:order-2">
                  <BackButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
