// src/hooks/useVentas.js
import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export const useVentas = () => {
  const [ventasHoy, setVentasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totales, setTotales] = useState({
    efectivo: 0,
    tarjeta: 0,
    total: 0,
    cantidad: 0
  });

  // Función para obtener fecha local en formato YYYY-MM-DD
  const getFechaLocal = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obtener fecha actual en zona horaria local
  const getFechaHoyLocal = () => {
    return getFechaLocal(new Date());
  };

  // Calcular totales a partir de las ventas
  const calcularTotales = (ventas) => {
    const efectivo = ventas
      .filter(v => v.metodoPago === 'efectivo')
      .reduce((sum, v) => sum + v.monto, 0);
    
    const tarjeta = ventas
      .filter(v => v.metodoPago === 'tarjeta')
      .reduce((sum, v) => sum + v.monto, 0);
    
    setTotales({
      efectivo,
      tarjeta,
      total: efectivo + tarjeta,
      cantidad: ventas.length
    });
  };

  // Configurar escucha en tiempo real con fecha local
  useEffect(() => {
    const fechaHoyLocal = getFechaHoyLocal();
    console.log('📅 Escuchando ventas del día:', fechaHoyLocal);
    
    const q = query(
      collection(db, 'ventas'),
      where('fechaStr', '==', fechaHoyLocal),
      orderBy('fecha', 'desc')
    );
    
    setLoading(true);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ventas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`🔄 Se actualizó: ${ventas.length} ventas hoy`);
      setVentasHoy(ventas);
      calcularTotales(ventas);
      setLoading(false);
    }, (error) => {
      console.error('Error al escuchar ventas:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Registrar una nueva venta  

  const registrarVenta = async (monto, metodoPago, descripcion = '', usuarioLogueado) => {
    if (!monto || monto <= 0) {
      throw new Error('Monto inválido');
    }
    
    if (!usuarioLogueado) {
      throw new Error('Usuario no autenticado');
    }
    
    const ahora = new Date();
    const fechaLocalStr = getFechaLocal(ahora);
    
    // Obtener el nombre del operador desde el email o desde Firestore
    const operadorNombre = usuarioLogueado.email?.split('@')[0] || 'Usuario';
    const operadorId = usuarioLogueado.uid;
    
    const venta = {
      monto: parseFloat(monto),
      metodoPago: metodoPago,
      operadorId: operadorId,
      operadorNombre: operadorNombre,
      operadorEmail: usuarioLogueado.email,
      fecha: ahora,
      fechaStr: fechaLocalStr,
      descripcion: descripcion || '',
      createdAt: ahora
    };
    
    try {
      await addDoc(collection(db, 'ventas'), venta);
      return { success: true };
    } catch (error) {
      console.error('Error al registrar venta:', error);
      throw new Error('Error al guardar la venta');
    }
  };

  return {
    ventasHoy,
    totales,
    loading,
    registrarVenta
  };
};