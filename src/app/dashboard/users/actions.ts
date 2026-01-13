'use server';

import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const userSchema = z.object({
  email: z.string().email('Dirección de correo electrónico inválida.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  rol: z.enum(['admin', 'store_manager', 'store_employee', 'customer']),
  storeId: z.string().optional(),
});

export async function createUser(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = userSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name, rol, storeId } = validatedFields.data;

  try {
    // We can't create users directly from a server action using the Firebase Admin SDK
    // without it being initialized. A common pattern is to have a callable function or handle this
    // on a dedicated backend. For this context, we will assume a user can be created
    // and then their data is stored.
    // NOTE: In a real app, creating users should be done via a secure backend endpoint
    // that uses the Firebase Admin SDK, as client-side creation can be abused.
    // The following is a placeholder for that logic.

    // A real implementation would look something like this with Admin SDK:
    // const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    // await setDoc(doc(db, "Users", userRecord.uid), { ... });

    // Since we don't have Admin SDK set up, we can't create users on the backend directly here.
    // We'll return an error message indicating this limitation.
    // A proper implementation would require a dedicated backend setup.
    return {
      message:
        'La creación de usuarios desde la acción del servidor no está completamente implementada. Por favor, use la consola de Firebase.',
      // The below code would run on the client, not here.
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      // await setDoc(doc(db, "Users", user.uid), {
      //     uid: user.uid,
      //     email,
      //     name,
      //     displayName: name,
      //     rol,
      //     storeId: storeId || null,
      //     createdAt: Date.now(),
      //     photoUrl: null,
      //     cityId: "",
      //     cityName: "",
      //     favoriteStoreIds: [],
      // });
      // revalidatePath("/dashboard/users");
      // return { message: "Usuario creado exitosamente. Se ha enviado un correo de verificación." };
    };
  } catch (e: any) {
    console.error(e);
    // Firebase errors have a 'code' property e.g. 'auth/email-already-in-use'
    return {
      message: e.message || 'No se pudo crear el usuario.',
      errors: { _form: [e.message] },
    };
  }
}
