"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const storeSchema = z.object({
    nombre: z.string().min(1, "Name is required"),
    ciudad: z.string().min(1, "City is required"),
    logo_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export async function createStore(formData: FormData) {
    const values = {
        nombre: formData.get("nombre") as string,
        ciudad: formData.get("ciudad") as string,
        logo_url: formData.get("logo_url") as string,
    };

    const validatedFields = storeSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await addDoc(collection(db, "stores"), {
            ...validatedFields.data,
            logo_url: validatedFields.data.logo_url || `https://picsum.photos/seed/${validatedFields.data.nombre}/100/100`
        });
        revalidatePath("/dashboard/stores");
        return { message: "Store created successfully." };
    } catch (e) {
        return { message: "Failed to create store." };
    }
}

export async function updateStore(id: string, formData: FormData) {
    const values = {
        nombre: formData.get("nombre") as string,
        ciudad: formData.get("ciudad") as string,
        logo_url: formData.get("logo_url") as string,
    };

    const validatedFields = storeSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        const storeRef = doc(db, "stores", id);
        await updateDoc(storeRef, {
            ...validatedFields.data,
            logo_url: validatedFields.data.logo_url || `https://picsum.photos/seed/${validatedFields.data.nombre}/100/100`
        });
        revalidatePath("/dashboard/stores");
        return { message: "Store updated successfully." };
    } catch (e) {
        return { message: "Failed to update store." };
    }
}


export async function deleteStore(id: string) {
    try {
        await deleteDoc(doc(db, "stores", id));
        revalidatePath("/dashboard/stores");
        return { message: "Store deleted successfully." };
    } catch (e) {
        return { message: "Failed to delete store." };
    }
}
