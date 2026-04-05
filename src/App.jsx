// src/App.jsx
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { useVentas } from './hooks/useVentas';
import { useCierres } from './hooks/useCierres';
import LoginForm from './components/features/auth/LoginForm';
import Header from './components/layout/Header';
import VenderForm from './components/features/sales/VenderForm';
import Dashboard from './components/features/sales/Dashboard';
import CierreCaja from './components/features/sales/CierreCaja';
import HistorialCierres from './components/features/sales/HistorialCierres';
import './index.css';

// Componente principal después del login
const DashboardContent = () => {
  const { user } = useAuth();
  const { totales, ventasHoy, loading, registrarVenta } = useVentas();
  const { cierreHoy, cierres, realizarCierre, reabrirCaja } = useCierres();

  const handleReabrirCaja = async () => {
    if (confirm('⚠️ ¿Reabrir la caja? Podrás registrar nuevas ventas. Esta acción es solo para pruebas.')) {
      try {
        await reabrirCaja();
        alert('✅ Caja reabierta. Podés seguir registrando ventas.');
      } catch (error) {
        alert('❌ Error al reabrir: ' + error.message);
      }
    }
  };

  // Función para manejar el cierre
  const handleCierre = async (efectivoFisico, totalEfectivo, totalTarjeta, usuario, observaciones) => {
    const observacionesTexto = observaciones || '';
    
    await realizarCierre(efectivoFisico, totalEfectivo, totalTarjeta, usuario, observacionesTexto);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Formulario de venta */}
        <div className="space-y-6">
          <VenderForm
            onRegistrarVenta={registrarVenta}
            cierreRealizado={cierreHoy} 
            usuarioLogueado={user}
          />
        </div>
        
        {/* Columna derecha: Dashboard y Cierre */}
        <div className="space-y-6">
          <Dashboard
            totales={totales}
            ventasRecientes={ventasHoy}
            loading={loading}
          />
          
          <CierreCaja
            totales={totales}
            onCierreRealizado={handleCierre}
            cierreExistente={cierreHoy}
            onReabrirCaja={handleReabrirCaja} 
          />
        </div>
      </div>
      
      {/* Historial de cierres - ocupa todo el ancho */}
      <div className="mt-6">
        <HistorialCierres cierres={cierres} />
      </div>
    </div>
  );
};

// Componente que decide qué mostrar según autenticación
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  return user ? (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardContent />
    </div>
  ) : (
    <LoginForm />
  );
};

// App principal
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;