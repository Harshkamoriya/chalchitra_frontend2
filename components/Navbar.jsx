"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";
import TopNavbar from "./topnavbar";
import UserProfileDropdown from "./userProfile/profile_dropdown";
import {
  Search,
  Menu,
  X,
  Bell,
  MessageCircle,
  Heart,
  Home,
  Info,
  LogOut,
  User,
  Users,
  Settings,
  CreditCard,
  Globe,
  DollarSign,
  Star,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Cookie,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Auth_modal from "./Auth_modal";
import Link from "next/link";
import { useAuth } from "@/app/(nav2)/context/AuthContext";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const { user, logout } = useAuth();
  const [prevUser, setPrevUser] = useState(null);

  useEffect(() => {
    if (user && !prevUser) {
      setShowAuthModal(false);
    }
    setPrevUser(user);
  }, [user, prevUser]);

  console.log("user",user)
  console.log(prevUser,"prevUser");

 

  const mockNotifications = 3;
  const mockMessages = 2;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowMobileProfile(false); // Reset profile view when closing menu
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleMobileProfileToggle = () => {
    setShowMobileProfile(!showMobileProfile);
  };

  const handleMobileNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    setIsMobileMenuOpen(false);
    setShowMobileProfile(false);
  };

  const handleMobileSwitchToBuying = () => {
    console.log("Switched to buyer mode");
    setIsMobileMenuOpen(false);
    setShowMobileProfile(false);
  };

  const handleMobileLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowMobileProfile(false);
  };

  console.log(user, "user");

  const isLoggedIn = !!user;

  // const role = Cookies.get("currentRole"); // ✅ Correct usage

  // if(role === "seller"){
  //   return <TopNavbar/>
  // }

  return(
  <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-nowrap">
              <img
                src="/logo.jpg"
                alt="logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-3xl font-extrabold text-gray-600"></span>
            </div>

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

            <div className="hidden md:flex items-center space-x-6">
              <div className="cursor-pointer px-3 py-1 rounded-md transition-colors group">
                <Link href="/become_seller">
                  <p className="text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-200">
                    Become a Seller
                  </p>
                </Link>
              </div>

              {!isLoggedIn ? (
                <>
                  <a
                    href="/about"
                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
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

                  <div className="cursor-pointer px-3 py-1 rounded-md transition-colors group">
                    <Link href="/earning-mode">
                      <p className="text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-200">
                        Start Earning
                      </p>
                    </Link>
                  </div>

                  {/* Desktop Profile Dropdown */}
                  <UserProfileDropdown
                    userData={{
                      name: user?.name || "User",
                      email: user?.email || "",
                      role:user?.role||"buyer",
                      avatar: user?.avatar || "/placeholder.svg",
                      level: user?.level || "Level 1",
                      rating: user?.rating || 5,
                    }}
                    onSwitchToBuying={() => {
                      console.log("Switched to buyer mode");
                    }}
                    onLogout={logout}
                  />
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

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
                <>
                  {/* Mobile Profile Section */}
                  {!showMobileProfile ? (
                    <>
                      {/* Profile Header - Clickable */}
                      <div 
                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        onClick={handleMobileProfileToggle}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border-2 border-gray-200 shadow-sm">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                            <AvatarFallback className="bg-gray-700 text-white font-medium">
                              {getInitials(user?.name || "User")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.name}
                            </p>
                            <p className="text-sm text-gray-500">View Profile</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      {/* Quick Actions */}
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Notifications</span>
                          </div>
                          {mockNotifications > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {mockNotifications}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <MessageCircle className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Messages</span>
                          </div>
                          {mockMessages > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {mockMessages}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 py-2">
                          <Heart className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-700">Favorites</span>
                        </div>

                        <Link href="/become_seller" className="flex items-center space-x-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                          <Users className="h-5 w-5" />
                          <span>Become a Seller</span>
                        </Link>

                        <Link href="/earning-mode" className="flex items-center space-x-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                          <DollarSign className="h-5 w-5" />
                          <span>Start Earning</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mobile Profile Dropdown Content */}
                      <div className="space-y-4">
                        {/* Back Button */}
                        <div 
                          className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                          onClick={handleMobileProfileToggle}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-600 transform rotate-90" />
                          <span className="text-gray-700 font-medium">Back</span>
                        </div>

                        {/* Profile Header */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-gray-200 shadow-sm">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                              <AvatarFallback className="bg-gray-700 text-white font-semibold">
                                {getInitials(user?.name || "User")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate text-base text-gray-900">{user?.name}</p>
                              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border-gray-200">
                                  {user?.level || "Level 1"}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-gray-700">{user?.rating || 5}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Switch to Buying Button */}
                        <Button 
                          onClick={handleMobileSwitchToBuying}
                          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 rounded-lg shadow-sm transition-all duration-200"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Switch to Buying
                        </Button>

                        {/* Menu Items */}
                        <div className="space-y-2">
                          <div 
                            className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleMobileNavigation('/profile')}
                          >
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">Profile</span>
                          </div>

                          <div 
                            className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleMobileNavigation('/refer')}
                          >
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">Refer a friend</span>
                          </div>

                          <div 
                            className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleMobileNavigation('/settings')}
                          >
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <Settings className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">Settings</span>
                          </div>

                          <div 
                            className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleMobileNavigation('/billing')}
                          >
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <CreditCard className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">Billing and payments</span>
                          </div>
                        </div>

                        {/* Language and Currency */}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                          <div className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-gray-100 rounded-lg">
                                <Globe className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-sm text-gray-900">English</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </div>

                          <div className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <DollarSign className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-sm text-gray-900">USD</span>
                          </div>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200 pt-4">
                          <div 
                            className="flex items-center gap-3 py-3 px-3 hover:bg-red-50 rounded-lg cursor-pointer transition-colors text-red-600"
                            onClick={handleMobileLogout}
                          >
                            <div className="p-1.5 bg-red-50 rounded-lg">
                              <LogOut className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="font-medium">Logout</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <Auth_modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>

    )
};

export default Navbar;