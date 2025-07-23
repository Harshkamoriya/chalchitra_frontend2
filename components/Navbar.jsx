'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import Auth_modal from './Auth_modal';
import { useAuth } from '@/app/(nav2)/context/AuthContext';
import MessageDropdown from './messages/MessageDropdown';
import NotificationDropdown from './notifications/NotificationDropdown';
import { useUserContext } from '@/app/(nav2)/context/UserContext';
import UserProfileDropdown from './userProfile/profile_dropdown';


const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const { user, logout, handleSwitch, activeRole } = useAuth();
  const { userData } = useUserContext();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();



  // Lock body scroll when mobile menu is open
  useLockBodyScroll(isMobileMenuOpen);

  // Mock data for notifications and messages
  const unreadCount = { messages: 2, notifications: 3 };

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    setShowMobileProfile(false);
  }, []);

  const handleAuthClick = useCallback((mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  }, []);

  const getInitials = useCallback((name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';
  }, []);

  const handleMobileProfileToggle = useCallback(() => {
    setShowMobileProfile((prev) => !prev);
  }, []);

  const handleMobileNavigation = useCallback(
    (path) => {
      setIsMobileMenuOpen(false);
      setShowMobileProfile(false);
      router.push(path);
    },
    [router]
  );

  const handleMobileSwitchToBuying = useCallback(() => {
    handleSwitch();
    setIsMobileMenuOpen(false);
    setShowMobileProfile(false);
  }, [handleSwitch]);

  const handleMobileLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
    setShowMobileProfile(false);
  }, [logout]);

  const isLoggedIn = !!user;

  // Fallback user data with proper rating handling
  const safeUserData = {
    name: userData?.name || user?.name || 'User',
    email: userData?.email || user?.email || 'user@example.com',
    avatar: userData?.avatar || user?.image || '/placeholder.svg',
    level: userData?.sellerLevel || user?.sellerLevel || 'New',
    rating: userData?.rating?.average?.toFixed(1) || user?.rating?.average?.toFixed(1) || '0.0',
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-nowrap">
              <img
                src="/logo.jpg"
                alt="Logo"
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
                  aria-label="Search services"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="cursor-pointer px-3 py-1 rounded-md transition-colors group">
                <Link href="/become_seller">
                  <p className="text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-200 font-medium">
                    Become a Seller
                  </p>
                </Link>
              </div>

              {!isLoggedIn ? (
                <>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-base"
                  >
                    About
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium text-base px-4 py-2"
                    onClick={() => handleAuthClick('signin')}
                    aria-label="Login"
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 font-medium text-base"
                    onClick={() => handleAuthClick('signup')}
                    aria-label="Join"
                  >
                    Join
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setIsMessageOpen(true)}
                      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Open messages"
                    >
                      <MessageCircle className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
                      {unreadCount.messages > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount.messages > 99 ? '99+' : unreadCount.messages}
                        </span>
                      )}
                    </button>
                    <MessageDropdown isOpen={isMessageOpen} setIsOpen={setIsMessageOpen} />
                  </div>

                  <div className="relative cursor-pointer">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Open notifications"
                    >
                      <Bell className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
                      {unreadCount.notifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount.notifications > 99 ? '99+' : unreadCount.notifications}
                        </span>
                      )}
                    </button>
                    <NotificationDropdown isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
                  </div>

                  <Link href="/favorites">
                    <Heart className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" aria-label="Favorites" />
                  </Link>

                  <div className="cursor-pointer px-3 py-1 rounded-md transition-colors group">
                    <Link href="/earning-mode">
                      <p className="text-gray-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-200 font-medium">
                        Start Earning
                      </p>
                    </Link>
                  </div>

                  <UserProfileDropdown userData={safeUserData} activeRole={activeRole} onLogout={logout} />
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                aria-label="Search services"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                  >
                    <Info className="h-5 w-5" />
                    <span>About</span>
                  </Link>
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      onClick={() => handleAuthClick('signin')}
                      aria-label="Login"
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => handleAuthClick('signup')}
                      aria-label="Join"
                    >
                      Join Now
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {!showMobileProfile ? (
                    <>
                      <div
                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        onClick={handleMobileProfileToggle}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border-2 border-gray-200 shadow-sm">
                            <AvatarImage src={safeUserData.avatar} alt={safeUserData.name} />
                            <AvatarFallback className="bg-gray-700 text-white font-medium">
                              {getInitials(safeUserData.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{safeUserData.name}</p>
                            <p className="text-sm text-gray-500">View Profile</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <div
                            className="flex items-center space-x-3"
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                          >
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Notifications</span>
                            <NotificationDropdown isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
                          </div>
                        </div>

                        <div
                          className="flex items-center justify-between py-2"
                          onClick={() => setIsMessageOpen(!isMessageOpen)}
                        >
                          <div className="flex items-center space-x-3">
                            <MessageCircle className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Messages</span>
                            <MessageDropdown isOpen={isMessageOpen} setIsOpen={setIsMessageOpen} />
                          </div>
                        </div>

                        <Link
                          href="/favorites"
                          className="flex items-center space-x-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          <Heart className="h-5 w-5" />
                          <span>Favorites</span>
                        </Link>

                        <Link
                          href="/become_seller"
                          className="flex items-center space-x-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          <Users className="h-5 w-5" />
                          <span>Become a Seller</span>
                        </Link>

                        <Link
                          href="/earning-mode"
                          className="flex items-center space-x-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          <DollarSign className="h-5 w-5" />
                          <span>Start Earning</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div
                        className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        onClick={handleMobileProfileToggle}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-600 transform rotate-90" />
                        <span className="text-gray-700 font-medium">Back</span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-gray-200 shadow-sm">
                            <AvatarImage src={safeUserData.avatar} alt={safeUserData.name} />
                            <AvatarFallback className="bg-gray-700 text-white font-semibold">
                              {getInitials(safeUserData.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate text-base text-gray-900">
                              {safeUserData.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{safeUserData.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border-gray-200"
                              >
                                {safeUserData.level}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium text-gray-700">
                                  {safeUserData.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleMobileSwitchToBuying}
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-lg shadow-sm transition-all duration-200"
                        aria-label={`Switch to ${activeRole === 'buyer' ? 'seller' : 'buyer'} role`}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Switch to {activeRole === 'buyer' ? 'seller' : 'buyer'}
                      </Button>

                      <div className="space-y-2">
                        <div
                          className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleMobileNavigation(activeRole === 'buyer' ? '/user/buyer/profile/view' : '/user/seller/profile/view')}
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
  );
};

export default Navbar;