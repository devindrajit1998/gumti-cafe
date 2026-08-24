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
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDzJgnT0ETDvvsaL8IlcxgCzn45T6g97gY',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'gumti-a522c.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gumti-a522c',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gumti-a522c.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '891124554115',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:891124554115:web:1569e6c9bac8d5d33efeb6',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-LXRVC9M61Z',
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
    updatedAt?: string;
}

const restaurantDocument = doc(firestore, 'restaurants', 'ghuti-cafe');

export const saveRestaurantCloudData = async (data: RestaurantCloudData) => {
    await setDoc(restaurantDocument, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
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
