"use client";

import dynamic from 'next/dynamic';

// Use dynamic import with correct path (note the double social in the path)
const SocialFeedLayout = dynamic(() => import('../../components/sections/social/social/SocialFeedLayout'), {
  ssr: false,
  loading: () => <p>Loading social feed layout...</p>
});

export default function Home() {
  return <SocialFeedLayout />;
}
