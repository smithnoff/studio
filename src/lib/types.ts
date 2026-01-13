import type { Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  name: string;
  city: string;
  zipcode: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  imageUrl: string;
}

export interface Product {
  id: string; // from productId
  name: string;
  normalizedName: string;
  brand: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  availableIn: string[];
  price: number; // float in kotlin
  storeId: string;
}

export interface User {
  id: string; // from uid
  email: string | null;
  displayName: string;
  photoUrl: string | null;
  cityId: string;
  cityName: string;
  favoriteStoreIds: string[];
  createdAt: number;
  name: string;
}

// This represents the user data stored in the 'users' collection,
// which might be different from the Firebase Auth user object.
export interface AppUser {
  id: string; // from uid
  email: string;
  displayName: string;
  photoUrl: string | null;
  cityId: string;
  cityName: string;
  favoriteStoreIds: string[];
  createdAt: number;
  name: string;
  rol: 'admin' | 'store_manager' | 'store_employee' | 'customer';
  storeId?: string;
}
