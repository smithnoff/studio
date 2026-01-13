"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, query, where, getCountFromServer } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import type { Store } from "@/lib/types";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  tags: z.string().optional(),
  storeId: z.string().min(1, "A primary store is required"),
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
            return { errors: { _form: ["Selected store does not exist."] } };
        }

        const store = storeSnap.data() as Store;
        const { maxProducts } = store;

        const productsQuery = query(collection(db, "Products"), where("storeId", "==", productData.storeId));
        const currentProductCount = (await getCountFromServer(productsQuery)).data().count;

        if (currentProductCount >= maxProducts) {
            return { errors: { _form: [`Product limit of ${maxProducts} for store "${store.name}" has been reached. Please upgrade the subscription plan.`] } };
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
        return { message: "Product created successfully." };
    } catch (e: any) {
        console.error(e);
        return { errors: { _form: ["Failed to create product."] } };
    }
}

    