// src/components/features/sales/VenderForm.jsx
import { useState } from 'react';
import Button from '../../common/Button';

const VenderForm = ({ onRegistrarVenta, cierreRealizado, usuarioLogueado }) => {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si ya hay cierre, mostrar mensaje
  if (cierreRealizado) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔒</span>
          <h2 className="text-xl font-bold text-gray-800">Registrar Venta</h2>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-700 font-medium mb-2">⚠️ Día cerrado</p>
          <p className="text-sm text-yellow-600">
            No se pueden registrar más ventas para hoy.
            <br />
            El cierre fue realizado por {cierreRealizado.cerradoPorNombre}.
          </p>
        </div>
      </div>
    );
  }

  const seleccionarMetodoPago = (metodo) => {
    setMetodoPagoSeleccionado(metodo);
    setError('');
  };

  const handleConfirmar = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      setError('Ingresá un monto válido');
      return;
    }
    
    if (!metodoPagoSeleccionado) {
      setError('Seleccioná el método de pago');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onRegistrarVenta(monto, metodoPagoSeleccionado, descripcion, usuarioLogueado);
      setMonto('');
      setDescripcion('');
      setMetodoPagoSeleccionado(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarSeleccion = () => {
    setMetodoPagoSeleccionado(null);
    setError('');
  };

  // Obtener nombre del operador desde el email
  const operadorActual = usuarioLogueado?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Registrar Venta</h2>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          👤 {operadorActual}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Descripción */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Producto (opcional)
        </label>
        <input
          type="text"
          placeholder="Ej: Gati pescado y salmon 15kg"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>
      
      {/* Monto */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Monto $
        </label>
        <input
          type="number"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
          disabled={loading}
          autoFocus
        />
      </div>
      
      {/* Método de pago */}
      {!metodoPagoSeleccionado ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => seleccionarMetodoPago('efectivo')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-xl transition-all duration-200"
            disabled={loading}
          >
            💵 EFECTIVO
          </button>
          
          <button
            onClick={() => seleccionarMetodoPago('tarjeta')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-xl transition-all duration-200"
            disabled={loading}
          >
            💳 TARJETA
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Resumen de la venta:</p>
            <p className="font-semibold text-gray-800">
              Método: {metodoPagoSeleccionado === 'efectivo' ? '💵 EFECTIVO' : '💳 TARJETA'}
            </p>
            <p className="font-semibold text-gray-800">
              Monto: ${parseFloat(monto || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Operador: {operadorActual}
            </p>
            {descripcion && (
              <p className="text-gray-600 text-sm">Producto: {descripcion}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleConfirmar}
              variant="success"
              size="large"
              loading={loading}
              className="w-full py-4 text-xl"
            >
              CONFIRMAR VENTA
            </Button>
            
            <Button
              onClick={cancelarSeleccion}
              variant="secondary"
              size="large"
              disabled={loading}
              className="w-full py-4 text-xl"
            >
              ✖️ CANCELAR
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenderForm;