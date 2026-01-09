"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader text="Redirecting..." />
    </div>
  );
}
