
"use client"

import { useState } from "react"
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
  X,
  Star,
  CreditCard,
  Globe,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/(nav2)/context/AuthContext"

const navigationItems = [
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    description: "View your messages",
    badge: 3, // Unread messages count
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "View notifications",
    badge: 5, // Unread notifications count
  },
]

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

// Update the viewItems array to remove Dashboard
const viewItems = [
  {
    name: "Analytics",
    href: "/seller/view/analytics",
    icon: BarChart3,
    description: "View performance metrics",
  },
  {
    name: "Earnings",
    href: "seller/view/earnings",
    icon: DollarSign,
    description: "Track your income and payments",
  },
]

// Mock user data - replace with actual user data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: null, // Set to image URL if available
}

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const {getRole} = useAuth();
  const {handleSwitch , activeRole} = useAuth();
  
  console.log(activeRole , "active role in topnavbar")

  const NavItem = ({ item, isMobile = false, showBadge = true }) => {
    const isActive = pathname === item.href

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
          "hover:bg-gray-50 hover:text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-gray-200",
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900",
          isMobile ? "w-full justify-start py-3 px-4" : "px-3 py-2",
        )}
        onClick={() => isMobile && setIsOpen(false)}
      >
        <item.icon className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
        {isMobile && <span>{item.name}</span>}
        {showBadge && item.badge && item.badge > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "text-xs min-w-5 h-5 flex items-center justify-center p-0 bg-red-500",
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
        <TooltipContent>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  const ProfileDropdown = ({ isMobile = false }) => {
    const initials = userData.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()

    if (isMobile) {
      return (
        <div className="space-y-1 border-t pt-4">
          {/* Mobile Profile Header */}
          <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-lg mx-4">
            <Avatar className="h-12 w-12 border-2 border-gray-200 shadow-sm">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback className="bg-gray-700 text-white font-medium text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-base">{userData.name}</p>
              <p className="text-sm text-gray-500 truncate">{userData.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Level 1 Seller
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">4.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Switch to Buying Button */}
          <div className="px-4 py-2">
            
              <Button onClick={handleSwitch} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg">
                <UserCheck className="h-4 w-4 mr-2" />
                Switch to {activeRole === "buyer" ? "seller" :"buyer"}
              </Button>
           
          </div>

          {/* Menu Items */}
          <div className="space-y-1 px-2">
            <Link
              href="/seller/profile/edit"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Profile</span>
            </Link>
            <Link
              href="/refer"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Refer a friend</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Settings</span>
            </Link>
            <Link
              href="/billing"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Billing and payments</span>
            </Link>
          </div>

          {/* Language and Currency */}
          <div className="px-4 py-2 border-t mt-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">English</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 py-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">USD</span>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 pb-4">
            <button className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left rounded-lg">
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback className="bg-gray-700 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 p-0 shadow-lg border border-gray-200 bg-white">
          {/* Profile Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-gray-200 shadow-sm">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback className="bg-gray-700 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-base">{userData.name}</p>
                <p className="text-sm text-gray-600 truncate">{userData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Level 1 Seller
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Switch to Buying Button */}
          <div className="p-4 border-b border-gray-200">
            <Button onClick={handleSwitch} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg">
              <UserCheck className="h-4 w-4 mr-2" />
              Switch to {activeRole === "buyer" ? "seller" : "buyer"}
            </Button>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <DropdownMenuItem asChild className="mx-2 rounded-lg">
              <Link
                href="/profile"
                className="flex items-center gap-3 cursor-pointer py-3 px-3 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="mx-2 rounded-lg">
              <Link
                href="/refer"
                className="flex items-center gap-3 cursor-pointer py-3 px-3 hover:bg-gray-50 transition-colors"
              >
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Refer a friend</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="mx-2 rounded-lg">
              <Link
                href="/settings"
                className="flex items-center gap-3 cursor-pointer py-3 px-3 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="mx-2 rounded-lg">
              <Link
                href="/billing"
                className="flex items-center gap-3 cursor-pointer py-3 px-3 hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Billing and payments</span>
              </Link>
            </DropdownMenuItem>
          </div>

          {/* Language and Currency Section */}
          <div className="border-t border-gray-200 py-2">
            <div className="flex items-center justify-between mx-4 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">English</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-3 mx-4 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm">USD</span>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 p-2">
            <DropdownMenuItem className="mx-2 rounded-lg text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer py-3 px-3">
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const ManageDropdown = ({ isMobile = false }) => {
    const hasActiveManageItem = manageItems.some((item) => pathname === item.href)

    if (isMobile) {
      return (
        <div className="space-y-1">
          <div className="px-4 py-2 text-sm font-medium text-gray-500">Manage</div>
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
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-50 hover:text-gray-900",
                  "focus:outline-none focus:ring-2 focus:ring-gray-200",
                  hasActiveManageItem
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Package className="h-4 w-4" />
                <span>Manage</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Manage</p>
            <p className="text-xs text-gray-500">Orders and gigs</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-48">
          {manageItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <DropdownMenuItem key={item.name} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 w-full cursor-pointer",
                    isActive && "bg-gray-50 text-gray-900",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
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
    const hasActiveViewItem = viewItems.some((item) => pathname === item.href)

    if (isMobile) {
      return (
        <div className="space-y-1">
          <div className="px-4 py-2 text-sm font-medium text-gray-500">View</div>
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
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-50 hover:text-gray-900",
                  "focus:outline-none focus:ring-2 focus:ring-gray-200",
                  hasActiveViewItem
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">View</p>
            <p className="text-xs text-gray-500">Dashboard, analytics, and earnings</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-48">
          {viewItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <DropdownMenuItem key={item.name} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 w-full cursor-pointer",
                    isActive && "bg-gray-50 text-gray-900",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
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
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">
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
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "hover:bg-gray-50 hover:text-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-gray-200",
                        pathname === "/seller/dashboard"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900",
                      )}
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">Dashboard</p>
                    <p className="text-xs text-gray-500">Go to main dashboard</p>
                  </TooltipContent>
                </Tooltip>
                <ManageDropdown />
                <ViewDropdown />
              </nav>

              {/* Right Navigation - Icons and Profile */}
              <nav className="flex items-center gap-2">
                {navigationItems.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
                <ProfileDropdown />
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-50">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">Chalchitra</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2 pt-6 flex-1">
                    {navigationItems.map((item) => (
                      <NavItem key={item.name} item={item} isMobile />
                    ))}
                    <Link
                      href="/seller/dashboard"
                      className={cn(
                        "flex items-center gap-2 w-full justify-start py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                        "hover:bg-gray-50 hover:text-gray-900",
                        pathname === "/seller/dashboard"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <ManageDropdown isMobile />
                    <ViewDropdown isMobile />
                    <ProfileDropdown isMobile />
                  </nav>

                  {/* Mobile Footer */}
                  <div className="pt-6 border-t">
                    <p className="text-xs text-gray-500 text-center">© 2024 Chalchitra. All rights reserved.</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
