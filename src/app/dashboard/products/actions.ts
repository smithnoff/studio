"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  tags: z.string().optional(),
  availableIn: z.string().optional(),
  storeId: z.string().min(1, "Store ID is required"),
});

export async function createProduct(formData: FormData) {
    const values = Object.fromEntries(formData.entries());

    const validatedFields = productSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { tags, availableIn, ...productData } = validatedFields.data;

    try {
        await addDoc(collection(db, "Products"), {
            ...productData,
            normalizedName: productData.name.toLowerCase(),
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            availableIn: availableIn ? availableIn.split(',').map(id => id.trim()) : [],
            image: productData.image || `https://picsum.photos/seed/${productData.name}/400/400`,
            price: 0,
        });
        revalidatePath("/dashboard/products");
        return { message: "Product created successfully." };
    } catch (e) {
        console.error(e);
        return { message: "Failed to create product." };
    }
}
