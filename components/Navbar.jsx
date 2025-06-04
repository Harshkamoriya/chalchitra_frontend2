"use client"

import { useEffect, useState } from "react"
import { Pacifico } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Menu, X, Bell, MessageCircle, Heart, Home, Info, Video, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthModal } from "./AuthModal"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Auth_modal from "./Auth_modal"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [onClose , setOnClose] = useState(() => () => setShowAuthModal(false))
  const [authMode, setAuthMode] = useState("signin")
  const { data: session, status } = useSession()

  useEffect(()=>{
    // console.log(data , "session data")
    console.log("session  " ,session)
  })

  // Mock notification data - replace with real data
  const mockNotifications = 3
  const mockMessages = 2

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    
    await signOut({ callbackUrl: "/" })
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isLoggedIn = status === "authenticated" && session

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Video className="h-8 w-8 text-purple-600 mr-2" />
                <span
                  className={cn(
                    "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600",
                    pacifico.className,
                  )}
                >
                  VideoHub
                </span>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for video editing services..."
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {!isLoggedIn ? (
                // Not logged in state
                <>
                  <a href="/about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                    About
                  </a>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                    onClick={() => handleAuthClick("signin")}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
                    onClick={() => handleAuthClick("signup")}
                  >
                    Join
                  </Button>
                </>
              ) : (
                // Logged in state
                <>
                  <div className="relative">
                    <Bell className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
                    {mockNotifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                        {mockNotifications}
                      </Badge>
                    )}
                  </div>

                  <div className="relative">
                    <MessageCircle className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
                    {mockMessages > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                        {mockMessages}
                      </Badge>
                    )}
                  </div>

                  <Heart className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image || "/placeholder.svg"}
                            alt="Profile"
                            className="h-8 w-8 rounded-full border-2 border-gray-300"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-medium">
                            {getInitials(session?.user?.name || "User")}
                          </div>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{session?.user?.name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{session?.user?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="text-gray-700">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {!isLoggedIn ? (
                // Not logged in mobile menu
                <>
                  <a
                    href="/"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </a>
                  <a
                    href="/about"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                  >
                    <Info className="h-5 w-5" />
                    <span>About</span>
                  </a>
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={() => handleAuthClick("signin")}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => handleAuthClick("signup")}
                    >
                      Join Now
                    </Button>
                  </div>
                </>
              ) : (
                // Logged in mobile menu
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-medium">
                        {getInitials(session?.user?.name || "User")}
                      </div>
                    <div>
                      <p className="font-medium text-gray-900">{session?.user?.name}</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">Notifications</span>
                      </div>
                      {mockNotifications > 0 && <Badge className="bg-red-500 text-white">{mockNotifications}</Badge>}
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">Messages</span>
                      </div>
                      {mockMessages > 0 && <Badge className="bg-red-500 text-white">{mockMessages}</Badge>}
                    </div>

                    <div className="flex items-center space-x-3 py-2">
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">Favorites</span>
                    </div>

                    <Button variant="outline" className="w-full mt-4" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <Auth_modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode={authMode} />
    </>
  )
}

export default Navbar
