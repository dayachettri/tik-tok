import { initializeApp } from 'firebase-app';
import { getStorage } from 'firebase-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBewLoXI3zKgMTIJBRGiKAIePL41nq8N34',
  authDomain: 'tik-tok-787b6.firebaseapp.com',
  projectId: 'tik-tok-787b6',
  storageBucket: 'tik-tok-787b6.appspot.com',
  messagingSenderId: '664962763377',
  appId: '1:664962763377:web:5a02eeeeb2f8cad687a9d0',
  measurementId: 'G-W129084451',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
