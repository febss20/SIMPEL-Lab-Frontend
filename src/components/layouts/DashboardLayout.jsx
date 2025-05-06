import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import AuthService from '../../api/auth';
import '../../utils/animations.css';

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const EquipmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
  </svg>
);

const LoansIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
  </svg>
);

const RequestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const RepairsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const SparePartsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  </svg>
);

const LabIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6 2a1 1 0 00-1 1v2a1 1 0 00.293.707L9 9.414V15a3 3 0 106 0v-5.586l3.707-3.707A1 1 0 0017 5V3a1 1 0 00-1-1H6zm2 2V3h6v2h-6zm6 2.586L13.414 7H8.586L7 6.586V5h8v1.586zM12 15a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const localStorageUser = AuthService.getUserFromLocalStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('DashboardLayout rendered with user:', { 
      reduxUser: user, 
      localStorageUser,
      pathname: location.pathname 
    });
  }, [user, localStorageUser, location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getNavLinks = () => {
    const currentUser = user || localStorageUser;
    
    if (!currentUser) {
      console.log('No user found in DashboardLayout');
      return [{ name: 'Dashboard', path: '/user', icon: <DashboardIcon /> }];
    }
    
    console.log('Generating nav links for role:', currentUser.role);
    
    const baseLinks = [
      { name: 'Dashboard', path: `/${currentUser.role?.toLowerCase() || 'user'}`, icon: <DashboardIcon /> }
    ];
    
    switch (currentUser.role) {
      case 'ADMIN':
        return [
          ...baseLinks,
          { name: 'Lab', path: '/admin/lab', icon: <LabIcon /> },
          { name: 'Pengguna ', path: '/admin/users', icon: <UsersIcon /> },
          { name: 'Peralatan', path: '/admin/equipment', icon: <EquipmentIcon /> },
          { name: 'Peminjaman', path: '/admin/loans', icon: <LoansIcon /> },
          { name: 'Laporan', path: '/admin/reports', icon: <ReportsIcon /> },
        ];
      case 'TECHNICIAN':
        return [
          ...baseLinks,
          { name: 'Peralatan', path: '/technician/equipment', icon: <EquipmentIcon /> },
          { name: 'Perawatan', path: '/technician/maintenance', icon: <MaintenanceIcon /> },
          { name: 'Perbaikan', path: '/technician/repairs', icon: <RepairsIcon /> },
          { name: 'Spare Part', path: '/technician/spare-parts', icon: <SparePartsIcon /> },
        ];
      default:
        return [
          ...baseLinks,
          { name: 'Peralatan', path: '/user/equipment', icon: <EquipmentIcon /> },
          { name: 'Peminjaman', path: '/user/loans', icon: <LoansIcon /> },
          { name: 'Permintaan Peminjaman', path: '/user/request', icon: <RequestIcon /> },
        ];
    }
  };

  const navLinks = getNavLinks();
  const currentUser = user || localStorageUser;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Warning: No user data found</p>
          <p>This may indicate an authentication issue.</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Return to Login
        </button>
        <button 
          onClick={() => navigate('/debug')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ml-2"
        >
          View Debug Info
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50 glass-effect bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-indigo-700 text-xl font-bold transition-all hover:scale-105 duration-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 2a1 1 0 00-1 1v2a1 1 0 00.293.707L9 9.414V15a3 3 0 106 0v-5.586l3.707-3.707A1 1 0 0017 5V3a1 1 0 00-1-1H6z" />
                  </svg>
                  SIMPEL Lab Manager
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${
                      location.pathname === link.path
                        ? 'text-indigo-700 border-indigo-500 bg-indigo-50 font-semibold shadow-sm'
                        : 'text-gray-700 border-transparent hover:text-indigo-600 hover:border-indigo-300 hover:bg-gray-50'
                    } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-md mx-1 transition-all duration-300 ease-in-out hover-scale`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Link
                    to="/admin/me"
                    className="text-gray-700 mr-4 font-medium flex items-center hover:underline hover:text-indigo-700 transition-colors"
                    title="Lihat Profil Admin"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {currentUser?.firstName} {currentUser?.lastName}
                    <span className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{currentUser?.role}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-indigo-700 transition-colors px-3 py-1.5 rounded-md shadow-sm text-sm flex items-center gap-1 hover-scale"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`${isMobileMenuOpen ? 'block animate-fadeIn' : 'hidden'} sm:hidden absolute w-full bg-white shadow-lg z-50 border-t`}>
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon}
                  {link.name}
                </div>
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                  </div>
                </div>
                <div className="ml-3">
                  <Link to="/admin/me" className="text-base font-medium text-gray-800 hover:underline hover:text-indigo-700 transition-colors">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Link>
                  <div className="text-sm font-medium text-gray-500">{currentUser?.role}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md modern-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 