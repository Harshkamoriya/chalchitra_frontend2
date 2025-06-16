// BackButton.tsx
'use client'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
   <button onClick={()=>{
    router.back();
   }} className="flex items-center text-gray-600 hover:text-pink-700 transition-colors font-medium cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
  );
}
