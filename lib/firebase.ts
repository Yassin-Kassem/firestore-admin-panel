// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const getUserCount = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.size;
};

export const getRestaurantCount = async () => {
  const snapshot = await getDocs(collection(db, 'restaurants'));
  return snapshot.size;
};

export const getMenuCount = async () => {
  const restaurantsSnap = await getDocs(collection(db, 'restaurants'));
  let menuCount = 0;

  for (const doc of restaurantsSnap.docs) {
    const menusSnap = await getDocs(collection(db, 'restaurants', doc.id, 'menus'));
    menuCount += menusSnap.size;
  }

  return menuCount;
};

export const getMenuItemCount = async () => {
  const restaurantsSnap = await getDocs(collection(db, 'restaurants'));
  let itemCount = 0;

  for (const restaurantDoc of restaurantsSnap.docs) {
    const menusSnap = await getDocs(collection(db, 'restaurants', restaurantDoc.id, 'menus'));
    
    for (const menuDoc of menusSnap.docs) {
      const itemsSnap = await getDocs(
        collection(db, 'restaurants', restaurantDoc.id, 'menus', menuDoc.id, 'menuItems')
      );
      itemCount += itemsSnap.size;
    }
  }

  return itemCount;
};

export const getRecentLogs = async () => {
  const logsQuery = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(10));
  const logsSnapshot = await getDocs(logsQuery);
  return logsSnapshot.docs.map(doc => doc.data());
};
