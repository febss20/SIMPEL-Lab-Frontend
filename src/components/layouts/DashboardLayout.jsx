import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import AuthService from '../../api/auth';
import UnreadBadge from '../common/UnreadBadge';
import FloatingIcon from '../common/FloatingIcon';
import NotificationBell from '../common/NotificationBell';
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
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
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

const LabBookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);



const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
          { name: 'Booking Lab', path: '/admin/labs/bookings', icon: <LabBookingIcon /> },
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
          { name: 'Laboratorium', path: '/user/lab', icon: <LabIcon /> },
          { name: 'Booking Lab', path: '/user/lab/bookings', icon: <LabBookingIcon /> },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-3"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-3"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            {/* Logo */}
            <span className="text-indigo-700 text-xl font-bold transition-all hover:scale-105 duration-300 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 2a1 1 0 00-1 1v2a1 1 0 00.293.707L9 9.414V15a3 3 0 106 0v-5.586l3.707-3.707A1 1 0 0017 5V3a1 1 0 00-1-1H6z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg">SIMPEL</span>
                <span className="text-sm text-gray-500 font-normal">Lab Manager</span>
              </div>
            </span>
          </div>
          
          {/* Right side - Profile, Notifications, Logout */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            
            {/* Profile */}
            <Link
              to="/admin/me"
              className="text-gray-700 font-medium flex items-center hover:underline hover:text-indigo-700 transition-colors"
              title="Lihat Profil"
            >
              <div className="bg-indigo-100 rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden sm:block">{currentUser?.firstName} {currentUser?.lastName}</span>
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-700 font-medium flex items-center hover:text-red-600 transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 4a1 1 0 11-2 0V5a1 1 0 112 0v2zm0 4a1 1 0 11-2 0v2a1 1 0 112 0v-2z" clipRule="evenodd" />
                <path d="M4 8a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1z" />
                <path d="M11 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
              </svg>
              <span className="hidden sm:block ml-1">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
       <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-80'} fixed left-0 top-16 bottom-0 z-40`}>
         <div className="flex flex-col w-full">
           <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            {/* Navigation */}
            <nav className="mt-5 flex-1 px-2 space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    location.pathname === link.path
                      ? 'bg-indigo-50 border-r-4 border-indigo-500 text-indigo-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  } group flex items-center ${isSidebarCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'} text-base font-medium rounded-l-lg transition-all duration-300 ease-in-out hover:shadow-md`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  title={isSidebarCollapsed ? link.name : ''}
                >
                  <div className={`${
                    location.pathname === link.path
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-indigo-500'
                  } ${isSidebarCollapsed ? '' : 'mr-4'} flex-shrink-0 transition-colors duration-300`}>
                    {link.icon}
                  </div>
                  {!isSidebarCollapsed && <span className="truncate">{link.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden fixed top-16 left-0 right-0 z-40`}>
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="pt-3 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${location.pathname === link.path
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  } block pl-6 pr-6 py-4 border-l-4 text-lg font-medium flex items-center`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-4">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
       <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
         <main className="flex-1 relative overflow-y-auto focus:outline-none mt-16">
           <div className="py-6 px-4 sm:px-6 lg:px-8 animate-fadeIn">
             {children}
           </div>
         </main>
        
        {/* Footer */}
        <footer className="bg-white shadow-inner py-4 border-t border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SIMPEL Lab Manager. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Floating Message Icon */}
      {currentUser && (
        <FloatingIcon
          to={`/${currentUser.role?.toLowerCase() || 'user'}/messages`}
          title="Pesan"
          color="indigo"
          showBadge={true}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          }
          badgeContent={<UnreadBadge />}
        />
      )}

    </div>
  );
};

export default DashboardLayout;