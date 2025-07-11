
// 'use client';
// import { createContext, useContext, useEffect, useState ,useCallback  } from 'react';
// import io from 'socket.io-client';
// import { useAuth } from './AuthContext';

// // Create context
// const SocketContext = createContext();

// // Custom hook for using the context
// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return context;
// };

// // Provider
// export const SocketProvider = ({ children}) => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [messages , setMessages] = useState([]);
//   const [unreadCount, setUnreadCount] = useState({ notifications: 0, messages: 0 });
//   const [typingUsers, setTypingUsers] = useState({});

//   const {user} = useAuth();

//   const userId = user?.id; 
//   console.log(userId ,"userid in socketcontext")
//   console.log(process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL , "BACKEND SERVER BASE URL")

//   useEffect(() => {
//     if (!user?.id) return;
     
//     // Connect to backend Socket.IO server
//     const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL, {
//       query: { userId: user?.id }
//     });
//     setSocket(socketInstance);

//     // Handle connection status
//     socketInstance.on('connect', () => {
//       setIsConnected(true);
//       console.log('✅ Connected to Socket.IO server');
      
//       // Optional: join user's personal room
//       socketInstance.emit('join', user?.id);
//     });

//     socketInstance.on('disconnect', () => {
//       setIsConnected(false);
//       console.log('❌ Disconnected from Socket.IO server');
//     });

//     // Handle incoming notifications
//     socketInstance.on('newNotification', (notification) => {
//       console.log('📩 New notification:', notification);
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => ({ ...prev, notifications: prev.notifications + 1 }));
//     });

//     // Handle incoming messages
//     socketInstance.on('newMessage', (message) => {
//       console.log('💬 New message:', message);
//       setMessages(prev => [...prev, message]);
//       setUnreadCount(prev => ({ ...prev, messages: prev.messages + 1 }));
//         socket.emit('delivered', { messageId: message._id, senderId: message.sender });

//     });

//     socketInstance.on('typing', ({ conversationId, userId: typingUserId }) => {
//       setTypingUsers(prev => ({
//         ...prev,
//         [conversationId]: typingUserId
//       }));
//       setTimeout(() => {
//         setTypingUsers(prev => {
//           const copy = { ...prev };
//           delete copy[conversationId];
//           return copy;
//         });
//       }, 2000);
//     });

//      socketInstance.on('message-status', ({ messageId, status, readAt }) => {
//       setMessages(prev =>
//         prev.map(m => m._id === messageId ? { ...m, status, readAt } : m)
//       );
//     });



    
//     fetchConversations();

//     // Cleanup on unmount
//     return () => {
//       socketInstance.disconnect();
//       console.log('🧹 Socket disconnected on cleanup');
//     };
//   }, [user]);

  



//   // Fetch notifications from backend REST API
//   // const fetchNotifications = async () => {
//   //   try {
//   //     const response = await fetch('/api/notifications');
//   //     const data = await response.json();
//   //     setNotifications(data.notifications || []);
//   //     setUnreadCount(prev => ({ ...prev, notifications: data.unreadCount || 0 }));
//   //   } catch (error) {
//   //     console.error('❌ Error fetching notifications:', error);
//   //   }
//   // };

//   // Fetch messages / conversations
//    const fetchMessages = useCallback(async (conversationId) => {
//     try {
//       const res = await fetch(`/api/messages/${conversationId}`);
//       const data = await res.json();
//       if (data.success) {
//         setMessages(data.messages);
//       }
//     } catch (err) {
//       console.error("Failed to fetch messages:", err);
//     }
//   }, []);

//   const fetchConversations = async ( )=>{
//     try {
//       const response = await fetch(`/api/messages?userId=${userId}`);
//       const data = await response.json();
//       console.log(data,"data")
//       setConversations(data.conversations || []);
//       // setUnreadCount(prev => ({ ...prev, messages: data.unreadCount || 0 }));
//     } catch (error) {
//       console.error('❌ Error fetching conversations:', error);
//     }
//   }

