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
import { useAuth } from '@/app/(nav2)/context/AuthContext';
import { useUserContext } from '@/app/(nav2)/context/UserContext';

// Custom hook to lock/unlock body scroll
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

const UserProfileDropdown = ({ userData = {}, activeRole = 'buyer', onLogout = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleSwitch } = useAuth();
  const router = useRouter();

  // Fallback for missing user data
  const safeUserData = {
    name: userData.name || 'User',
    email: userData.email || 'user@example.com',
    avatar: userData.avatar || '/placeholder.svg',
    level: userData.level || 'New',
    rating: userData.rating || '0.0',
  };

const initials = safeUserData.name
  .split(' ')
  .map((name) => name[0])
  .join('')
  .toUpperCase()
  .slice(0, 2);


  // Memoized navigation handler
  const handleNavigation = useCallback((path) => {
    router.push(path);
  }, [router]);

  // Lock body scroll when dropdown is open
  useLockBodyScroll(isOpen);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Open user profile menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={safeUserData.avatar} alt={safeUserData.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 sm:w-72 p-0 shadow-lg border border-gray-200 bg-white rounded-lg max-h-[80vh] overflow-y-auto z-[1000]"
        sideOffset={8}
        role="menu"
      >
        {/* Profile Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={safeUserData.avatar} alt={safeUserData.name} />
              <AvatarFallback className="bg-gray-600 text-white font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{safeUserData.name}</h3>
              <p className="text-sm text-gray-500 truncate">{safeUserData.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                  {safeUserData.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{safeUserData.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <div className="p-3 border-b border-gray-100">
          <Button
            onClick={handleSwitch}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-sm"
            aria-label={`Switch to ${activeRole === 'buyer' ? 'seller' : 'buyer'} role`}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Switch to {activeRole === 'buyer' ? 'seller' : 'buyer'}
          </Button>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <Link href={activeRole === 'buyer' ? '/user/buyer/profile/view' : '/seller/profile/edit'} passHref>
            <DropdownMenuItem
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
              role="menuitem"
            >
              <User className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-gray-700">Profile</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => handleNavigation('/refer')}
            role="menuitem"
          >
            <Users className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">Refer a friend</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => handleNavigation('/settings')}
            role="menuitem"
          >
            <Settings className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => handleNavigation('/billing')}
            role="menuitem"
          >
            <CreditCard className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">Billing & payments</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Language and Currency */}
        <div className="py-1">
          <DropdownMenuItem
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
            role="menuitem"
          >
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-gray-700">English</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
            role="menuitem"
          >
            <DollarSign className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">USD</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <div className="py-1">
          <DropdownMenuItem
            className="px-4 py-3 text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            onClick={onLogout}
            role="menuitem"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown