import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../api/axios';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loans, setLoans] = useState([]);
  const [popularEquipment, setPopularEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const loansRes = await api.get(`/loans/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const equipmentRes = await api.get('/equipment');
        const loansData = loansRes.data.map(l => ({
          id: l.id,
          equipment: l.equipment?.name || '-',
          loanDate: l.startDate ? new Date(l.startDate).toLocaleDateString('id-ID') : '-',
          dueDate: l.endDate ? new Date(l.endDate).toLocaleDateString('id-ID') : '-',
          status: l.status ? l.status.toLowerCase() : '-',
        }));
        setLoans(loansData);
        const eqList = equipmentRes.data
          .map(eq => ({
            id: eq.id,
            name: eq.name,
            category: eq.type,
            availability: eq.status === 'AVAILABLE' ? eq.quantity || 1 : 0,
            image: eq.image || 'https://via.placeholder.com/150',
          }))
          .sort((a, b) => b.availability - a.availability)
          .slice(0, 4);
        setPopularEquipment(eqList);
        setIsLoading(false);
      } catch (err) {
        setError('Gagal memuat data dashboard');
        setIsLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, [user.id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm animate-fadeIn">
          <p className="font-medium">Oops! Something went wrong</p>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'returned':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-indigo-600 bg-indigo-100';
      case 'rejected':
        return 'text-gray-600 bg-gray-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedLoans = [...loans].sort((a, b) => {
    const dateA = a.loanDate === '-' ? 0 : new Date(a.loanDate).getTime();
    const dateB = b.loanDate === '-' ? 0 : new Date(b.loanDate).getTime();
    return dateB - dateA;
  });

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-8 p-6 text-white animate-fadeIn relative">
          <div className="flex items-center">
            <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Selamat Datang, {user?.username}!</h1>
              <p className="opacity-80">Dashboard Pengguna - {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-4 inline-flex items-center text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
            Pengguna aktif
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Alat Saya</p>
                <h3 className="text-3xl font-bold mt-1">{loans.filter(l => l.status === 'active').length}</h3>
                <p className="text-blue-100 text-xs mt-1">Sedang dipinjam</p>
              </div>
              <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-md p-6 text-white transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Permintaan Pending</p>
                <h3 className="text-3xl font-bold mt-1">{loans.filter(l => l.status === 'pending').length}</h3>
                <p className="text-green-100 text-xs mt-1">Menunggu persetujuan</p>
              </div>
              <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md p-6 text-white transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Alat Tersedia</p>
                <h3 className="text-3xl font-bold mt-1">{popularEquipment.reduce((total, eq) => total + eq.availability, 0)}</h3>
                <p className="text-purple-100 text-xs mt-1">Siap dipinjam</p>
              </div>
              <div className="p-3 bg-white bg-opacity-30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 animate-fadeIn" style={{animationDelay: "0.1s"}}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
              Peminjaman Saya
            </h2>
            <Link 
              to="/user/loans" 
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium hover:underline"
            >
              Lihat Semua
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {loans.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg duration-300">
              <div className="overflow-x-auto modern-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Alat
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tanggal Pinjam
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Jatuh Tempo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedLoans.slice(0, 5).map((loan, index) => (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors" style={{animationDelay: `${index * 0.05}s`}}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{loan.equipment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{loan.loanDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{loan.dueDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link to={`/user/loans/${loan.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors hover:underline mr-3">
                            Detail
                          </Link>
                          {loan.status === 'active' && (
                            <button className="text-green-600 hover:text-green-900 font-medium transition-colors hover:underline">
                              Kembalikan
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100 transition-all hover:shadow-lg duration-300">
              <div className="inline-block p-4 bg-indigo-100 text-indigo-600 mb-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">Anda belum memiliki peminjaman aktif.</p>
              <Link
                to="/user/request"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-md shadow-sm hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Ajukan Peminjaman
              </Link>
            </div>
          )}
        </div>
        
        <div className="animate-fadeIn" style={{animationDelay: "0.2s"}}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
              Alat Populer
            </h2>
            <Link 
              to="/user/equipment" 
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium hover:underline"
            >
              Lihat Semua
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularEquipment.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 card-shadow animate-fadeIn"
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-300 mr-2"></span>
                    {item.category}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.availability > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.availability > 0 
                        ? `${item.availability} tersedia` 
                        : 'Tidak tersedia'
                      }
                    </span>
                    <Link
                      to={`/user/equipment/${item.id}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors hover:underline"
                    >
                      Detail
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 animate-fadeIn" style={{animationDelay: "0.4s"}}>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/user/request"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <span className="absolute right-0 top-0 h-16 w-16 -mt-3 -mr-3 rounded-full bg-white bg-opacity-20 transform rotate-45"></span>
              <span className="absolute left-0 bottom-0 h-10 w-10 -mb-3 -ml-3 rounded-full bg-white bg-opacity-10 transform rotate-45"></span>
              <div className="relative z-10 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">Ajukan Peminjaman</span>
              </div>
            </Link>
            <Link
              to="/user/loans"
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <span className="absolute right-0 top-0 h-16 w-16 -mt-3 -mr-3 rounded-full bg-white bg-opacity-20 transform rotate-45"></span>
              <span className="absolute left-0 bottom-0 h-10 w-10 -mb-3 -ml-3 rounded-full bg-white bg-opacity-10 transform rotate-45"></span>
              <div className="relative z-10 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <span className="font-bold">Lihat Peminjaman</span>
              </div>
            </Link>
            <Link
              to="/user/equipment"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <span className="absolute right-0 top-0 h-16 w-16 -mt-3 -mr-3 rounded-full bg-white bg-opacity-20 transform rotate-45"></span>
              <span className="absolute left-0 bottom-0 h-10 w-10 -mb-3 -ml-3 rounded-full bg-white bg-opacity-10 transform rotate-45"></span>
              <div className="relative z-10 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" />
                </svg>
                <span className="font-bold">Lihat Semua Alat</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard; 