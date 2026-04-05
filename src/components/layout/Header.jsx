// src/components/layout/Header.jsx
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const { user, logout } = useAuth();

  // Obtener nombre del usuario desde el email (primer parte antes del @)
  const getNombreUsuario = () => {
    if (!user?.email) return 'Usuario';
    return user.email.split('@')[0];
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">Sistema de Caja</h1>
              <p className="text-xs text-blue-100">Registro de ventas diarias</p>
            </div>
          </div>
          
          {/* Información del usuario */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-blue-100">Bienvenido</p>
                <p className="text-sm font-semibold text-white">{getNombreUsuario()}</p>
              </div>
              <Button 
                onClick={logout} 
                variant="secondary" 
                size="small"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;