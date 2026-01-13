"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const storeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string().min(1, "City is required"),
    zipcode: z.string().min(1, "Zipcode is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    subscriptionPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
});

function getPlanDetails(plan: 'BASIC' | 'STANDARD' | 'PREMIUM') {
    switch (plan) {
        case 'BASIC':
            return { maxProducts: 20, allowReservations: false, featured: false };
        case 'STANDARD':
            return { maxProducts: 200, allowReservations: true, featured: false };
        case 'PREMIUM':
            return { maxProducts: 10000, allowReservations: true, featured: true };
    }
}

export async function createStore(formData: FormData) {
    const values = {
        name: formData.get("name") as string,
        city: formData.get("city") as string,
        zipcode: formData.get("zipcode") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        latitude: formData.get("latitude") as string,
        longitude: formData.get("longitude") as string,
        imageUrl: formData.get("imageUrl") as string,
        subscriptionPlan: formData.get("subscriptionPlan") as 'BASIC' | 'STANDARD' | 'PREMIUM',
    };

    const validatedFields = storeSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const planDetails = getPlanDetails(validatedFields.data.subscriptionPlan);

    try {
        await addDoc(collection(db, "Stores"), {
            ...validatedFields.data,
            ...planDetails,
            isActive: true,
            createdAt: Date.now(),
            imageUrl: validatedFields.data.imageUrl || `https://picsum.photos/seed/${validatedFields.data.name}/100/100`
        });
        revalidatePath("/dashboard/stores");
        return { message: "Store created successfully." };
    } catch (e) {
        return { message: "Failed to create store." };
    }
}

export async function updateStore(id: string, formData: FormData) {
    const values = {
        name: formData.get("name") as string,
        city: formData.get("city") as string,
        zipcode: formData.get("zipcode") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        latitude: formData.get("latitude") as string,
        longitude: formData.get("longitude") as string,
        imageUrl: formData.get("imageUrl") as string,
        subscriptionPlan: formData.get("subscriptionPlan") as 'BASIC' | 'STANDARD' | 'PREMIUM',
    };

    const validatedFields = storeSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const planDetails = getPlanDetails(validatedFields.data.subscriptionPlan);
    
    try {
        const storeRef = doc(db, "Stores", id);
        await updateDoc(storeRef, {
            ...validatedFields.data,
            ...planDetails,
            imageUrl: validatedFields.data.imageUrl || `https://picsum.photos/seed/${validatedFields.data.name}/100/100`
        });
        revalidatePath("/dashboard/stores");
        return { message: "Store updated successfully." };
    } catch (e) {
        return { message: "Failed to update store." };
    }
}


export async function deleteStore(id: string) {
    try {
        await deleteDoc(doc(db, "Stores", id));
        revalidatePath("/dashboard/stores");
        return { message: "Store deleted successfully." };
    } catch (e) {
        return { message: "Failed to delete store." };
    }
}
