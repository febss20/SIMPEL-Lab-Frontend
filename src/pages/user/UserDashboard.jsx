import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { formatDate } from '../../utils/formatters';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loans, setLoans] = useState([]);
  const [popularEquipment, setPopularEquipment] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's loans
        const loansResponse = await axios.get(`/loans/user/${user.id}`);
        
        // Fetch popular equipment
        const popularEquipmentResponse = await axios.get('/equipment/popular');
        
        // Fetch user's lab bookings
        const labBookingsResponse = await axios.get('/lab-bookings/user');

        setLoans(loansResponse.data);
        setPopularEquipment(popularEquipmentResponse.data);
        setLabBookings(labBookingsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard. Silakan coba lagi nanti.');
        toast.error('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort loans by status (APPROVED and PENDING first) and then by createdAt date
  const sortedLoans = [...loans].sort((a, b) => {
    const statusOrder = { APPROVED: 0, PENDING: 1, OVERDUE: 2, REJECTED: 3, RETURNED: 4 };
    const statusA = statusOrder[a.status] || 5;
    const statusB = statusOrder[b.status] || 5;
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, 5); // Get only the first 5 loans

  // Sort lab bookings by date (upcoming first)
  const sortedLabBookings = [...labBookings].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  }).filter(booking => new Date(booking.date) >= new Date()).slice(0, 3); // Get only upcoming bookings (max 3)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorAlert message={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 shadow-md text-white">
          <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user?.firstName}!</h1>
          <p className="opacity-90">Selamat datang di dashboard pengguna SIMPEL Lab Manager.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1">Alat Dipinjam</h3>
              <p className="text-3xl font-bold">
                {loans.filter(loan => loan.status === 'APPROVED').length}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1">Permintaan Pending</h3>
              <p className="text-3xl font-bold">
                {loans.filter(loan => loan.status === 'PENDING').length}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-1">Booking Lab</h3>
              <p className="text-3xl font-bold">
                {labBookings.filter(booking => ['PENDING', 'APPROVED'].includes(booking.status)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Loans Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Peminjaman Terbaru</h2>
              <Link to="/user/loans" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Lihat Semua
              </Link>
            </div>

            {sortedLoans.length > 0 ? (
              <div className="space-y-3">
                {sortedLoans.map((loan) => (
                  <Link 
                    key={loan.id} 
                    to={`/user/loans/${loan.id}`}
                    className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{loan.equipment.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(loan.createdAt)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2 text-gray-600">Belum ada peminjaman</p>
                <Link to="/user/request" className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Ajukan Peminjaman
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Lab Bookings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Booking Lab Mendatang</h2>
              <Link to="/user/lab/bookings" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Lihat Semua
              </Link>
            </div>

            {sortedLabBookings.length > 0 ? (
              <div className="space-y-3">
                {sortedLabBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.lab.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(booking.date)} • {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-gray-600">Belum ada booking lab mendatang</p>
                <Link to="/user/lab" className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Pesan Laboratorium
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Popular Equipment Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Peralatan Populer</h2>
            <Link to="/user/equipment" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Lihat Semua
            </Link>
          </div>

          {popularEquipment.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularEquipment.map((equipment) => (
                <Link 
                  key={equipment.id} 
                  to={`/user/equipment/${equipment.id}`}
                  className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{equipment.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {equipment.category} • {equipment.available ? 'Tersedia' : 'Tidak Tersedia'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <p className="mt-2 text-gray-600">Belum ada peralatan populer</p>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/user/request" 
              className="flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg p-4 transition-all duration-200 h-32"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-center">Ajukan Peminjaman</span>
            </Link>
            
            <Link 
              to="/user/loans" 
              className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 rounded-lg p-4 transition-all duration-200 h-32"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium text-center">Daftar Peminjaman</span>
            </Link>
            
            <Link 
              to="/user/equipment" 
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-4 transition-all duration-200 h-32"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="font-medium text-center">Daftar Peralatan</span>
            </Link>

            <Link 
              to="/user/lab" 
              className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg p-4 transition-all duration-200 h-32"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium text-center">Pesan Laboratorium</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;