//   // Mark notification as read
//   const markNotificationAsRead = async (notificationId) => {
//     try {
//       await fetch(`api/notifications/${notificationId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isRead: true })
//       });
//       setNotifications(prev =>
//         prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
//       );
//       setUnreadCount(prev => ({ ...prev, notifications: Math.max(0, prev.notifications - 1) }));
//     } catch (error) {
//       console.error('❌ Error marking notification as read:', error);
//     }
//   };

//   // Delete notification
//   const deleteNotification = async (notificationId) => {
//     try {
//       await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
//       setNotifications(prev => prev.filter(n => n._id !== notificationId));
//     } catch (error) {
//       console.error('❌ Error deleting notification:', error);
//     }
//   };

//   // Send message & emit to socket
//  const sendMessage = async (conversationId, content, senderId, receiverId, type = 'text', file = null, fileUrl) => {
//   try {
//     const formData = new FormData();
//     formData.append('conversationId', conversationId);
//     formData.append('content', content);
//     formData.append('senderId', senderId);
//     formData.append('receiverId', receiverId);
//     formData.append('type', type);
//     if (file) formData.append('file', file);
//     if (fileUrl) formData.append('fileUrl', fileUrl);

//     const response = await fetch('/api/messages', {
//       method: 'POST',
//       body: formData
//     });

//     const data = await response.json();

//     if (data.success && socket) {
//       socket.emit('sendMessage', data.plainMessage);
//       return data.plainMessage;  // ✅ return the saved message
//     } else {
//       console.log(data.success, "checking data.success in sendmessage,");
//       console.log(socket, "socket may be backend server 4000 emit function is not called");
//       return null;
//     }
//   } catch (error) {
//     console.error('❌ Error sending message:', error);
//     return null;  // fallback return
//   }
// };


// const handleDelete = async (messageId , conversationId) => {
//   try {
//     await fetch(`/api/messages/${conversationId}?messageId=
      
//       ${messageId}`, { method: "PATCH" });
//     // local update
//     setMessages(prev =>
//       prev.map(m => m._id === messageId ? { ...m, isDeleted: true } : m)
//     );
//     // emit socket event
//     socket.emit('delete-message', messageId);
//   } catch (err) {
//     console.error("Delete failed:", err);
//   }
// };

// const handleEdit = async (messageId) => {
//   try {
//     const res = await fetch(`/api/messages/options/${messageId}/edit`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ content: editDraft })
//     });
//     const { message } = await res.json();
//     setMessages(prev => prev.map(m => m._id === messageId ? message : m));
//     setEditing(null);
//   } catch (err) {
//     console.error('Edit failed', err);
//   }
// };

// useEffect(() => {
//   if (!socket) return;

//   const onMessageDeleted = (messageId) => {
//     setMessages(prev =>
//       prev.map(m => m._id === messageId ? { ...m, isDeleted: true } : m)
//     );
//   };

//   socket.on('message-deleted', onMessageDeleted);

//   return () => socket.off('message-deleted', onMessageDeleted);
//   socket.on('message-edited', updatedMsg => {
//   setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
// });
// }, [socket]);

// // useEffect(() => {
// //   if (!socket) return;

// //   // 1️⃣ Sent confirmation: update status to 'sent'
// //   socket.on('sent-confirmation', ({ messageId }) => {
// //     setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: 'sent' } : m));
// //   });

// //   // 2️⃣ Delivered confirmation: update status to 'delivered'
// //   socket.on('delivered-confirmation', ({ messageId }) => {
// //     setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: 'delivered' } : m));
// //   });

// //   // 3️⃣ Read confirmation: update status to 'seen'
// //   socket.on('read-confirmation', ({ messageId }) => {
// //     setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: 'seen' } : m));
// //   });

// //   // 4️⃣ Typing indicator
// //   socket.on('typing', ({ userId }) => {
// //     setIsTyping(true);
// //     setTimeout(() => setIsTyping(false), 1500);
// //   });

// //   // cleanup on unmount
// //   return () => {
// //     socket.off('sent-confirmation');
// //     socket.off('delivered-confirmation');
// //     socket.off('read-confirmation');
// //     socket.off('typing');
// //   };
// // }, [socket]);



// const emitTyping = (conversationId) => {
//     if (socket) {
//       socket.emit('typing', { conversationId, userId });
//     }
//   };


