"use client";

import dynamic from 'next/dynamic';

// Try this import path - adjust based on where your file actually is
const SocialFeedLayout = dynamic(() => import('@/components/sections/Social/SocialFeedLayout'), {
  ssr: false,
  loading: () => <p>Loading social feed layout...</p>
});

export default function Home() {
  return <SocialFeedLayout />;
}
