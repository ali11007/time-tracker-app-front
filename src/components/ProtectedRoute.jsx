import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
