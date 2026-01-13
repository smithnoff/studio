"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, Query, DocumentData, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestoreQuery<T>(path: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, path), ...constraints);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(documents);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching collection ${path}:`, err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path, JSON.stringify(constraints)]); // stringify to prevent re-renders on object reference change

  return { data, loading, error };
}
