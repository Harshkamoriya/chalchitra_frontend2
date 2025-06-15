import { AlertTriangle, UserX, MessageCircleOff, Lock, ArrowRight } from "lucide-react"
import BackButton from "@/components/BackBtn"
import Link from "next/link"

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Image/Illustration */}
        <div className=" hidden md:block lg:w-1/3 p-8 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center">
              <div className="text-center text-white">
                <img src="/guidelines.jpg" alt="guidelines" />
                <h3 className="text-xl font-semibold mb-2">Guidelines</h3>
                <p className="text-purple-100 text-sm">Follow best practices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="lg:w-2/3 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                  Now, let's go over what <span className="text-red-500">not</span> to do.
                </h2>
                <p className="text-gray-600 text-lg">
                  To maintain a high-quality marketplace experience, please avoid the following actions:
                </p>
              </div>

              {/* Guidelines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <UserX className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Misrepresenting your skills</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Ensure that your profile, gigs, and communication reflect your actual capabilities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Creating multiple seller accounts</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Stick to one seller profile. You can always create multiple gigs under a single account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <MessageCircleOff className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Spamming or messaging users unsolicited</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Communicate only when necessary and relevant to the services offered.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Lock className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Taking payments off-platform</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        All payments must go through our platform to ensure buyer/seller protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link href="/seller_form/fill/your_info" className="w-full sm:w-auto">
                  <button className="group w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <div className="w-full sm:w-auto">
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

export default page
