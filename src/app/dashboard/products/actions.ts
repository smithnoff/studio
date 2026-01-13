"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, query, where, getCountFromServer } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import type { Store } from "@/lib/types";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  brand: z.string().min(1, "La marca es obligatoria"),
  description: z.string().min(1, "La descripción es obligatoria"),
  category: z.string().min(1, "La categoría es obligatoria"),
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  tags: z.string().optional(),
  storeId: z.string().min(1, "Se requiere una tienda principal"),
});

export async function createProduct(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const validatedFields = productSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { tags, ...productData } = validatedFields.data;

    try {
        // Check store subscription limit
        const storeRef = doc(db, "Stores", productData.storeId);
        const storeSnap = await getDoc(storeRef);

        if (!storeSnap.exists()) {
            return { errors: { _form: ["La tienda seleccionada no existe."] } };
        }

        const store = storeSnap.data() as Store;
        const { maxProducts } = store;

        const productsQuery = query(collection(db, "Products"), where("storeId", "==", productData.storeId));
        const currentProductCount = (await getCountFromServer(productsQuery)).data().count;

        if (currentProductCount >= maxProducts) {
            return { errors: { _form: [`Se ha alcanzado el límite de ${maxProducts} productos para la tienda "${store.name}". Por favor, actualiza el plan de suscripción.`] } };
        }

        await addDoc(collection(db, "Products"), {
            ...productData,
            normalizedName: productData.name.toLowerCase(),
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            availableIn: [productData.storeId], // Initially available in its primary store
            image: productData.image || `https://picsum.photos/seed/${productData.name}/400/400`,
            price: 0,
        });
        revalidatePath("/dashboard/products");
        return { message: "Producto creado exitosamente." };
    } catch (e: any) {
        console.error(e);
        return { errors: { _form: ["No se pudo crear el producto."] } };
    }
}
