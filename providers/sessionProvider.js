// app/providers.jsx or similar
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