// const value = {
//     socket,
//     isConnected,
//     notifications,
//     messages,
//     setMessages,
//     conversations,
//     setConversations,
//     fetchConversations,
//     unreadCount,
//     markNotificationAsRead,
//     deleteNotification,
//     sendMessage,
//     fetchMessages,
//     handleDelete,
//     handleEdit,
//      typingUsers, 
//      emitTyping

     
    
//     // fetchNotifications,
    
//   };

//   return (
//     <SocketContext.Provider value={value}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState({ notifications: 0, messages: 0 });
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping  , setIsTyping] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL, {
      query: { userId }
    });
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to Socket.IO server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from Socket.IO server');
    });

    // Notifications
    socketInstance.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => ({ ...prev, notifications: prev.notifications + 1 }));
    });

    // ✅ Handle incoming message
    socketInstance.on('newMessage', (message) => {
      console.log('💬 New message:', message);
      setMessages(prev => [...prev, message]);
      setUnreadCount(prev => ({ ...prev, messages: prev.messages + 1 }));

      // emit delivered back to sender
      socketInstance.emit('delivered', { messageId: message._id, senderId: message.sender });
    });

    // ✅ Confirmations
    socketInstance.on('sent-confirmation', ({ messageId }) =>
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: 'sent' } : m))
    );

    socketInstance.on('delivered-confirmation', ({ messageId }) =>
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: 'delivered' } : m))
    );

    socketInstance.on('read-confirmation', ({ messageId }) =>
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: 'seen' } : m))
    );

    // ✅ Typing indicator
   

    fetchConversations();

    return () => {
      socketInstance.disconnect();
      console.log('🧹 Socket disconnected on cleanup');
    };
  }, [userId]);

  useEffect(() => {
    console.log("inside receiver");
  if (!socket) return;

  socket.on('typing', ({otherUserId}) => {
  
    console.log('✏️ Typing indicator received');
    if( userId === otherUserId){
      setIsTyping(!isTyping)
    }
    setTimeout(() => setIsTyping(false), 1500);
  });

  return () => {
    socket.off('typing');
  };
}, [socket]);

  // Fetch messages / conversations
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('❌ Error fetching conversations:', err);
    }
  };

  // Send message & emit
  const sendMessage = async (conversationId, content, senderId, receiverId, type = 'text', file = null, fileUrl) => {
    try {
      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('content', content);
      formData.append('senderId', senderId);
      formData.append('receiverId', receiverId);
      formData.append('type', type);
      if (file) formData.append('file', file);
      if (fileUrl) formData.append('fileUrl', fileUrl);

      const res = await fetch('/api/messages', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success && socket) {
        socket.emit('sendMessage', data.plainMessage);
        return data.plainMessage;
      } else {
        console.error('❌ sendMessage failed:', data);
        return null;
      }
    } catch (err) {
      console.error('❌ Error sending message:', err);
      return null;
    }
  };

  // ✅ Emit read when user reads
  const markAsRead = (messageId, senderId) => {
    if (socket) socket.emit('read', { messageId, senderId });
  };

  // ✅ Emit typing when user types
  const emitTyping = (otherUserId) => {
    console.log("in side emityping" , otherUserId , )
    console.log(userId)
    if(socket){
      console.log("socket is present");
      socket.emit('typing' ,{ otherUserId});
      console.log("socket emiited")
    }
  };

  // Notifications
  const markNotificationAsRead = async (notificationId) => { /* unchanged */ };
  const deleteNotification = async (notificationId) => { /* unchanged */ };

  // Delete / edit handlers
  const handleDelete = async (messageId, conversationId) => { /* unchanged */ };
  const handleEdit = async (messageId) => { /* unchanged */ };

  const value = {
    socket,
    isConnected,
    notifications,
    conversations,
    messages,
    setMessages,
    setConversations,
    fetchConversations,
    unreadCount,
    sendMessage,
    fetchMessages,
    markAsRead,         // ✅ new
    emitTyping,         // ✅ new
    typingUsers,
    markNotificationAsRead,
    deleteNotification,
    handleDelete,
    handleEdit,
    isTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
