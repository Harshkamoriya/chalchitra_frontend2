'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatBox from '@/components/messages/chatbox';
import { useAuth } from '../context/AuthContext';
import getOtherUser from '@/lib/realtime/getOther';
import { SocketProvider, useSocket } from '../context/SocketContext';

export default function InboxPage() {
  const {conversations , setConversations ,ureadCount} = useSocket();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [otherUsers, setOtherUsers] = useState({}); // store receiver users

  const { user } = useAuth();
  const searchParams = useSearchParams();
  const conversation_id = searchParams.get('conv_id');
  const currentUserId = user?.id;
  

  // Fetch conversations + their receivers on load
  useEffect(() => {
    if (currentUserId) {
      const fetchAll = async () => {
        try {
          // Fetch conversations
          // const res = await fetch(`/api/messages?userId=${currentUserId}`);
          // const data = await res.json();
          // const convs = data.conversations || [];
          // setConversations(convs);

          // Fetch receiver users for each conversation
          const receivers = {};
          console.log(conversations , "conversations")
          for (const conv of conversations) {
             console.log(conv , "conversation")
            if (conv?.participants) {
              const other = await getOtherUser(conv?.participants, currentUserId);
              console.log(other ,"other in inbox for loop")
              receivers[conv._id] = other;
            }
          }
          setOtherUsers(receivers);
        } catch (err) {
          console.error('Failed to fetch conversations or receivers:', err);
        }
      };
      fetchAll();
    }
  }, [currentUserId]);

  // Auto-select conversation by conv_id in URL
  useEffect(() => {
    if (conversation_id && conversations.length) {
      const found = conversations.find(c => c._id === conversation_id);
      if (found) setSelectedConversation(found);
    }
  }, [conversation_id, conversations]);
console.log(conversations , "conversations in inbox")
  return (
    
  <SocketProvider user={user}>
      <div className="flex h-[85vh] border rounded-xl shadow overflow-hidden">
      {/* Left: Conversation list */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b font-semibold">All messages</div>
        {conversations.map((conv) => {
          const other = conv?.participants?.find(p => p._id !== currentUserId); // get receiver for this conversation
          return (
            <div key={conv._id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer
                ${selectedConversation?._id === conv._id ? 'bg-gray-100' : ''}`}>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
                {other ? other.name.charAt(0) : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm font-medium">
                  <span className="truncate">{other ? other.name : 'Loading...'}</span>
                  <span className="text-gray-400 text-xs">
                    {conv.lastMessageTime
                      ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>
                <p className="text-gray-500 text-xs truncate">{conv.lastMessage?.content || 'No messages yet'}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Right: ChatBox */}
      <div className="flex-1 flex flex-col">
          <ChatBox 
          conversationId={selectedConversation?._id || conversation_id}
          selectedConversation={selectedConversation}
          currentUserId={currentUserId}
        />
     
      </div>
    </div>
     </SocketProvider>
     
  );
}
