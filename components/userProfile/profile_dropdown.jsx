'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/app/(nav2)/context/AuthContext';
import {
  User,
  UserCheck,
  Users,
  Settings,
  CreditCard,
  Globe,
  DollarSign,
  LogOut,
  Star,
  ChevronDown,
} from 'lucide-react';

const UserProfileDropdown = ({
  userData,
  activeRole,
  onLogout,
}) => {
  const initials = userData.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const handleNavigation = (type) => {
    console.log("inside handleNavigation");
    // Navigation logic here
  };

  const {handleSwitch ,user }  = useAuth();

  console.log(activeRole,"activeROle")
  console.log(userData ,"user from usercontext");
  console.log(user , "user from useauth")


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 sm:w-72 p-0 shadow-lg border border-gray-200 bg-white rounded-lg max-h-[80vh] overflow-y-auto"
        sideOffset={8}
      >
        {/* Profile Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback className="bg-gray-600 text-white font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{userData.name}</h3>
              <p className="text-sm text-gray-500 truncate">{userData.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                  {userData.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{userData.rating}</span>
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
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Switch to { activeRole === "buyer" ? "seller" : "buyer"}
          </Button>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <Link href={activeRole === "buyer" ? "user/buyer/profile/view" : "user/seller/profile/edit"} passHref>
            <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
              <User className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-gray-700">Profile</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem 
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => handleNavigation('/refer')}
          >
            <Users className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">Refer a friend</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => handleNavigation('/settings')}
          >
            <Settings className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => handleNavigation('/billing')}
          >
            <CreditCard className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">Billing & payments</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Language and Currency */}
        <div className="py-1">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-gray-700">English</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <DollarSign className="h-4 w-4 mr-3 text-gray-500" />
            <span className="text-gray-700">USD</span>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <div className="py-1">
          <DropdownMenuItem 
            className="px-4 py-3 text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;