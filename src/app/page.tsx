"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';
import { useAuth } from '@/context/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { appUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (appUser) {
      if (appUser.rol === 'admin') {
        router.replace('/dashboard');
      } else if ((appUser.rol === 'store_manager' || appUser.rol === 'store_employee') && appUser.storeId) {
        router.replace(`/store/${appUser.storeId}`);
      } else {
        router.replace('/login');
      }
    } else {
        router.replace('/login');
    }

  }, [appUser, loading, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader text="Redirigiendo..." />
    </div>
  );
}
