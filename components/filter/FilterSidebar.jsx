'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const categories = [
  'music-video-editing', 'wedding-event-editing', 'commercial-ad-editing',
  'youtube-vlog-editing', 'gaming-editing', 'podcast-editing',
  'short-form-reels-shorts', 'faceless-youtube-channel-editing',
  'corporate-educational-editing'
];
