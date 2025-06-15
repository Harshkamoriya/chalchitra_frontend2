import BackButton from "@/components/BackBtn"
import { UserCircle, Film, Laptop, Camera, FileText, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"


const page = () => {
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 py-8 bg-white ">
      <div className="border-l-4 border-green-500 pl-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">What makes a successful editor profile?</h1>
        <p className="text-gray-600">
          Your profile is your portfolio. Make it count and attract clients who need top-notch video editing services.
        </p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        {/* Tip 1 */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300 group">
          <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
              Craft a detailed profile
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Highlight your editing style, years of experience, and what makes your work unique.
            </p>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300 group">
          <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
              Showcase your work
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Upload demo reels, short films, vlogs, or ad samples to impress potential clients.
            </p>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300 group">
          <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
              List your tools & software
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mention tools you're proficient with — Adobe Premiere, Final Cut Pro, DaVinci Resolve, etc.
            </p>
          </div>
        </div>

        {/* Tip 4 */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300 group">
          <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
              Upload a clear profile picture
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Use a friendly, professional-looking photo to gain trust instantly.
            </p>
          </div>
        </div>

        {/* Tip 5 */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300 group">
          <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
              Clearly describe your services
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Be specific about what kind of editing you do: Reels, Music Videos, Corporate Films, etc.
            </p>
          </div>
        </div>

        {/* Tip 6 */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300 group">
          <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
              Verify your identity
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Secure your account and boost client confidence by verifying your profile.
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center mt-8 mb-4">
        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`h-2 rounded-full ${step === 2 ? "w-8 bg-green-500" : "w-2 bg-gray-300"}`} />
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
        <BackButton/>
 
       <Link href="/seller_form/avoid">
        <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </button></Link>
      </div>
    </div>
  )
}

export default page
