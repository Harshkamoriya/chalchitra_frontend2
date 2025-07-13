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

// ChatBox.jsx



"use client";

import api from "@/lib/axios";
import { useEffect, useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import getOtherUser from "@/lib/realtime/getOther";
import { useSocket } from "@/app/(nav2)/context/SocketContext";
import { useAuth } from "@/app/(nav2)/context/AuthContext";
import { Sheet } from "../ui/sheet";
import { SheetContent } from "../ui/sheet";
import { SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";



export default function ChatBox({
  conversationId,
  selectedConversation,
  currentUserId,
}) {
  const [conversation, setConversation] = useState(
    selectedConversation || null
  );


  const [otherUser, setOtherUser] = useState();
  const [newMsg, setNewMsg] = useState("");
  const [file, setFile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const messagesEndRef = useRef(null);
  const [isChatOpen , setIsChatOpen] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const {user} = useAuth();
  const [actionMsg, setActionMsg] = useState(null);
const [showActions, setShowActions] = useState(false);
const [replyingTo, setReplyingTo] = useState(null);

  console.log(currentUserId , "currentuserid")


  const {
    socket,
    messages,
    setMessages,
    fetchMessages,
    sendMessage,
    handleDelete,
    emitTyping,
    typingUsers,
    isTyping,
    currentConversationId,
    setCurrentConversationId
  } = useSocket();

  console.log(conversationId , "conversationId")
  console.log(conversation, "conversation in chatbox")

useEffect(() => {
  if (selectedConversation && currentUserId) {
   (async () => {
  const other = await getOtherUser(selectedConversation.participants, currentUserId);
  console.log("[getOtherUser] resolved:", other);
  setOtherUser(other);
})();
    setConversation(selectedConversation); 
    setCurrentConversationId( selectedConversation._id)
  }
}, [selectedConversation, currentUserId]);


useEffect(() => {
  console.log("📦 conversationId changed or selectedConversation missing:", conversationId, selectedConversation);
  if (!selectedConversation && conversationId) {
    (async () => {
      try {
        console.log("🔄 Fetching conversation from API...");
        const res = await fetch(`/api/conversations/${conversationId}?currentUserId=${currentUserId}`);
        const data = await res.json();
        console.log("✅ API response:", data);
        if (data.success) {
          setConversation(data.conversation);
          setOtherUser(data.receiver);
          setCurrentConversationId(conversation?._id)
          console.log("✅ conversation set from API:", data.conversation);
          console.log("✅ otherUser set from API:", data.receiver);
        } else {
          console.warn("⚠️ API call failed:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching conversation:", err);
      }
    })();
  }
}, [selectedConversation, conversationId, currentUserId]);

// yahan hum state change kar rhae hai 
useEffect(() => {
  if (currentConversationId === null && conversationId !== null) {
    setCurrentConversationId(conversationId);
  }
}, [currentConversationId, conversationId]);



//  function to mark the messages as seen

useEffect(() => {
if (socket && currentUserId && conversationId && conversation?.participants) {
    const sender = conversation.participants.find(p => p._id !== currentUserId);
    const senderId = sender?._id;
    if (senderId) {
      socket.emit('mark-seen', { conversationId, receiverId: currentUserId, senderId });
      // update DB as well
      api.patch('/api/messages/mark-seen', { conversationId, receiverId: currentUserId })
      .then(() => fetchMessages(conversationId))
      .catch(err => console.error('❌ mark-seen patch failed:', err));
    }
  }

}, [conversationId, currentUserId, socket ,selectedConversation , conversation]);



useEffect(() => {
  console.log("💬 conversationId changed, fetching messages:", conversationId);
  if (conversationId) {
    fetchMessages(conversationId);
  }
}, [conversationId, fetchMessages]);



  // Scroll to bottom
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // Listen for real-time edits
  useEffect(() => {
    if (!socket) return;
    const onMessageEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };
    socket.on("message-edited", onMessageEdited);
    return () => socket.off("message-edited", onMessageEdited);
  }, [socket]);

  // Upload helper
  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: fd }
    );
    return res.json();
  };

  // Send or upload + send
  const handleSend = async () => {
    if (!newMsg.trim() && !file) return;
    const optimisticId = Date.now();
    let type = "text",
      fileUrl = null,
      content = newMsg;
    // optimistic
    setMessages((prev) => [
      ...prev,
      {
        _id: optimisticId,
        conversationId,
        sender: currentUserId,
        receiver: otherUser._id,
        type: file ? "file" : "text",
        content: file ? file.name : newMsg,
        fileUrl: null,
        uploading: !!file,
        status:'sent',
         replyTo: replyingTo ? { _id: replyingTo._id, content: replyingTo.content, type: replyingTo.type } : null,

        

        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      if (file) {
        const data = await uploadToCloudinary(file);
        fileUrl = data.secure_url;
        if (data.format === "pdf") type = "file";
        else if (data.resource_type === "image") type = "image";
        else if (data.resource_type === "video") type = "video";
        else type = "file";
      }
      console.log(replyingTo,"replying to")
      const saved = await sendMessage(
        conversationId,
        content || file.name,
        currentUserId,
        otherUser._id,
        type,
        null,
        fileUrl,
        replyingTo?._id,  // pass replyTo here
        null // forwardedFrom
      );
     if(saved){
       setMessages((prev) =>
  prev.map((m) => m._id === optimisticId ? saved : m)
)
     }

     console.log("saved message:", saved);
console.log("saved.conversationId:", saved.conversationId, typeof saved.conversationId);
console.log("conversation._id:", conversation?._id, typeof conversation?._id);
    } catch {}
    setNewMsg("");
    setFile(null);
    setReplyingTo(null);
  };

  // Edit handler
  const saveEdit = async (id) => {
    if (!editDraft.trim()) return;
    const res = await fetch(`/api/messages/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editDraft.trim(), messageId: id }),
    });
    const { message: plainMessage } = await res.json();
    setMessages((prev) => prev.map((m) => (m._id === id ? plainMessage : m)));
    socket.emit("edit-message", plainMessage);
    setEditingMessageId(null);
  };

  // Filter + sort
// const filtered = (messages || []).filter(
//   (m) => String(m.conversationId) == String(conversationId)
// );

const filtered = messages.filter(
  (m) => m.conversationId === conversation?._id
);

// console.log(filtered , "filtered ")
// console.log(messages , "messages")

// console.log("🔍 Rendering ChatBox:");
// console.log("conversationId prop:", conversationId);
// console.log("conversation state:", conversation);
// console.log("selectedConversation prop:", selectedConversation);
// console.log("otherUser state:", otherUser);





  return (
    <>
      {" "}
      {otherUser ? (
        <>
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                {otherUser?.name?.[0] || '?'}

              </div>
              <div>
                <div className="font-semibold">
                  {otherUser?.name}{" "}
                  <span className="text-gray-400 text-xs">
                    @{otherUser?.displayName}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Last seen{" "}
                  {new Date(
                    otherUser?.lastSeen || Date.now()
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              {isTyping && (
  <div className="text-xs text-purple-500 mt-1 animate-pulse">
    Typing...
  </div>
)}

              </div>
            </div>
            <div className="text-xs text-gray-500">
              Level {otherUser.level || 1}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filtered.map((msg) => {
              const isSender =
                msg.sender === currentUserId || msg.senderId === currentUserId;
              return (
                <div
  key={msg._id}
  className={`group relative flex ${isSender ? "justify-end" : "justify-start"}`}
  onContextMenu={(e) => {
    e.preventDefault(); 
    setActionMsg(msg);
    setShowActions(true);
  }}
  onClick={() => {
    // Optional: for mobile single tap if you prefer
  }}
>
                  <div
                    className={`px-3 py-2 rounded-xl text-sm max-w-[70%] ${isSender ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    {msg.uploading ? (
                      <span className="italic">Uploading…</span>
                    ) : msg.isDeleted ? (
                      <span className="italic text-gray-400">
                        This message was deleted
                      </span>
                    ) : editingMessageId === msg._id ? (
                      <div className="flex gap-1">
                        <Input
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => saveEdit(msg._id)}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingMessageId(null)}
                        >
                          ✖️
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* text */}
                        {msg.type === "text" && <span>{msg.content}</span>}
                        {msg.isEdited && (
                          <em className="ml-1 text-xs">(edited)</em>
                        )}
                        {/* image/video/file */}
                        {msg.type === "image" && msg.fileUrl && (
                          <img
                            src={msg.fileUrl}
                            className="rounded-md object-cover max-w-[250px] max-h-[250px]"
                          />
                        )}
                        {msg.type === "video" && msg.fileUrl && (
                          <video
                            src={msg.fileUrl}
                            controls
                            className="rounded-md object-cover max-w-[250px] max-h-[250px]"
                          />
                        )}
                        {msg.type === "file" && msg.fileUrl && (
                          <a href={msg.fileUrl} download className="underline">
                            📎 {msg.content || "Download"}
                          </a>
                        )}
                      </>
                    )}
                  </div>

                  {/* Hover menu */}
                  <div
                    key={msg._id}
                    className="relative flex items-start group mb-2"
                  >
                    {/* Message bubble */}
                    {/* <div
                      className={`px-3 py-2 rounded-xl text-sm max-w-[70%]
        ${isSender ? "bg-purple-500 text-white ml-auto" : "bg-gray-100 text-gray-900 mr-auto"}`}
                    >
                    </div> */}

                    {/* Side action menu */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col text-xs space-y-1 ml-2">
                      {/* only show delete/edit on your own messages */}
                      {isSender && !msg.isDeleted && (
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="bg-white rounded px-2 py-1 hover:bg-red-50 text-red-500 border border-red-200"
                        >
                          Delete
                        </button>
                      )}
                      {isSender && !msg.isDeleted && (
                        <button
                          onClick={() => {
                            setEditingMessageId(msg._id);
                            setEditDraft(msg.content || "");
                          }}
                          className="bg-white rounded px-2 py-1 hover:bg-blue-50 text-blue-500 border border-blue-200"
                        >
                          Edit
                        </button>
                      )}
                      {msg.type === "text" && (
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(msg.content)
                          }
                          className="bg-white rounded px-2 py-1 hover:bg-gray-50 text-gray-600 border border-gray-200"
                        >
                          Copy
                        </button>
                      )}
                      {msg.fileUrl && (
                        <a
                          href={msg.fileUrl}
                          download
                          className="bg-white rounded px-2 py-1 hover:bg-gray-50 text-gray-600 border border-gray-200"
                        >
                          Download
                        </a>
                      )}
                     {(msg.sender === currentUserId || msg.senderId === currentUserId) && (
  <>
    {msg.status === 'sending' && <span className="text-[10px] ml-1">🕓 Sending</span>}
    {msg.status === 'sent' && <span className="text-[10px] ml-1">✔ Sent</span>}
    {msg.status === 'delivered' && <span className="text-[10px] ml-1">✔✔ Delivered</span>}
    {msg.status === 'seen' && <span className="text-[10px] ml-1 text-blue-500">✔✔ seen</span>}
  </>
)}
{msg.replyTo && (
  <div className="p-1 border-l-2 border-purple-500 text-xs text-gray-500 mb-1">
    Replied To: {msg.replyTo?.content || '...'}
  </div>
)}
{msg.forwardedFrom && (
  <div className="p-1 border-l-2 border-green-500 text-xs text-gray-500 mb-1">
    Forwarded message: {msg.forwardedFrom?.content || '...'}
  </div>
)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
            
<Sheet open={showActions} onOpenChange={setShowActions}>
  <SheetContent>
     <VisuallyHidden>
      <SheetTitle>Actions</SheetTitle>
    </VisuallyHidden>
    <div className="flex flex-col gap-2">
      {actionMsg?.sender === currentUserId && !actionMsg?.isDeleted && (
        <>
          <Button onClick={() => { handleDelete(actionMsg._id); setShowActions(false); }}>Delete</Button>
          <Button onClick={() => { setEditingMessageId(actionMsg._id); setEditDraft(actionMsg.content); setShowActions(false); }}>Edit</Button>
        </>
      )}
      {actionMsg?.type === 'text' && (
        <Button onClick={() => { navigator.clipboard.writeText(actionMsg.content); setShowActions(false); }}>Copy</Button>
      )}
      <Button onClick={() => { handleForward(actionMsg); setShowActions(false); }}>Forward</Button>
       <Button onClick={() => { setReplyingTo(actionMsg); setShowActions(false); }}>Reply</Button>
      {actionMsg?.fileUrl && (
        <a href={actionMsg.fileUrl} download className="btn">Download</a>
      )}
    </div>
  </SheetContent>
</Sheet>
            
          </div>
{replyingTo && (
  <div className="flex items-center justify-between px-2 py-1 bg-gray-100 border-b">
    <span className="text-xs text-purple-500 truncate max-w-[200px]">
      Replying to: {replyingTo.content || '[media]'}
    </span>
    <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600">✖</button>
  </div>
)}


          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              value={newMsg}
              onChange={(e) => {
                setNewMsg(e.target.value);
                console.log(otherUser?._id , "inside onchange")
                emitTyping(otherUser?._id); // call from context
                    }}
              
              placeholder="Type message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button type="button" variant="secondary">
                <Paperclip size={18} />
              </Button>
            </div>
            {file && (
              <div className="text-xs text-gray-500">Selected: {file.name}</div>
            )}
            <Button onClick={handleSend}>
              <Send size={18} />
            </Button>
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
