import type { Timestamp } from "firebase/firestore";

export type SubscriptionPlan = 'BASIC' | 'STANDARD' | 'PREMIUM';

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
  subscriptionPlan: SubscriptionPlan;
  isActive: boolean;
  isOpen: boolean; // nuevo campo
  maxProducts: number;
  allowReservations: boolean;
  featured: boolean;
  createdAt: number;
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
}

export interface StoreProduct {
    id: string;
    storeId: string;
    productId: string;
    price: number;
    isAvailable: boolean;
    storeSpecificImage?: string;
    // Combinamos la info del producto global para facilitar la visualización
    name: string;
    brand: string;
    category: string;
    globalImage: string;
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
