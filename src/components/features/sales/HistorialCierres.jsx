// src/components/features/sales/HistorialCierres.jsx
import { useState } from 'react';
import { formatMoney } from '../../../utils/formatters';

const HistorialCierres = ({ cierres }) => {
  const [expandido, setExpandido] = useState(false);

  if (cierres.length === 0) {
    return null;
  }

  const ultimosCierres = expandido ? cierres : cierres.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h2 className="text-xl font-bold text-gray-800">Historial de Cierres</h2>
        </div>
        {cierres.length > 3 && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {expandido ? 'Ver menos' : `Ver todos (${cierres.length})`}
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {ultimosCierres.map((cierre) => (
          <div
            key={cierre.id}
            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-800">
                📅 {cierre.fecha}
              </span>
              <span className={`text-sm px-2 py-0.5 rounded-full ${
                cierre.diferencia === 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {cierre.diferencia === 0 ? 'Perfecto' : 'Con diferencia'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Efectivo sistema:</div>
              <div className="text-right font-medium">{formatMoney(cierre.efectivoSistema)}</div>
              
              <div className="text-gray-600">Efectivo físico:</div>
              <div className="text-right font-medium">{formatMoney(cierre.efectivoFisico)}</div>
              
              <div className="text-gray-600">Diferencia:</div>
              <div className={`text-right font-medium ${
                cierre.diferencia === 0 
                  ? 'text-green-600' 
                  : cierre.diferencia > 0 
                    ? 'text-blue-600' 
                    : 'text-red-600'
              }`}>
                {cierre.diferencia === 0 
                  ? '✓' 
                  : (cierre.diferencia > 0 ? '+' : '') + formatMoney(cierre.diferencia)
                }
              </div>
              
              <div className="text-gray-600">Cerrado por:</div>
              <div className="text-right text-gray-700">{cierre.cerradoPorNombre}</div>
            </div>
            
            {cierre.observaciones && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">{cierre.observaciones}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialCierres;