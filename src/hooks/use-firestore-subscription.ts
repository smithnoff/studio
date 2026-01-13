"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, Query, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * @deprecated use useFirestoreQuery instead
 */
export function useFirestoreSubscription<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
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
