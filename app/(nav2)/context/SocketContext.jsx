
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

// Create context
const SocketContext = createContext();

// Custom hook for using the context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Provider
export const SocketProvider = ({ children}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages , setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState({ notifications: 0, messages: 0 });
  const {user} = useAuth();

  const userId = user?.id; 
  console.log(userId ,"userid in socketcontext")
  console.log(process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL , "BACKEND SERVER BASE URL")

  useEffect(() => {
    if (!user?.id) return;
     
    // Connect to backend Socket.IO server
    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL, {
      query: { userId: user?.id }
    });
    setSocket(socketInstance);

    // Handle connection status
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to Socket.IO server');
      
      // Optional: join user's personal room
      socketInstance.emit('join', user?.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from Socket.IO server');
    });

    // Handle incoming notifications
    socketInstance.on('newNotification', (notification) => {
      console.log('📩 New notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => ({ ...prev, notifications: prev.notifications + 1 }));
    });

    // Handle incoming messages
    socketInstance.on('newMessage', (message) => {
      console.log('💬 New message:', message);
      setMessages(prev => [...prev, message]);
      setUnreadCount(prev => ({ ...prev, messages: prev.messages + 1 }));
    });


    // Load initial data from backend REST API
    // fetchNotifications();
    fetchConversations();

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      console.log('🧹 Socket disconnected on cleanup');
    };
  }, [user]);

  



  // Fetch notifications from backend REST API
  // const fetchNotifications = async () => {
  //   try {
  //     const response = await fetch('/api/notifications');
  //     const data = await response.json();
  //     setNotifications(data.notifications || []);
  //     setUnreadCount(prev => ({ ...prev, notifications: data.unreadCount || 0 }));
  //   } catch (error) {
  //     console.error('❌ Error fetching notifications:', error);
  //   }
  // };

  // Fetch messages / conversations
  const fetchMessages = async ( conversationId) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      const data = await response.json();
      console.log(data,"data")
      console.log(data.messages,"data messages")
      setMessages(data.messages || []);
      // setUnreadCount(prev => ({ ...prev, messages: data.unreadCount || 0 }));
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    }
  };

  const fetchConversations = async ( )=>{
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      const data = await response.json();
      console.log(data,"data")
      setConversations(data.conversations || []);
      // setUnreadCount(prev => ({ ...prev, messages: data.unreadCount || 0 }));
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
    }
  }

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => ({ ...prev, notifications: Math.max(0, prev.notifications - 1) }));
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
    }
  };

  // Send message & emit to socket
 const sendMessage = async (conversationId, content, senderId, receiverId, type = 'text', file = null,fileUrl) => {
  try {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    formData.append('content', content);
    formData.append('senderId', senderId);        // 👈 add this
    formData.append('receiverId', receiverId);    // 👈 add this
    formData.append('type', type);
    if (file) formData.append('file', file);
    if(fileUrl)formData.append('fileUrl', fileUrl)

    const response = await fetch('/api/messages', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success && socket) {
      // Emit to receiver in real time
      socket.emit('sendMessage', data.plainMessage);
    }else{
      console.log(data.success , "checking data.success in sendmessage ,")
      console.log(socket , "socket may be backend server 4000 emit function is not called" ,)
    }
  } catch (error) {
    console.error('❌ Error sending message:', error);
  }
};


const handleDelete = async (messageId , conversationId) => {
  try {
    await fetch(`/api/messages/${conversationId}?messageId=
      
      ${messageId}`, { method: "PATCH" });
    // local update
    setMessages(prev =>
      prev.map(m => m._id === messageId ? { ...m, isDeleted: true } : m)
    );
    // emit socket event
    socket.emit('delete-message', messageId);
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

const handleEdit = async (messageId) => {
  try {
    const res = await fetch(`/api/messages/options/${messageId}/edit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editDraft })
    });
    const { message } = await res.json();
    setMessages(prev => prev.map(m => m._id === messageId ? message : m));
    setEditing(null);
  } catch (err) {
    console.error('Edit failed', err);
  }
};

useEffect(() => {
  if (!socket) return;

  const onMessageDeleted = (messageId) => {
    setMessages(prev =>
      prev.map(m => m._id === messageId ? { ...m, isDeleted: true } : m)
    );
  };

  socket.on('message-deleted', onMessageDeleted);

  return () => socket.off('message-deleted', onMessageDeleted);
  socket.on('message-edited', updatedMsg => {
  setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
});
}, [socket]);


const value = {
    socket,
    isConnected,
    notifications,
    messages,
    setMessages,
    conversations,
    setConversations,
    fetchConversations,
    unreadCount,
    markNotificationAsRead,
    deleteNotification,
    sendMessage,
    fetchMessages,
    handleDelete,
    handleEdit
     
    
    // fetchNotifications,
    
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
