"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronDown,
  DollarSign,
  Eye,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  User,
  UserCheck,
  Users,
  Star,
  CreditCard,
  Globe,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/(nav2)/context/AuthContext"
import { useUserContext } from "@/app/(nav2)/context/UserContext"
import NotificationDropdown from "./notifications/NotificationDropdown"
import MessageDropdown from "./messages/MessageDropdown"

const manageItems = [
  {
    name: "Orders",
    href: "/seller/manage/orders",
    icon: ShoppingBag,
    description: "View and manage your orders",
  },
  {
    name: "Gigs",
    href: "/seller/manage/gigs",
    icon: Package,
    description: "Manage your service offerings",
  },
]

const viewItems = [
  {
    name: "Analytics",
    href: "/seller/view/analytics",
    icon: BarChart3,
    description: "View performance metrics",
  },
  {
    name: "Earnings",
    href: "/seller/view/earnings",
    icon: DollarSign,
    description: "Track your income and payments",
  },
]

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)

  const pathname = usePathname()
  const { handleSwitch, activeRole } = useAuth()
  const { userData } = useUserContext()

  // Mock unread counts - replace with actual data from context
  const unreadNotifications = 3
  const unreadMessages = 7

  // Memoize handlers to prevent re-renders
  const handleNotificationToggle = useCallback(() => {
    setIsNotificationOpen((prev) => !prev)
  }, [])

  const handleMessageToggle = useCallback(() => {
    setIsMessageOpen((prev) => !prev)
  }, [])

  const handleMobileMenuClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Memoize user initials
  const userInitials = useMemo(() => {
    return (
      userData?.name
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase() || "U"
    )
  }, [userData?.name])

  const NavItem = ({ item, isMobile = false, showBadge = true }) => {
    const isActive = pathname === item.href

    const handleClick = useCallback(() => {
      if (isMobile) {
        handleMobileMenuClose()
      }
    }, [isMobile])

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
          isActive
            ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200"
            : "text-gray-600 hover:text-blue-700",
          isMobile ? "w-full justify-start py-4 px-4" : "px-4 py-2.5",
        )}
        onClick={handleClick}
      >
        <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isMobile && "h-5 w-5")} />
        {isMobile && <span className="font-medium">{item.name}</span>}
        {showBadge && item.badge && item.badge > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "text-xs min-w-5 h-5 flex items-center justify-center p-0 bg-red-500 animate-pulse",
              isMobile ? "ml-auto" : "absolute -top-1 -right-1",
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}
      </Link>
    )

    if (isMobile) {
      return linkContent
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-gray-300">{item.description}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  const NotificationButton = ({ isMobile = false }) => {
    const buttonContent = (
      <Button
        variant="ghost"
        className={cn(
          "relative transition-all duration-200 group",
          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
          isNotificationOpen && "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm",
          isMobile ? "w-full justify-start py-4 px-4 h-auto rounded-xl" : "px-4 py-2.5 h-11 rounded-xl",
        )}
        onClick={handleNotificationToggle}
      >
        <Bell className={cn("h-4 w-4 transition-transform group-hover:scale-110", isMobile && "h-5 w-5")} />
        {isMobile && <span className="ml-3 font-medium">Notifications</span>}
        {unreadNotifications > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "text-xs min-w-5 h-5 flex items-center justify-center p-0 bg-red-500 animate-pulse",
              isMobile ? "ml-auto" : "absolute -top-1 -right-1",
            )}
          >
            {unreadNotifications > 99 ? "99+" : unreadNotifications}
          </Badge>
        )}
      </Button>
    )

    if (isMobile) {
      return buttonContent
    }

    return (
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">Notifications</p>
            <p className="text-xs text-gray-300">View your notifications</p>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  const MessageButton = ({ isMobile = false }) => {
    const buttonContent = (
      <Button
        variant="ghost"
        className={cn(
          "relative transition-all duration-200 group",
          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
          isMessageOpen && "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm",
          isMobile ? "w-full justify-start py-4 px-4 h-auto rounded-xl" : "px-4 py-2.5 h-11 rounded-xl",
        )}
        onClick={handleMessageToggle}
      >
        <MessageSquare className={cn("h-4 w-4 transition-transform group-hover:scale-110", isMobile && "h-5 w-5")} />
        {isMobile && <span className="ml-3 font-medium">Messages</span>}
        {unreadMessages > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "text-xs min-w-5 h-5 flex items-center justify-center p-0 bg-red-500 animate-pulse",
              isMobile ? "ml-auto" : "absolute -top-1 -right-1",
            )}
          >
            {unreadMessages > 99 ? "99+" : unreadMessages}
          </Badge>
        )}
      </Button>
    )

    if (isMobile) {
      return buttonContent
    }

    return (
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">Messages</p>
            <p className="text-xs text-gray-300">View your messages</p>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  const MobileProfileSection = () => {
    return (
      <div className="space-y-4 p-6 border-b bg-white">
        {/* Mobile Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <Avatar className="h-14 w-14 border-3 border-white shadow-lg ring-2 ring-blue-200">
            <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate text-lg text-gray-900">{userData?.name || "User"}</p>
            <p className="text-sm text-gray-600 truncate">{userData?.email || "user@example.com"}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                Level 1 Seller
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-gray-700">4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Role Button */}
        <Button
          onClick={handleSwitch}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          <UserCheck className="h-5 w-5 mr-3" />
          Switch to {activeRole === "buyer" ? "seller" : "buyer"}
        </Button>
      </div>
    )
  }

  const MobileMenuItems = () => {
    return (
      <div className="space-y-1 px-2">
        {[
          { href: "/seller/profile/edit", icon: User, label: "Profile" },
          { href: "/refer", icon: Users, label: "Refer a friend" },
          { href: "/settings", icon: Settings, label: "Settings" },
          { href: "/billing", icon: CreditCard, label: "Billing and payments" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-xl group"
            onClick={handleMobileMenuClose}
          >
            <item.icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-blue-700">{item.label}</span>
          </Link>
        ))}
      </div>
    )
  }

  const MobileLanguageSection = () => {
    return (
      <div className="px-2 py-2 border-t mt-4">
        <div className="flex items-center justify-between py-3 px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">English</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-3 py-3 px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 cursor-pointer">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">USD</span>
        </div>
      </div>
    )
  }

  const MobileLogoutSection = () => {
    return (
      <div className="px-2 pb-4">
        <button className="flex items-center gap-4 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full text-left rounded-xl group">
          <LogOut className="h-5 w-5 group-hover:text-red-600" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    )
  }

  const ProfileDropdown = ({ isMobile = false }) => {
    if (isMobile) {
      return null // Profile is now handled separately at the top
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-11 w-11 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-lg group"
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
              <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border border-gray-200 bg-white rounded-2xl">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 rounded-t-2xl">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-3 border-white shadow-lg ring-2 ring-blue-200">
                <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-xl text-gray-900">{userData?.name || "User"}</p>
                <p className="text-sm text-gray-600 truncate">{userData?.email || "user@example.com"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
                    Level 1 Seller
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-700">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Switch Role Button */}
          <div className="p-4 border-b border-gray-200">
            <Button
              onClick={handleSwitch}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Switch to {activeRole === "buyer" ? "seller" : "buyer"}
            </Button>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {[
              { href: "/profile", icon: User, label: "Profile" },
              { href: "/refer", icon: Users, label: "Refer a friend" },
              { href: "/settings", icon: Settings, label: "Settings" },
              { href: "/billing", icon: CreditCard, label: "Billing and payments" },
            ].map((item) => (
              <DropdownMenuItem key={item.href} asChild className="mx-2 rounded-xl">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 cursor-pointer py-3 px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                >
                  <item.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  <span className="font-medium text-gray-700 group-hover:text-blue-700">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>

          {/* Language and Currency Section */}
          <div className="border-t border-gray-200 py-2">
            <div className="flex items-center justify-between mx-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl px-3 cursor-pointer transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium text-sm text-gray-700 group-hover:text-blue-700">English</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex items-center gap-3 mx-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl px-3 cursor-pointer transition-all duration-200 group">
              <DollarSign className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium text-sm text-gray-700 group-hover:text-blue-700">USD</span>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 p-2">
            <DropdownMenuItem className="mx-2 rounded-xl text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer py-3 px-4 group">
              <LogOut className="h-4 w-4 mr-3 group-hover:text-red-700" />
              <span className="font-medium group-hover:text-red-700">Logout</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const ManageDropdown = ({ isMobile = false }) => {
    const hasActiveManageItem = useMemo(() => manageItems.some((item) => pathname === item.href), [pathname])

    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="px-4 py-2 text-sm font-bold text-gray-500 uppercase tracking-wide">Manage</div>
          {manageItems.map((item) => (
            <NavItem key={item.name} item={item} isMobile showBadge={false} />
          ))}
        </div>
      )
    }

    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
                  hasActiveManageItem
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200"
                    : "text-gray-600 hover:text-blue-700",
                )}
              >
                <Package className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Manage</span>
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">Manage</p>
            <p className="text-xs text-gray-300">Orders and gigs</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-56 shadow-xl border border-gray-200 rounded-2xl">
          {manageItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <DropdownMenuItem key={item.name} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 w-full cursor-pointer py-3 px-4 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50",
                  )}
                >
                  <item.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-700">{item.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-blue-600">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const ViewDropdown = ({ isMobile = false }) => {
    const hasActiveViewItem = useMemo(() => viewItems.some((item) => pathname === item.href), [pathname])

    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="px-4 py-2 text-sm font-bold text-gray-500 uppercase tracking-wide">View</div>
          {viewItems.map((item) => (
            <NavItem key={item.name} item={item} isMobile showBadge={false} />
          ))}
        </div>
      )
    }

    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
                  hasActiveViewItem
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200"
                    : "text-gray-600 hover:text-blue-700",
                )}
              >
                <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>View</span>
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">View</p>
            <p className="text-xs text-gray-300">Analytics and earnings</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-56 shadow-xl border border-gray-200 rounded-2xl">
          {viewItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <DropdownMenuItem key={item.name} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 w-full cursor-pointer py-3 px-4 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50",
                  )}
                >
                  <item.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-700">{item.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-blue-600">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors">
                Chalchitra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between flex-1 ml-8">
              {/* Left Navigation - Near Logo */}
              <nav className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/seller/dashboard"
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
                        pathname === "/seller/dashboard"
                          ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200"
                          : "text-gray-600 hover:text-blue-700",
                      )}
                    >
                      <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>Dashboard</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 text-white border-gray-700">
                    <p className="font-medium">Dashboard</p>
                    <p className="text-xs text-gray-300">Go to main dashboard</p>
                  </TooltipContent>
                </Tooltip>
                <ManageDropdown />
                <ViewDropdown />
              </nav>

              {/* Right Navigation - Icons and Profile */}
              <nav className="flex items-center gap-2">
                <MessageButton />
                <NotificationButton />
                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                <ProfileDropdown />
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
                  {/* Profile Section at Top */}
                  <MobileProfileSection />

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-3 p-6 flex-1 overflow-y-auto">
                    <MessageButton isMobile />
                    <NotificationButton isMobile />

                    <div className="h-px bg-gray-200 my-2"></div>

                    <Link
                      href="/seller/dashboard"
                      className={cn(
                        "flex items-center gap-3 w-full justify-start py-4 px-4 rounded-xl text-sm font-medium transition-all duration-200 group",
                        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm",
                        pathname === "/seller/dashboard"
                          ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200"
                          : "text-gray-600 hover:text-blue-700",
                      )}
                      onClick={handleMobileMenuClose}
                    >
                      <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    <ManageDropdown isMobile />
                    <ViewDropdown isMobile />

                    <div className="h-px bg-gray-200 my-2"></div>

                    <MobileMenuItems />
                    <MobileLanguageSection />
                    <MobileLogoutSection />
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-6 border-t bg-white">
                    <p className="text-xs text-gray-500 text-center font-medium">
                      © 2024 Chalchitra. All rights reserved.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Dropdowns */}
      {isNotificationOpen && <NotificationDropdown isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />}
      {isMessageOpen && <MessageDropdown isOpen={isMessageOpen} setIsOpen={setIsMessageOpen} />}
    </TooltipProvider>
  )
}
