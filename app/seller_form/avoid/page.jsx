import {
  AlertTriangle,
  UserX,
  MessageCircleOff,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/BackBtn";
import { ArrowLeft } from "lucide-react";
import ResponsiveButton from "@/components/responsive-button";

// Mock BackButton component for demo
// const BackButton = () => (
//   <button className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
//     Back
//   </button>
// );

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Image */}
        <div className="hidden lg:flex items-center lg:w-2/5 xl:w-1/3   pt-5 pl-14 pr-14 pb-20 ">
          <div className=" hidden lg:w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden lg:flex items-center justify-center px-0 py-12 ">
            <img
              src="/guidelines.jpg"
              alt="Guidelines illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 lg:w-3/5 xl:w-2/3 flex items-center justify-center  p-6 lg:py-5 lg:pb-20 lg:px-5">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                  Now, let's go over what{" "}
                  <span className="text-red-500">not</span> to do.
                </h2>
                <p className="text-gray-600 text-base lg:text-lg">
                  To maintain a high-quality marketplace experience, please
                  avoid the following actions:
                </p>
              </div>

              {/* Guidelines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-10">
                <div className="p-4 lg:p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="flex-shrink-0">
                      <UserX className="w-6 h-6 lg:w-8 lg:h-8 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                        Misrepresenting your skills
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                        Ensure that your profile, gigs, and communication
                        reflect your actual capabilities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 lg:p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                        Creating multiple seller accounts
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                        Stick to one seller profile. You can always create
                        multiple gigs under a single account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 lg:p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="flex-shrink-0">
                      <MessageCircleOff className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                        Spamming or messaging users unsolicited
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                        Communicate only when necessary and relevant to the
                        services offered.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 lg:p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <div className="flex gap-3 lg:gap-4">
                    <div className="flex-shrink-0">
                      <Lock className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                        Taking payments off-platform
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                        All payments must go through our platform to ensure
                        buyer/seller protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Image - Only visible on mobile */}
              {/* <div className="lg:hidden mb-8">
                <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Guidelines illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-center  ">
                <BackButton />

                <Link
                  href="/seller_form/fill/your_info"
                  className="w-full sm:w-auto order-2 sm:order-1 cursor-pointer"
                >
                  <ResponsiveButton
                    variant="gradient"
                    className="cursor-pointer  "
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Continue
                  </ResponsiveButton>{" "}
                </Link>

                <div className="w-full sm:w-auto order-1 sm:order-2 cursor-pointer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
