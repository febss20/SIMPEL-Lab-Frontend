import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import StatChart from '../../components/dashboard/StatChart';
import QuickActions from '../../components/dashboard/QuickActions';
import { getDashboardStats } from '../../api/reports';
import { getMostBorrowedEquipment, getMostRepairedEquipment, getEquipmentPerLab } from '../../api/reports';
import { getAllLoans } from '../../api/admin';
import PageHeader from '../../components/common/PageHeader';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    totalLoans: 0,
    activeLoans: 0,
    pendingMaintenance: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostBorrowedEquipment, setMostBorrowedEquipment] = useState([]);
  const [mostRepairedEquipment, setMostRepairedEquipment] = useState([]);
  const [equipmentPerLab, setEquipmentPerLab] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
        
        const borrowedData = await getMostBorrowedEquipment();
        setMostBorrowedEquipment(borrowedData);
        
        const repairedData = await getMostRepairedEquipment();
        setMostRepairedEquipment(repairedData);
        
        const labData = await getEquipmentPerLab();
        setEquipmentPerLab(labData);
        
        const loans = await getAllLoans();
        setRecentLoans(loans.slice(0, 5));
        
        setIsLoading(false);
      } catch (err) {
        setError('Gagal memuat data dashboard');
        setIsLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const mostBorrowedChartData = {
    labels: mostBorrowedEquipment.map(item => item.equipment?.name || 'Tidak diketahui'),
    datasets: [
      {
        label: 'Jumlah Peminjaman',
        data: mostBorrowedEquipment.map(item => item.total),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const mostRepairedChartData = {
    labels: mostRepairedEquipment.map(item => item.equipment?.name || 'Tidak diketahui'),
    datasets: [
      {
        label: 'Jumlah Perbaikan',
        data: mostRepairedEquipment.map(item => item.total),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const equipmentPerLabChartData = {
    labels: equipmentPerLab.map(item => item.lab?.name || 'Tidak diketahui'),
    datasets: [
      {
        label: 'Jumlah Alat',
        data: equipmentPerLab.map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const quickActions = [
    {
      label: 'Tambah Alat',
      path: '/admin/equipment',
      color: 'blue',
    },
    {
      label: 'Kelola Lab',
      path: '/admin/lab',
      color: 'purple',
    },
    {
      label: 'Proses Peminjaman',
      path: '/admin/loans',
      color: 'green',
    },
    {
      label: 'Tambah Pengguna',
      path: '/admin/users',
      color: 'purple',
    },
    {
      label: 'Lihat Laporan',
      path: '/admin/reports',
      color: 'gray',
      fullWidth: true,
    },
  ];

  const loanColumns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'equipment', header: 'Alat', sortable: true, render: (row) => row.equipment?.name || '-' },
    { id: 'borrower', header: 'Peminjam', sortable: true, render: (row) => row.user?.fullName || row.user?.username || '-' },
    { 
      id: 'status', 
      header: 'Status', 
      sortable: true,
      render: (row) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
          returned: 'bg-blue-100 text-blue-800',
          PENDING: 'bg-yellow-100 text-yellow-800',
          APPROVED: 'bg-green-100 text-green-800',
          REJECTED: 'bg-red-100 text-red-800',
          RETURNED: 'bg-blue-100 text-blue-800',
          ACTIVE: 'bg-yellow-100 text-yellow-800',
          OVERDUE: 'bg-red-100 text-red-800',
        };
        
        const color = statusColors[row.status] || 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    { 
      id: 'borrowDate', 
      header: 'Tanggal Pinjam', 
      sortable: true,
      render: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString('id-ID') : '-' 
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Memuat data dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <PageHeader 
          title={`Selamat datang, ${user?.firstName || 'Admin'}!`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Ringkasan Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Peralatan</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Total" 
                  value={stats.totalEquipment} 
                  color="blue" 
                />
                <StatCard 
                  title="Tersedia" 
                  value={stats.availableEquipment} 
                  color="green" 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Peminjaman</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Total" 
                  value={stats.totalLoans} 
                  color="blue" 
                />
                <StatCard 
                  title="Aktif" 
                  value={stats.activeLoans} 
                  color="yellow" 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Menunggu Pemeliharaan" 
                  value={stats.pendingMaintenance} 
                  color="red" 
                />
                <StatCard 
                  title="Pengguna Aktif" 
                  value={stats.activeUsers} 
                  color="purple" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatChart
            title="5 Alat Paling Sering Dipinjam"
            data={mostBorrowedChartData}
            type="bar"
          />
          
          <StatChart
            title="5 Alat Paling Sering Rusak"
            data={mostRepairedChartData}
            type="bar"
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Peminjaman Terbaru</h2>
          <DataTable
            columns={loanColumns}
            data={recentLoans}
            isLoading={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatChart
            title="Distribusi Alat per Laboratorium"
            data={equipmentPerLabChartData}
            type="pie"
          />
          
          <div className="grid grid-cols-1 gap-6">
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 