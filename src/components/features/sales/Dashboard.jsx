// src/components/features/sales/Dashboard.jsx
import { formatMoney } from '../../../utils/formatters';

const Dashboard = ({ totales, ventasRecientes, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Ventas del Día</h2>
      
      {/* Tarjetas de totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Efectivo</p>
          <p className="text-2xl font-bold text-green-700">
            {formatMoney(totales.efectivo)}
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Tarjeta</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatMoney(totales.tarjeta)}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Total General</p>
          <p className="text-2xl font-bold text-purple-700">
            {formatMoney(totales.total)}
          </p>
          <p className="text-xs text-purple-500 mt-1">
            {totales.cantidad} ventas
          </p>
        </div>
      </div>
      
      {/* Últimas ventas */}
      {ventasRecientes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Últimas ventas</h3>
          <div className="space-y-2">
            {ventasRecientes.map(venta => (
              <div
                key={venta.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {venta.metodoPago === 'efectivo' ? '💵' : '💳'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatMoney(venta.monto)}
                    </p>
                    {venta.descripcion && (
                      <p className="text-xs text-gray-500">
                        {venta.descripcion}
                      </p>
                    )}
                      <p className="text-xs text-gray-400">
                        {venta.operadorNombre} • {
                        venta.fecha?.toDate 
                        ? new Date(venta.fecha.toDate()).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                        : new Date(venta.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {ventasRecientes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay ventas registradas hoy
        </div>
      )}
    </div>
  );
};

export default Dashboard;