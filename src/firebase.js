// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

//configuración de Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCEg3MKVQuWu8QdoLI7xHvGtqM7DYQTanE",
  authDomain: "pos-system-f47bf.firebaseapp.com",
  projectId: "pos-system-f47bf",
  storageBucket: "pos-system-f47bf.firebasestorage.app",
  messagingSenderId: "297820755360",
  appId: "1:297820755360:web:c4846bf16863ef7b4100c5"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;