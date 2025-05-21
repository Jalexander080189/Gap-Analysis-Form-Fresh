"use client";

import dynamic from 'next/dynamic';

// Use dynamic import with the correct path
const SocialFeedLayout = dynamic(() => import('../../components/SocialFeedLayout'), {
  ssr: false,
  loading: () => <p>Loading social feed layout...</p>
});

export default function Home() {
  return <SocialFeedLayout />;
}
