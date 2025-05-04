import { useSelector } from 'react-redux';
import AuthService from '../api/auth';

const DebugPage = () => {
  const authState = useSelector((state) => state.auth);
  const localStorageUser = AuthService.getUserFromLocalStorage();
  const localStorageToken = localStorage.getItem('token');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Redux Auth State</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Local Storage User</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(localStorageUser, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Token Present</h2>
        <p>{localStorageToken ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default DebugPage; 