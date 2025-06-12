import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const logActivity = async (message: string, adminEmail: string | null = null) => {
  try {
    await addDoc(collection(db, 'logs'), {
      message,
      admin: adminEmail,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
