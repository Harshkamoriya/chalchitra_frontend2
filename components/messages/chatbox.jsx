// // 'use client';
// // import { useEffect, useState, useRef } from 'react';
// // import { useParams } from 'next/navigation';
// // import { SendHorizonal } from 'lucide-react';
// // import io from 'socket.io-client';
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { toast } from 'react-hot-toast';
// // import { useAuth } from '../../context/AuthContext';

// // let socket;

// // export default function ChatPage() {
// //   const { conversationId } = useParams();
// //   const [messages, setMessages] = useState([]);
// //   const [content, setContent] = useState('');
// //   const messagesEndRef = useRef(null);
// //   const {user}  = useAuth()
// //   console.log(user , "current loggedin use in chat")

// //   const currentUserId = user?.id // replace with actual user ID from context/auth

// //   useEffect(() => {
// //     fetchMessages();
// //     initSocket();

// //     return () => {
// //       if (socket) socket.disconnect();
// //     };
// //   }, [conversationId]);

// //   const fetchMessages = async () => {
// //     try {
// //       const res = await fetch(`/api/messages?conversationId=${conversationId}`);
// //       const data = await res.json();
// //       setMessages(data.messages || []);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const initSocket = () => {
// //     socket = io('http://localhost:4000', {
// //       query: { userId: currentUserId }
// //     });

// //     socket.on('newMessage', (newMsg) => {
// //       setMessages((prev) => [...prev, newMsg]);
// //     });
// //   };

// //   const sendMessage = () => {
// //     if (!content.trim()) return;

// //     const messageObj = {
// //       conversationId,
// //       content,
// //       senderId: currentUserId,
// //       receiverId: 'RECEIVER_ID', // get receiverId based on conversation or context
// //       type: 'text'
// //     };

// //     // Emit to server
// //     socket.emit('sendMessage', messageObj);

// //     // Optimistic update
// //     setMessages((prev) => [...prev, { ...messageObj, createdAt: new Date() }]);
// //     setContent('');
// //   };

