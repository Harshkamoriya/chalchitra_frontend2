'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/app/(nav2)/context/AuthContext';
import api from '@/lib/axios';
export default function StartChatButton({receiverId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {user} = useAuth();
  const currentUserId = user?.id;
  const {activeRole} = useAuth();

  const startChat = async () => {
    console.log("inside start chat function")
    console.log(currentUserId,'currentuserid')
    console.log(receiverId,'receiverid')
    if (!currentUserId || !receiverId) return;

    try {
      setLoading(true);
      const res = await api.post(`/api/conversations`, {
          activeRole , currentUserId, receiverId
      });
      

      if (res.data.success) {
        toast.success('Chat started!');
        router.push(`/inbox?conv_id=${res.data.conversation._id}`);
      } else {
        toast.error('Could not start chat');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={startChat} disabled={loading} variant="secondary" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
      <MessageCircle size={18} /> {loading ? 'Starting...' : 'Start Chat'}
    </Button>
  );
}
