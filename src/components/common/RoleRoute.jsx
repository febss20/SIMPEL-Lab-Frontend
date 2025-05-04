import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import AuthService from '../../api/auth';


const RoleRoute = ({ roles, children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <PrivateRoute>
      {(() => {
        if (!user) {
          console.log('No user found in RoleRoute');
          return <Navigate to="/login" />;
        }

        console.log('Checking role access:', { userRole: user.role, requiredRoles: roles });
        
        const hasAccess = AuthService.hasRole(roles);
        
        if (!hasAccess) {
          console.log('User does not have required role, redirecting');
          let redirectPath = '/login';
          
          if (user.role === 'ADMIN') {
            redirectPath = '/admin';
          } else if (user.role === 'TECHNICIAN') {
            redirectPath = '/technician';
          } else if (user.role === 'USER') {
            redirectPath = '/user';
          }
          
          return <Navigate to={redirectPath} state={{ from: location }} />;
        }
        
        console.log('User has required role, rendering children');
        return children;
      })()}
    </PrivateRoute>
  );
};

export default RoleRoute; 