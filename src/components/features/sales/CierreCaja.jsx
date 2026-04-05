// src/components/features/sales/CierreCaja.jsx
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button';
import { formatMoney } from '../../../utils/formatters';

const CierreCaja = ({ totales, onCierreRealizado, cierreExistente, onReabrirCaja }) => {
  const { user } = useAuth();
  const [efectivoFisico, setEfectivoFisico] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  // Si ya hay cierre, mostrar resumen
  if (cierreExistente) {
    
    const esAdmin = user?.email === 'lautarogorosito@gmail.com' || user?.email?.includes('admin');
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔒</span>
          <h2 className="text-xl font-bold text-gray-800">Cierre del Día</h2>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-700 font-medium">✅ Día cerrado correctamente</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Efectivo según sistema:</span>
            <span className="font-semibold">{formatMoney(cierreExistente.efectivoSistema)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Efectivo físico contado:</span>
            <span className="font-semibold">{formatMoney(cierreExistente.efectivoFisico)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Diferencia:</span>
            <span className={`font-semibold ${cierreExistente.diferencia === 0 ? 'text-green-600' : cierreExistente.diferencia > 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {cierreExistente.diferencia === 0 ? '✓ Perfecto' : formatMoney(cierreExistente.diferencia)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Cerrado por:</span>
            <span className="text-gray-800">{cierreExistente.cerradoPorNombre}</span>
          </div>
        </div>
        
        {cierreExistente.observaciones && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Observaciones:</p>
            <p className="text-gray-700">{cierreExistente.observaciones}</p>
          </div>
        )}

        {/*REABRIR*/}
        {esAdmin && onReabrirCaja && (
          <button
            onClick={onReabrirCaja}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            🔓 Reabrir Caja (solo pruebas)
          </button>
        )}
      </div>
    );
  }

  // Formulario de cierre
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!efectivoFisico || parseFloat(efectivoFisico) < 0) {
      setError('Ingresá el monto de efectivo físico');
      return;
    }
    
    if (!confirmado) {
      setError('Confirmá que querés realizar el cierre');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onCierreRealizado(
        parseFloat(efectivoFisico),
        totales.efectivo,
        totales.tarjeta,
        user,
        observaciones
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const diferenciaPreview = efectivoFisico 
    ? parseFloat(efectivoFisico) - totales.efectivo 
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💰</span>
        <h2 className="text-xl font-bold text-gray-800">Cierre de Caja</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Totales del sistema */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">Totales según sistema:</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Efectivo:</span>
              <span className="font-semibold text-green-600">{formatMoney(totales.efectivo)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarjeta:</span>
              <span className="font-semibold text-blue-600">{formatMoney(totales.tarjeta)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{formatMoney(totales.total)}</span>
            </div>
          </div>
        </div>
        
        {/* Efectivo físico */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Efectivo físico en caja $
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={efectivoFisico}
            onChange={(e) => setEfectivoFisico(e.target.value)}
            className="w-full px-4 py-2 text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            disabled={loading}
          />
        </div>
        
        {/* Diferencia */}
        {diferenciaPreview !== null && (
          <div className={`p-3 rounded-lg mb-4 ${
            diferenciaPreview === 0 
              ? 'bg-green-50 border border-green-200' 
              : diferenciaPreview > 0 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Diferencia:</span>
              <span className={`text-xl font-bold ${
                diferenciaPreview === 0 
                  ? 'text-green-600' 
                  : diferenciaPreview > 0 
                    ? 'text-blue-600' 
                    : 'text-red-600'
              }`}>
                {diferenciaPreview === 0 
                  ? '✓ Perfecto' 
                  : (diferenciaPreview > 0 ? '+' : '') + formatMoney(diferenciaPreview)
                }
              </span>
            </div>
            {diferenciaPreview !== 0 && (
              <p className="text-xs mt-1 text-gray-500">
                {diferenciaPreview > 0 
                  ? '💰 Hay más efectivo del esperado. Revisar.' 
                  : '⚠️ Falta efectivo. Revisar ventas o buscar diferencia.'}
              </p>
            )}
          </div>
        )}
        
        {/* Observaciones */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones (opcional)
          </label>
          <textarea
            placeholder="Ej: Faltante de $500, revisar cámaras..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        {/* Checkbox de confirmación */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              Confirmo que he contado el efectivo físico y quiero cerrar el día
            </span>
          </label>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          loading={loading}
          className="w-full py-3"
        >
          🔒 CERRAR DÍA
        </Button>
      </form>
    </div>
  );
};

export default CierreCaja;