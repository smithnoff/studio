"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, Query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestoreSubscription<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(documents);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}
