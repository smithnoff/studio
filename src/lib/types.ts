import type { Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  nombre: string;
  ciudad: string;
  logo_url: string;
}

export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  imagen_url: string;
}

export interface User {
  id: string;
  email: string | null;
  rol: 'admin' | 'user';
}

// This represents the user data stored in the 'users' collection,
// which might be different from the Firebase Auth user object.
export interface AppUser {
  id: string;
  email: string;
  rol: 'admin' | 'user';
  // any other fields from your users collection
}
