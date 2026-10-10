import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ TEST uniquement — remplace par ta config (Console Firebase → Project settings)
const firebaseConfig = {
  apiKey: 'xxx',
  authDomain: 'safeguardian-xxx.firebaseapp.com',
  projectId: 'safeguardian-xxx',
  storageBucket: 'safeguardian-xxx.appspot.com',
  messagingSenderId: '000',
  appId: '1:000:web:xxx',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
