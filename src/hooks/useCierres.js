// src/hooks/useCierres.js
import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, orderBy, deleteDoc } from 'firebase/firestore';

export const useCierres = () => {
  const [cierres, setCierres] = useState([]);
  const [cierreHoy, setCierreHoy] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener fecha local en formato YYYY-MM-DD
  const getFechaLocal = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Verificar si ya hay un cierre para hoy
  const verificarCierreHoy = async () => {
    const fechaHoy = getFechaLocal();
    const q = query(
      collection(db, 'cierres'),
      where('fecha', '==', fechaHoy)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const cierreDoc = snapshot.docs[0];
      setCierreHoy({ id: cierreDoc.id, ...cierreDoc.data() });
      return cierreDoc.data();
    }
    return null;
  };

  // Realizar un nuevo cierre
  const realizarCierre = async (efectivoFisico, totalEfectivoSistema, totalTarjetaSistema, usuario, observaciones) => {
    const fechaHoy = getFechaLocal();
    const diferencia = efectivoFisico - totalEfectivoSistema;

    const observacionesTexto = observaciones || '';
    
    const cierre = {
      fecha: fechaHoy,
      fechaTimestamp: new Date(),
      efectivoSistema: totalEfectivoSistema,
      tarjetaSistema: totalTarjetaSistema,
      totalSistema: totalEfectivoSistema + totalTarjetaSistema,
      efectivoFisico: efectivoFisico,
      diferencia: diferencia,
      cerradoPor: usuario.email,
      cerradoPorNombre: usuario.email?.split('@')[0] || 'Admin',
      observaciones: observacionesTexto,
      createdAt: new Date()
    };
    
    try {
      const docRef = await addDoc(collection(db, 'cierres'), cierre);
      const nuevoCierre = { id: docRef.id, ...cierre };
      setCierreHoy(nuevoCierre);
      await cargarHistorialCierres(); 
      return { success: true, cierre: nuevoCierre };
    } catch (error) {
      console.error('Error al guardar cierre:', error);
      throw new Error('Error al guardar el cierre');
    }
  };

  const reabrirCaja = async () => {
    if (!cierreHoy) {
      return { success: false, error: 'No hay cierre para reabrir' };
    }
    
    try {
      await deleteDoc(doc(db, 'cierres', cierreHoy.id));
      setCierreHoy(null);
      await cargarHistorialCierres(); 
      return { success: true };
    } catch (error) {
      console.error('Error al reabrir caja:', error);
      throw new Error('Error al reabrir la caja');
    }
  };

  // Cargar historial de cierres
  const cargarHistorialCierres = async () => {
    try {
      const q = query(
        collection(db, 'cierres'),
        orderBy('fecha', 'desc')
      );
      const snapshot = await getDocs(q);
      const listaCierres = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCierres(listaCierres);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await verificarCierreHoy();
      await cargarHistorialCierres();
      setLoading(false);
    };
    cargarDatos();
  }, []);

  return {
    cierreHoy,
    cierres,
    loading,
    realizarCierre,
    reabrirCaja,
    verificarCierreHoy,
    cargarHistorialCierres
  };
};