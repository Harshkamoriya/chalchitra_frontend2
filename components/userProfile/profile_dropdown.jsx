import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
  onSwitchToBuying,
  onLogout,
}) => {
  const initials = userData.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

// const router = useRouter();
const handleNavigation = (type) => {
    console.log("inside handleNavigation");
//   if (type === "profile") {
//     if (userData.role === "buyer") {
//       router.push("/buyer/profile/view");
//     } else if (userData.role === "seller") {
//       router.push("/seller/profile/edit");
//     }
//   } else {
//     // for other paths
//     router.push(type);
  
};

  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:scale-105 transition-all duration-200 hover:shadow-md"
        >
          <Avatar className="h-9 w-9 border-2 border-white shadow-lg ring-2 ring-gray-100">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="bg-gray-700 text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border border-gray-200 bg-white">
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
              <p className="font-semibold truncate text-base text-gray-900">{userData.name}</p>
              <p className="text-sm text-gray-600 truncate">{userData.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border-gray-200">
                  {userData.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">{userData.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Switch to Buying Button */}
        <div className="p-4 border-b border-gray-200">
          <Button 
            onClick={onSwitchToBuying}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Switch to Buying
          </Button>
        </div>

        {/* Menu Items */}
        <div className="py-2">
         <Link href={userData.role === "buyer" ? "user/buyer/profile/view" : "user/seller/profile/edit"} passHref>
  <DropdownMenuItem className="mx-2 rounded-lg cursor-pointer hover:bg-gray-50">
    <div className="flex items-center gap-3 py-3 px-3 w-full">
      <div className="p-1.5 bg-gray-100 rounded-lg">
        <User className="h-4 w-4 text-gray-600" />
      </div>
      <span className="font-medium text-gray-900">Profile</span>
    </div>
  </DropdownMenuItem>
</Link>


          <DropdownMenuItem 
            className="mx-2 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation('/refer')}
          >
            <div className="flex items-center gap-3 py-3 px-3 w-full">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Refer a friend</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="mx-2 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation('/settings')}
          >
            <div className="flex items-center gap-3 py-3 px-3 w-full">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Settings</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="mx-2 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleNavigation('/billing')}
          >
            <div className="flex items-center gap-3 py-3 px-3 w-full">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <CreditCard className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Billing and payments</span>
            </div>
          </DropdownMenuItem>
        </div>

        {/* Language and Currency Section */}
        <div className="border-t border-gray-200 py-2">
          <div className="flex items-center justify-between mx-4 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Globe className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium text-sm text-gray-900">English</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>

          <div className="flex items-center gap-3 mx-4 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <span className="font-medium text-sm text-gray-900">USD</span>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 p-2">
          <DropdownMenuItem 
            className="mx-2 rounded-lg text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer py-3 px-3"
            onClick={onLogout}
          >
            <div className="p-1.5 bg-red-50 rounded-lg mr-3">
              <LogOut className="h-4 w-4 text-red-600" />
            </div>
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;