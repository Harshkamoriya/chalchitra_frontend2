
// "use client"
// // Updated App component with Socket Provider
// import React, { useState, useEffect } from 'react';
// import { SocketProvider } from '../context/SocketContext';
// import NotificationDropdown from '@/components/notifications/NotificationDropdown';
// import MessageDropdown from '@/components/messages/MessageDropdown';
// import { Bell, MessageCircle, Search, Menu, X, Heart, User } from 'lucide-react';

// // Mock user data - replace with actual auth
// const mockUser = {
//   _id: '507f1f77bcf86cd799439011',
//   name: 'John Doe',
//   email: 'john@example.com',
//   avatar: '/placeholder.svg'
// };

// function App() {
//   const [user, setUser] = useState(mockUser);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <SocketProvider user={user}>
//       <div className="min-h-screen bg-gray-50">
//         {/* Updated Navbar with Real-time Components */}
//         <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//               {/* Logo */}
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                   <span className="text-white font-bold text-lg">F</span>
//                 </div>
//                 <span className="ml-2 text-xl font-bold text-gray-900">Freelancer</span>
//               </div>

//               {/* Search Bar */}
//               <div className="hidden md:block flex-1 max-w-2xl mx-8">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <input
//                     type="text"
//                     placeholder="Search for services..."
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>

//               {/* Desktop Navigation */}
//               <div className="hidden md:flex items-center space-x-6">
//                 <a href="#" className="text-gray-700 hover:text-purple-600">
//                   Become a Seller
//                 </a>
                
//                 {/* Real-time Notification Dropdown */}
//                 <NotificationDropdown />
                
//                 {/* Real-time Message Dropdown */}
//                 <MessageDropdown />
                
//                 <Heart className="h-6 w-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
                
//                 {/* User Profile */}
//                 <div className="flex items-center space-x-2">
//                   <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                     <User className="h-4 w-4 text-gray-600" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-900">{user.name}</span>
//                 </div>
//               </div>

//               {/* Mobile Menu Button */}
//               <div className="md:hidden">
//                 <button
//                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                   className="text-gray-700 hover:text-purple-600"
//                 >
//                   {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                 </button>
//               </div>
//             </div>

//             {/* Mobile Search */}
//             <div className="md:hidden pb-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search services..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {isMobileMenuOpen && (
//             <div className="md:hidden border-t border-gray-200 bg-white">
//               <div className="px-4 py-4 space-y-4">
//                 <div className="flex items-center justify-around">
//                   <NotificationDropdown />
//                   <MessageDropdown />
//                   <Heart className="h-6 w-6 text-gray-600" />
//                 </div>
//                 <div className="space-y-2">
//                   <a href="#" className="block text-gray-700 hover:text-purple-600">
//                     Become a Seller
//                   </a>
//                   <a href="#" className="block text-gray-700 hover:text-purple-600">
//                     Profile
//                   </a>
//                   <a href="#" className="block text-gray-700 hover:text-purple-600">
//                     Settings
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </nav>

//         {/* Main Content */}
//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//               Real-time Notifications & Messaging
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Click on the notification bell or message icon to test the real-time features
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//               <div className="bg-white p-6 rounded-lg shadow-md">
//                 <Bell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Real-time Notifications</h3>
//                 <p className="text-gray-600">
//                   Get instant notifications for orders, messages, ratings, and system updates
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md">
//                 <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Real-time Messaging</h3>
//                 <p className="text-gray-600">
//                   Chat with clients and sellers in real-time with file sharing capabilities
//                 </p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </SocketProvider>
//   );
// }

// export default App;

// 'use client';
// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// let socket; // outside to keep ref

// export default function HomePage() {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Connect to backend server
//     socket = io('http://localhost:4000');

//     socket.on('connect', () => {
//       console.log('✅ Connected to backend:', socket.id);
//     });

//     socket.on('chat message', (msg) => {
//       console.log('📩 Received message:', msg);
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim()) {
//       socket.emit('chat message', input);
//       setInput('');
//     }
//   };

//   return (
//     <main style={{ padding: 20 }}>
//       <h1>🧩 Next.js + Socket.IO Demo</h1>
//       <div style={{ marginBottom: 10 }}>
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//       <div>
//         <h3>Messages:</h3>
//         {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
//       </div>
//     </main>
//   );
// }

"use client"
import MessageDropdown from '@/components/messages/MessageDropdown'
import React from 'react'
import { SocketProvider } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import NotificationDropdown from '@/components/notifications/NotificationDropdown'


const page = () => {

  const token = sessionStorage.getItem("accessToken")
  const {user} = useAuth();
  console.log(user , "user")
  const userId = user?.id;
  return (
    <div>
              <SocketProvider user={userId}>
              <MessageDropdown/>
              <NotificationDropdown/>
              </SocketProvider>
    </div>
  )
}

export default page
