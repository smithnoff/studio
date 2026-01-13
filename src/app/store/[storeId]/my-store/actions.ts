'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const updateMyStoreSchema = z.object({
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  isOpen: z.enum(['true', 'false']).transform(v => v === 'true'),
});

export async function updateMyStore(storeId: string, formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = updateMyStoreSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // A real app would have Firestore security rules to ensure
  // only the store manager can update their own store.

  try {
    const storeRef = doc(db, "Stores", storeId);
    await updateDoc(storeRef, {
        ...validatedFields.data,
        imageUrl: validatedFields.data.imageUrl || `https://picsum.photos/seed/${storeId}/100/100`
    });

    revalidatePath(`/store/${storeId}/my-store`);
    revalidatePath(`/store/${storeId}`); // revalidate dashboard
    return { message: "Tu tienda ha sido actualizada." };
  } catch (e) {
    return { message: "No se pudo actualizar la tienda." };
  }
}
