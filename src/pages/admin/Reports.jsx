import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatChart from '../../components/dashboard/StatChart';
import DataTable from '../../components/dashboard/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { 
  getMostBorrowedEquipment, 
  getMostRepairedEquipment, 
  getEquipmentPerLab,
  getMaintenancePerTechnician,
  getTotalLoans
} from '../../api/reports';
import { getAllEquipment } from '../../api/admin';

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('equipment');
  const [mostBorrowedEquipment, setMostBorrowedEquipment] = useState([]);
  const [mostRepairedEquipment, setMostRepairedEquipment] = useState([]);
  const [equipmentPerLab, setEquipmentPerLab] = useState([]);
  const [maintenancePerTechnician, setMaintenancePerTechnician] = useState([]);
  const [totalLoansData, setTotalLoansData] = useState({ monthly: [], yearly: [] });
  const [brokenEquipment, setBrokenEquipment] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        if (activeTab === 'equipment' || activeTab === 'all') {
          const borrowedData = await getMostBorrowedEquipment();
          setMostBorrowedEquipment(borrowedData);
          const repairedData = await getMostRepairedEquipment();
          setMostRepairedEquipment(repairedData);
        }
        if (activeTab === 'labs' || activeTab === 'all') {
          const labData = await getEquipmentPerLab();
          setEquipmentPerLab(labData);
        }
        if (activeTab === 'maintenance' || activeTab === 'all') {
          const techData = await getMaintenancePerTechnician();
          setMaintenancePerTechnician(techData);
        }
        if (activeTab === 'loans' || activeTab === 'all') {
          const loansData = await getTotalLoans();
          setTotalLoansData(loansData);
        }
        if (activeTab === 'equipment' || activeTab === 'all') {
          getAllEquipment().then(equipments => {
            setBrokenEquipment(equipments.filter(eq => eq.status === 'INACTIVE'));
          });
        }
        setIsLoading(false);
      } catch (err) {
        setError('Gagal memuat data laporan');
        setIsLoading(false);
        console.error('Error fetching report data:', err);
      }
    };
    fetchReportData();
  }, [activeTab]);

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

  const handleExportReport = () => {
    let headers = [];
    let rows = [];
    let filename = 'laporan.csv';
    if (activeTab === 'equipment') {
      headers = ['Nama Alat', 'Jumlah Peminjaman', 'Jumlah Perbaikan'];
      const alatSet = new Set([
        ...mostBorrowedEquipment.map(e => e.equipment?.name || '-'),
        ...mostRepairedEquipment.map(e => e.equipment?.name || '-')
      ]);
      rows = Array.from(alatSet).map(name => {
        const borrowed = mostBorrowedEquipment.find(e => (e.equipment?.name || '-') === name)?.total || 0;
        const repaired = mostRepairedEquipment.find(e => (e.equipment?.name || '-') === name)?.total || 0;
        return [name, borrowed, repaired];
      });
      let rusakHeaders = ['Nama Alat', 'Serial Number', 'Tipe', 'Laboratorium', 'Status'];
      let rusakRows = brokenEquipment.map(eq => [eq.name, eq.serialNumber, eq.type, eq.lab?.name || '-', eq.status]);
      let csvContent = 'data:text/csv;charset=utf-8,' +
        headers.join(',') + '\n' +
        rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n') +
        '\n\nDaftar Alat Rusak (INACTIVE)\n' +
        rusakHeaders.join(',') + '\n' +
        rusakRows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'laporan_peralatan.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } else if (activeTab === 'labs') {
      headers = ['Nama Laboratorium', 'Jumlah Alat'];
      rows = equipmentPerLab.map(item => [item.lab?.name || '-', item.total]);
      filename = 'laporan_laboratorium.csv';
    } else if (activeTab === 'maintenance') {
      headers = ['Nama Teknisi', 'Jumlah Pemeliharaan'];
      rows = maintenancePerTechnician.map(item => [item.technician?.fullName || item.technician?.username || '-', item.total]);
      filename = 'laporan_pemeliharaan.csv';
    } else if (activeTab === 'loans') {
      headers = ['Bulan/Tahun', 'Jumlah Peminjaman'];
      rows = [];
      if (totalLoansData.monthly?.length) {
        rows.push(['--- Peminjaman Bulanan ---', '']);
        rows = rows.concat(totalLoansData.monthly.map(item => [item.label, item.count]));
      }
      if (totalLoansData.yearly?.length) {
        rows.push(['--- Peminjaman Tahunan ---', '']);
        rows = rows.concat(totalLoansData.yearly.map(item => [item.label, item.count]));
      }
      filename = 'laporan_peminjaman.csv';
    } else if (activeTab === 'all') {
      let content = '';
      content += 'Laporan Peralatan\n';
      content += 'Nama Alat,Jumlah Peminjaman,Jumlah Perbaikan\n';
      const alatSet = new Set([
        ...mostBorrowedEquipment.map(e => e.equipment?.name || '-'),
        ...mostRepairedEquipment.map(e => e.equipment?.name || '-')
      ]);
      Array.from(alatSet).forEach(name => {
        const borrowed = mostBorrowedEquipment.find(e => (e.equipment?.name || '-') === name)?.total || 0;
        const repaired = mostRepairedEquipment.find(e => (e.equipment?.name || '-') === name)?.total || 0;
        content += `"${name}","${borrowed}","${repaired}"\n`;
      });
      content += '\nDaftar Alat Rusak (INACTIVE)\nNama Alat,Serial Number,Tipe,Laboratorium,Status\n';
      brokenEquipment.forEach(eq => {
        content += `"${eq.name}","${eq.serialNumber}","${eq.type}","${eq.lab?.name || '-'}","${eq.status}"\n`;
      });
      content += '\nLaporan Laboratorium\nNama Laboratorium,Jumlah Alat\n';
      equipmentPerLab.forEach(item => {
        content += `"${item.lab?.name || '-'}","${item.total}"\n`;
      });
      content += '\nLaporan Pemeliharaan\nNama Teknisi,Jumlah Pemeliharaan\n';
      maintenancePerTechnician.forEach(item => {
        content += `"${item.technician?.fullName || item.technician?.username || '-'}","${item.total}"\n`;
      });
      content += '\nLaporan Peminjaman\nBulan/Tahun,Jumlah Peminjaman\n';
      if (totalLoansData.monthly?.length) {
        content += '--- Peminjaman Bulanan ---\n';
        totalLoansData.monthly.forEach(item => {
          content += `"${item.label}","${item.count}"\n`;
        });
      }
      if (totalLoansData.yearly?.length) {
        content += '--- Peminjaman Tahunan ---\n';
        totalLoansData.yearly.forEach(item => {
          content += `"${item.label}","${item.count}"\n`;
        });
      }
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'laporan_ringkasan.csv';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="px-4 py-6">
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