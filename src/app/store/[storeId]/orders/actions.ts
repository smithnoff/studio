"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "READY", "DELIVERED", "CANCELLED"]),
});

export async function updateOrderStatus(storeId: string, orderId: string, formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = updateOrderStatusSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: "Campos inválidos."
    };
  }

  // A real app would have Firestore security rules to ensure
  // only the store manager/employee can update their own store's orders.

  try {
    const orderRef = doc(db, "Orders", orderId);
    await updateDoc(orderRef, {
      status: validatedFields.data.status,
    });

    revalidatePath(`/store/${storeId}/orders`);
    return { message: "El estado del pedido ha sido actualizado." };
  } catch (e) {
    console.error(e);
    return { error: "No se pudo actualizar el estado del pedido." };
  }
}
