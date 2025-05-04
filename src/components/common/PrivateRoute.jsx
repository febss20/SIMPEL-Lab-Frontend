import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} />;
  }

  console.log('Authenticated user:', user);
  
  return children;
};

export default PrivateRoute; 