// //   // Auto-scroll to bottom
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   return (
// //     <div className="max-w-2xl mx-auto flex flex-col h-[80vh] border rounded-2xl shadow-lg">
// //       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
// //         {messages.map((msg, idx) => (
// //           <div
// //             key={idx}
// //             className={`max-w-[70%] px-3 py-2 rounded-xl text-sm
// //               ${msg.senderId === currentUserId
// //                 ? 'bg-blue-500 text-white self-end'
// //                 : 'bg-gray-200 text-gray-800 self-start'}`}
// //           >
// //             {msg.content}
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>
// //       <div className="p-3 border-t flex items-center gap-2">
// //         <Input
// //           placeholder="Type your message..."
// //           value={content}
// //           onChange={(e) => setContent(e.target.value)}
// //           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
// //         />
// //         <Button onClick={sendMessage}>
// //           <SendHorizonal size={18} />
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { Send, Paperclip } from 'lucide-react';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import io from 'socket.io-client';
// import getOtherUser from '@/lib/realtime/getOther';
// import { useSocket } from '@/app/(nav2)/context/SocketContext';

// export default function ChatBox({ conversationId, selectedConversation, currentUserId }) {
//   const [conversation, setConversation] = useState(selectedConversation || null);
//   const [otherUser, setOtherUser] = useState(null);
//   const [newMsg, setNewMsg] = useState('');
//   const socket = useRef(null);
//   const messagesEndRef = useRef(null);
//   const { messages , setMessages, fetchMessages , sendMessage } = useSocket();


//   // Fetch conversation object if not provided
//   useEffect(() => {
//     if (!conversation && conversationId) {
//       console.log("[ChatBox] fetching conversation object by ID:", conversationId);
//       const fetchConversation = async () => {
//         try {
//           const res = await fetch(`/api/conversations/${conversationId}?currentUserId=${currentUserId}`
//             ,{currentUserId}
//           );

//           const data = await res.json();
//           console.log("[ChatBox] conversation fetch response:", data);
//           if (data.success && data.conversation) {
//             setConversation(data.conversation);
//             if(data.receiver){
//               setOtherUser(data.receiver)
//             }
//           }
//         } catch (error) {
//           console.error("[ChatBox] Failed to fetch conversation:", error);
//         }
//       };
//       fetchConversation();
//     }
//   }, [conversation, conversationId]);

//   // Fetch messages
//   useEffect(() => {
//       console.log(messages , "messages ")
//       console.log(conversationId , "conversationId")
//       fetchMessages(conversation ? conversation?._id : conversationId);
    
//   }, [conversationId , conversation]);


//   // Find other user when conversation updates
// // useEffect(() => {
// //   const fetchOther = async () => {
// //     console.log("[ChatBox] fetching other user from participants:", conversation.participants);
// //     const receiverId = conversation.participants.find(id => id !== currentUserId);
// //     if (!receiverId) {
// //       console.log("[ChatBox] no receiverId found!");
// //       return;
// //     }
// //     const res = await getOtherUser(receiverId);
// //     console.log("[ChatBox] got response from getOtherUser:", res);
// //     if (res) {
// //       setOtherUser(res.receiver);
// //       console.log("[ChatBox] set other user:", res);
// //     } else {
// //       console.log("[ChatBox] API call failed:", res);
// //     }
// //   };
// //   if (conversation) {
// //     fetchOther();
// //   }
// // }, [conversation]);


//   // Init socket
//   // useEffect(() => {
//   //   if (currentUserId) {
//   //     console.log("[ChatBox] initializing socket with userId:", currentUserId);
//   //     socket.current = io('http://localhost:4000', { query: { userId: currentUserId } });

//   //     socket.current.on('newMessage', (msg) => {
//   //       console.log("[ChatBox] newMessage received via socket:", msg);
//   //       setChat(prev => [...prev, msg]);
//   //     });

//   //     return () => {
//   //       console.log("[ChatBox] disconnecting socket");
//   //       socket.current.disconnect();
//   //     };
//   //   }
//   // }, [currentUserId]);

//   // Auto-scroll on messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     console.log("[ChatBox] auto-scroll to bottom");
//   }, [messages]);

//   // const handleSend = async () => {
//   //   if (!newMsg.trim() || !conversation || !otherUser?._id) {
//   //     console.warn("[ChatBox] Cannot send: message empty or missing data");
//   //     return;
//   //   }

//   //   const msg = {
//   //     conversationId: conversation._id || conversationId,
//   //     content: newMsg,
//   //     senderId: currentUserId,
//   //     receiverId: otherUser._id,
//   //     type: 'text'
//   //   };
//   //   console.log("[ChatBox] sending message via socket:", msg);

//   //   socket.current.emit('sendMessage', msg);
//   //   setMessages(prev => [...prev, { ...msg, createdAt: new Date() }]);
//   //   setNewMsg('');
//   // };

  

// const handleSend = async () => {
//   if (!newMsg.trim() || !conversation || !otherUser?._id) {
//     console.log("[ChatBox] Cannot send: message empty or missing data");
//     return;
//   }
//   console.log(messages,"messages in the handle send function before sending")
//     await sendMessage(
//     conversation._id || conversationId,
//     newMsg,
//     currentUserId,
//     otherUser._id,
//     'text'
//   );


//   // Optionally local state me bhi add kar de
//   setMessages(prev => [...prev, {
//     conversationId: conversation._id || conversationId,
//     content: newMsg,
//     senderId: currentUserId,
//     receiverId: otherUser._id,
//     type: 'text',
//     createdAt: new Date()
//   }]);
//   setNewMsg('');
// };
  

//  console.log(messages ," messages after sending")
//   return (
//     <>
//       {otherUser ? (
//         <>
//           {/* Header */}
//           <div className="p-4 border-b flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
//                 {otherUser?.name?.charAt(0) || "?"}
//               </div>
//               <div>
//                 <div className="font-semibold">{otherUser?.name} <span className="text-gray-400 text-xs">@{otherUser?.displayName}</span></div>
//                 <div className="text-xs text-gray-500">Last seen {new Date(otherUser?.lastSeen || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
//               </div>
//             </div>
//             <div className="text-right text-xs text-gray-500">
//               <div className="font-medium">{otherUser?.level || 'Level 1'}</div>
              
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-2">
//             {messages?.map((msg, idx) => (
//               <div key={idx} className={`flex ${msg?.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`px-3 py-2 rounded-xl text-sm max-w-[70%]
//                   ${msg?.senderId === currentUserId ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
//                   {msg?.content}
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="p-3 border-t flex items-center gap-2">
//             <Input
//               value={newMsg}
//               onChange={(e) => setNewMsg(e.target.value)}
//               placeholder="Type message..."
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             />
//             <Button variant="secondary"><Paperclip size={18} /></Button>
//             <Button onClick={handleSend}><Send size={18} /></Button>
//           </div>
//         </>
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           Select a conversation to start chatting
//         </div>
//       )}
//     </>
//   );
// }


'use client';
import { useEffect, useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import getOtherUser from '@/lib/realtime/getOther';
import { useSocket } from '@/app/(nav2)/context/SocketContext';

export default function ChatBox({ conversationId, selectedConversation, currentUserId }) {
  const [conversation, setConversation] = useState(selectedConversation || null);
  const [otherUser, setOtherUser] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, setMessages, fetchMessages, sendMessage } = useSocket();

  // 🔹 Fetch conversation object if not passed
  useEffect(() => {
    if (!conversation && conversationId) {
      const fetchConversation = async () => {
        try {
          const res = await fetch(`/api/conversations/${conversationId}?currentUserId=${currentUserId}`);
          const data = await res.json();
          if (data.success && data.conversation) {
            setConversation(data.conversation);
            if (data.receiver) {
              setOtherUser(data.receiver);
            }
          }
        } catch (error) {
          console.error("[ChatBox] Failed to fetch conversation:", error);
        }
      };
      fetchConversation();
    }
  }, [conversation, conversationId, currentUserId]);

  // 🔹 Fetch messages for this conversation
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  // 🔹 Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✏ Handle send message
  const handleSend = async () => {
    if (!newMsg.trim() || !conversation || !otherUser?._id) {
      console.warn("[ChatBox] Cannot send: empty msg or missing data");
      return;
    }

    await sendMessage(
      conversation._id || conversationId,
      newMsg,
      currentUserId,
      otherUser._id,
      'text'
    );

    // Optimistic add in local state
    setMessages(prev => [
      ...prev,
      {
        conversationId: conversation._id || conversationId,
        content: newMsg,
        senderId: currentUserId,
        receiverId: otherUser._id,
        type: 'text',
        createdAt: new Date().toISOString()
      }
    ]);
    setNewMsg('');
  };

  // ✅ Filter messages by this conversation & sort oldest→newest
  console.log(messages ,"messages")
  const filteredMessages = (messages || [])
    .filter(msg => msg.conversationId === (conversation?._id || conversationId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));


console.log(filteredMessages ,"fliteredmessages")


  return (
    <>
      {otherUser ? (
        <>
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
                {otherUser?.name?.charAt(0) || "?"}
              </div>
              <div>
                <div className="font-semibold">
                  {otherUser?.name}
                  <span className="text-gray-400 text-xs"> @{otherUser?.displayName}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last seen {new Date(otherUser?.lastSeen || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div className="font-medium">{otherUser?.level || 'Level 1'}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredMessages.map((msg) => (
              <div key={msg?._id} className={`flex ${msg?.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[70%]
                  ${msg?.senderId === currentUserId ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg?.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="secondary"><Paperclip size={18} /></Button>
            <Button onClick={handleSend}><Send size={18} /></Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a conversation to start chatting
        </div>
      )}
    </>
  );
}
