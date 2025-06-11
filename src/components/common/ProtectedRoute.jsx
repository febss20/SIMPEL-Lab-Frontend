import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthService from '../../api/auth';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = AuthService.hasRole(allowedRoles);
    
    if (!hasAccess) {
      console.log('User does not have required role, redirecting');
      let redirectPath = '/login';
      
      if (user?.role === 'ADMIN') {
        redirectPath = '/admin';
      } else if (user?.role === 'TECHNICIAN') {
        redirectPath = '/technician';
      } else if (user?.role === 'USER') {
        redirectPath = '/user';
      }
      
      return <Navigate to={redirectPath} state={{ from: location }} />;
    }
  }

  console.log('User has required role, rendering children');
  return children;
};

export default ProtectedRoute;