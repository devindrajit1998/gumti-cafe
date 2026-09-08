import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
    doc,
    getFirestore,
    onSnapshot,
    setDoc,
    type Unsubscribe,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);

if (typeof window !== 'undefined') {
    void isSupported().then((supported) => {
        if (supported) getAnalytics(firebaseApp);
    }).catch(() => undefined);
}

export interface RestaurantCloudData {
    profile?: unknown;
    menu?: unknown;
    menuVersion?: number;
    orders?: unknown;
    bookings?: unknown;
    bookingConfig?: unknown;
    categories?: unknown;
    coupons?: unknown;
    customers?: unknown;
    announcement?: unknown;
    banners?: unknown;
    updatedAt?: string;
}

export const sanitizeForFirestore = (obj: any): any => {
    if (obj === undefined) return null;
    if (obj === null) return null;
    if (Array.isArray(obj)) {
        return obj
            .filter((item) => item !== undefined)
            .map((item) => sanitizeForFirestore(item));
    }
    if (typeof obj === 'object' && !(obj instanceof Date)) {
        const cleaned: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                cleaned[key] = sanitizeForFirestore(value);
            }
        }
        return cleaned;
    }
    return obj;
};

const restaurantDocument = doc(firestore, 'restaurants', 'ghuti-cafe');

export const saveRestaurantCloudData = async (data: RestaurantCloudData) => {
    const sanitized = sanitizeForFirestore({
        ...data,
        updatedAt: new Date().toISOString(),
    });
    await setDoc(restaurantDocument, sanitized, { merge: true });
};

export const subscribeToRestaurantCloudData = (
    onData: (data: RestaurantCloudData) => void,
    onError?: (error: Error) => void,
): Unsubscribe => onSnapshot(
    restaurantDocument,
    (snapshot) => {
        onData(snapshot.exists() ? snapshot.data() as RestaurantCloudData : {});
    },
    (error) => onError?.(error),
);
