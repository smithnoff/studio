"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, areFirebaseCredentialsSet } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

function FirebaseConfigChecker({ children }: { children: React.ReactNode }) {
    if (!areFirebaseCredentialsSet) {
        return (
            <div className="flex h-screen items-center justify-center bg-background p-4">
                <Alert variant="destructive" className="max-w-lg">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Firebase Configuration Missing</AlertTitle>
                    <AlertDescription>
                        Your Firebase environment variables are not set. Please create a <code>.env.local</code> file and add your Firebase project credentials. Check <code>.env.local.example</code> for the required variables.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    return <>{children}</>;
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!areFirebaseCredentialsSet) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !areFirebaseCredentialsSet) return;
    
    const isAuthPage = pathname === '/login';

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const isAuthPage = pathname === '/login';

  if (loading && !isAuthPage) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader text="Authenticating..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
        <FirebaseConfigChecker>
            {children}
        </FirebaseConfigChecker>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
