import DashboardLayout from '../../../components/layouts/DashboardLayout';
import StatChart from '../../../components/dashboard/StatChart';
import DataTable from '../../../components/dashboard/DataTable';
import PageHeader from '../../../components/common/PageHeader';
import useReports from '../../../hooks/admin/useReports';

const Reports = () => {
  const {
    isLoading,
    error,
    activeTab,
    setActiveTab,
    mostBorrowedEquipment,
    mostRepairedEquipment,
    equipmentPerLab,
    maintenancePerTechnician,
    totalLoansData,
    brokenEquipment,
    handleExportReport,
  } = useReports();

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
  const maintenancePerTechnicianChartData = {
    labels: maintenancePerTechnician.map(item => item.technician?.fullName || item.technician?.username || 'Tidak diketahui'),
    datasets: [
      {
        label: 'Jumlah Pemeliharaan',
        data: maintenancePerTechnician.map(item => item.total),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };
  const monthlyLoansChartData = {
    labels: totalLoansData.monthly?.map(item => item.label) || [],
    datasets: [
      {
        label: 'Peminjaman Bulanan',
        data: totalLoansData.monthly?.map(item => item.count) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };
  const yearlyLoansChartData = {
    labels: totalLoansData.yearly?.map(item => item.label) || [],
    datasets: [
      {
        label: 'Peminjaman Tahunan',
        data: totalLoansData.yearly?.map(item => item.count) || [],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  const tabs = [
    { id: 'all', label: 'Semua Laporan' },
    { id: 'equipment', label: 'Peralatan' },
    { id: 'labs', label: 'Laboratorium' },
    { id: 'loans', label: 'Peminjaman' },
    { id: 'maintenance', label: 'Pemeliharaan' },
  ];

  if (isLoading && activeTab === 'all') {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Memuat data laporan...</p>
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
      <div className="py-6">
        <div className="flex justify-between items-center">
          <PageHeader 
            title="Laporan dan Statistik"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            onClick={handleExportReport}
          >
            Cetak Laporan
          </button>
        </div>
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        {(activeTab === 'equipment' || activeTab === 'all') && (
          <div className={`mb-8 ${activeTab !== 'all' ? '' : 'pb-8 border-b border-gray-200'}`}>
            {activeTab === 'all' && <h2 className="text-xl font-medium text-gray-700 mb-4">Laporan Peralatan</h2>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <StatChart
                title="5 Alat Paling Sering Dipinjam"
                data={mostBorrowedChartData}
                type="bar"
                isLoading={isLoading && (activeTab === 'equipment' || activeTab === 'all')}
              />
              <StatChart
                title="5 Alat Paling Sering Rusak"
                data={mostRepairedChartData}
                type="bar"
                isLoading={isLoading && (activeTab === 'equipment' || activeTab === 'all')}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Detail Alat Paling Sering Dipinjam</h3>
                <DataTable
                  columns={[
                    { id: 'equipment', header: 'Nama Alat', sortable: true, render: row => row.equipment?.name || '-' },
                    { id: 'total', header: 'Jumlah Peminjaman', sortable: true }
                  ]}
                  data={mostBorrowedEquipment}
                  isLoading={isLoading && (activeTab === 'equipment' || activeTab === 'all')}
                />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Detail Alat Paling Sering Rusak</h3>
                <DataTable
                  columns={[
                    { id: 'equipment', header: 'Nama Alat', sortable: true, render: row => row.equipment?.name || '-' },
                    { id: 'total', header: 'Jumlah Perbaikan', sortable: true }
                  ]}
                  data={mostRepairedEquipment}
                  isLoading={isLoading && (activeTab === 'equipment' || activeTab === 'all')}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-medium text-red-700 mb-4">Daftar Alat Rusak (INACTIVE)</h3>
              <DataTable
                columns={[
                  { id: 'name', header: 'Nama Alat', sortable: true },
                  { id: 'serialNumber', header: 'Serial Number', sortable: true },
                  { id: 'type', header: 'Tipe', sortable: true },
                  { id: 'lab', header: 'Laboratorium', sortable: true, render: row => row.lab?.name || '-' },
                  { id: 'status', header: 'Status', sortable: true }
                ]}
                data={brokenEquipment}
                isLoading={isLoading && (activeTab === 'equipment' || activeTab === 'all')}
              />
            </div>
          </div>
        )}
        {(activeTab === 'labs' || activeTab === 'all') && (
          <div className={`mb-8 ${activeTab !== 'all' ? '' : 'pb-8 border-b border-gray-200'}`}>
            {activeTab === 'all' && <h2 className="text-xl font-medium text-gray-700 mb-4">Laporan Laboratorium</h2>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatChart
                title="Distribusi Alat per Laboratorium"
                data={equipmentPerLabChartData}
                type="pie"
                isLoading={isLoading && (activeTab === 'labs' || activeTab === 'all')}
              />
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Detail Alat per Laboratorium</h3>
                <DataTable
                  columns={[
                    { id: 'lab', header: 'Nama Laboratorium', sortable: true, render: row => row.lab?.name || '-' },
                    { id: 'total', header: 'Jumlah Alat', sortable: true }
                  ]}
                  data={equipmentPerLab}
                  isLoading={isLoading && (activeTab === 'labs' || activeTab === 'all')}
                />
              </div>
            </div>
          </div>
        )}
        {(activeTab === 'loans' || activeTab === 'all') && (
          <div className={`mb-8 ${activeTab !== 'all' ? '' : 'pb-8 border-b border-gray-200'}`}>
            {activeTab === 'all' && <h2 className="text-xl font-medium text-gray-700 mb-4">Laporan Peminjaman</h2>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatChart
                title="Peminjaman Bulanan"
                data={monthlyLoansChartData}
                type="bar"
                isLoading={isLoading && (activeTab === 'loans' || activeTab === 'all')}
              />
              <StatChart
                title="Peminjaman Tahunan"
                data={yearlyLoansChartData}
                type="bar"
                isLoading={isLoading && (activeTab === 'loans' || activeTab === 'all')}
              />
            </div>
          </div>
        )}
        {(activeTab === 'maintenance' || activeTab === 'all') && (
          <div>
            {activeTab === 'all' && <h2 className="text-xl font-medium text-gray-700 mb-4">Laporan Pemeliharaan</h2>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatChart
                title="Jumlah Pemeliharaan per Teknisi"
                data={maintenancePerTechnicianChartData}
                type="bar"
                isLoading={isLoading && (activeTab === 'maintenance' || activeTab === 'all')}
              />
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Detail Pemeliharaan per Teknisi</h3>
                <DataTable
                  columns={[
                    { id: 'technician', header: 'Nama Teknisi', sortable: true, render: row => row.technician?.fullName || row.technician?.username || '-' },
                    { id: 'total', header: 'Jumlah Pemeliharaan', sortable: true }
                  ]}
                  data={maintenancePerTechnician}
                  isLoading={isLoading && (activeTab === 'maintenance' || activeTab === 'all')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;