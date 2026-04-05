/* // src/hooks/useOperadores.js
import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const useOperadores = () => {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOperadores = async () => {
      try {
        const q = query(
          collection(db, 'usuarios'),
          where('activo', '==', true)
        );
        
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setOperadores(users);
      } catch (error) {
        console.error('Error al cargar operadores:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarOperadores();
  }, []);

  return { operadores, loading };
}; */