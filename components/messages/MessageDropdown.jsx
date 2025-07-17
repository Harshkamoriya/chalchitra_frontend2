'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Search, Send, Paperclip, Download, Edit2, Trash2, Copy } from 'lucide-react';
import { useSocket } from '@/app/(nav2)/context/SocketContext';
import { useAuth } from '@/app/(nav2)/context/AuthContext';
import { useRouter } from 'next/navigation'
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
};

const MessageDropdown = ({ isOpen, setIsOpen }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);


  const { user } = useAuth();
  const currentUserId = user?.id;
  const router = useRouter();

  const { conversations, messages, sendMessage , fetchConversations , activeRole} = useSocket();
  const isMobile = useIsMobile();
  console.log(conversations,"conversations in messagedropdown")


   useEffect(() => {
    console.log('[useEffect] isOpen changed:', isOpen);
    fetchConversations()
  }, [isOpen , activeRole]);
  // Click outside to close
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [setIsOpen]);

  // Find other participant
  const getOtherParticipant = (conv) =>
    conv?.participants?.find((p) => p._id !== currentUserId);

  // Filter conversations
  const filteredConversations = conversations?.filter((conv) =>
    getOtherParticipant(conv)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredConversations , "filtereconversations in msd")
   const handleSelectConversation = (conv) => {
    console.log('[Click] Conversation clicked:', conv);
    setSelectedConversation(conv);
    console.log(conv?._id , " conversation id in the msd")
    router.push(`/inbox?conv_id=${conv?._id}`)
  };

    const handleCloseDropdown = () => {
    console.log('[Action] Close dropdown');
    setIsOpen(false);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();

    
    if (!newMessage.trim() || !selectedConversation) return;
    const other = selectedConversation.participants.find(p =>p._id !== currentUserId)
    console.log(other  , "other in msd it is receiverId")
    await sendMessage({
      conversationId: selectedConversation._id,
      content: newMessage,
      currentUserId,
      receiverId :other,

      type: 'text'
    });
    setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedConversation) return;
    const other = selectedConversation.participants.find(p =>p._id !== currentUserId)
    console.log(other  , "other in msd it is receiverId")

    await sendMessage({
      conversationId: selectedConversation._id,
      content: '',
      currentUserId,
      receiverId:other,
      type: 'file',
      file
    });
  };

  const handleCopyMessage = (content) => navigator.clipboard.writeText(content);

  const handleDeleteMessage = async (messageId) => {
    try {
      await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
      setEditingMessage(null);
    } catch (err) {
      console.error('Error editing message:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={isMobile
        ? "fixed inset-0 bg-white z-50 flex flex-col"
        : "absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50"}
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        {!selectedConversation ? (
          <>
            <h3 className="font-semibold">Messages</h3>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedConversation(null)}>←</button>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                {getOtherParticipant(selectedConversation)?.name?.charAt(0)}
              </div>
              <h3 className="font-semibold">{getOtherParticipant(selectedConversation)?.name}</h3>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </>
        )}
      </div>

      {/* Content */}
      {!selectedConversation ? (
        <>
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle size={24} className="mx-auto mb-2" />
                No conversations yet
              </div>
            ) : filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer flex gap-3"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    {other?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="font-medium truncate">{other?.name}</h4>
                      <span className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-purple-500 text-white text-xs rounded-full px-2">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.map((msg) => {
              const isSent = msg.senderId === currentUserId;
              return (
                <div key={msg._id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${isSent ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    {editingMessage === msg._id ? (
                      <input
                        type="text"
                        defaultValue={msg.content}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditMessage(msg._id, e.target.value)}
                        className="w-full px-2 py-1 border rounded text-gray-900"
                      />
                    ) : msg.type === 'file' ? (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{msg.fileName}</span>
                        <button onClick={() => window.open(msg.fileUrl)}><Download className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <div className="flex justify-between mt-1">
                      <span className="text-xs opacity-70">{formatTime(msg.createdAt)}</span>
                      {isSent && (
                        <div className="flex gap-1">
                          <button onClick={() => handleCopyMessage(msg.content)}><Copy size={12} /></button>
                          <button onClick={() => setEditingMessage(msg._id)}><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteMessage(msg._id)}><Trash2 size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()}><Paperclip size={18} /></button>
            <button onClick={handleSendMessage} className="bg-purple-500 text-white rounded-md px-3 py-2"><Send size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageDropdown;
