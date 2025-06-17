"use client"
import { Pacifico } from "next/font/google"
import Link from "next/link"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Video, ArrowUp } from "lucide-react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerSections = [
    {
      title: "Categories",
      links: [
        "Editing & Post Production",
        "Social & Marketing",
        "Presenter Videos",
        "Explainer Videos",
        "Animation",
        "Product Videos",
        "Motion Graphics",
        "Filmed Video Production",
        "Miscellaneous",
      ],
    },
    {
      title: "For Clients",
      links: [
        "How ChalChitra Works",
        "Customer Success Stories",
        "Trust & Safety",
        "Quality Guide",
        "ChalChitra",
        "Chalchitra Guide",
        "ChalChitra Answers",
      ],
    },
    {
      title: "For FreeLancers",
      links: [
        "Become a Fiverr Freelancer",
        "Become a Agency",
        "FreeLancer Equity Program",
        "KickStart",
        "Community Hub",
        "Forum",
        "Events",
      ],
    },
    {
      title: "Business Solutions",
      links: [
        "Chalchitra Pro",
        "Project Management Service",
        "Expert Sourcing Service",
        "Clear Voice",
        "Working not working",
        "Auto Ds",
        "Ai store builder",
        "ChalChitra logo maker",
        "ChalChitra Go",
      ],
    },
    {
      title: "Company",
      links: [
        "About ChalChitra",
        "Help & Support",
        "Social Impact",
        "Careers",
        "Terms of Service",
        "Privacy Policy",
        "Partnerships",
        "Creator Networks",
        "Affiliates",
        "Invite a friend",
      ],
    },
  ]

  const socialLinks = [
    { icon: FaFacebook, url: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, url: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, url: "https://linkedin.com", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section with Logo and Newsletter */}
        <div className="mb-12 lg:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Logo and Description */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center mb-4">
                <Video className="h-8 w-8 text-purple-600 mr-3" />
                <h2
                  className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 ${pacifico.variable} font-pacifico`}
                >
                  ChalChitra
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                The world's leading marketplace for video editing services. Connect with talented creators and bring
                your vision to life.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="flex-1 max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
              <p className="text-gray-600 mb-4 text-md">
                Get the latest updates on new features and video editing trends.
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 mb-12">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-purple-600  transition-colors duration-200 text-md leading-relaxed hover:underline"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <Video className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900">ChalChitra</span>
            </div>
            <p className="text-gray-500 text-sm">© ChalChitra International Ltd. 2025. All rights reserved.</p>
          </div>

          {/* Social Links and Back to Top */}
          <div className="flex items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <IconComponent size={18} />
                  </a>
                )
              })}
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8 text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Accessibility
            </Link>
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
