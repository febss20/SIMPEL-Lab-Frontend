import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import DataTable from '../../../components/dashboard/DataTable';
import { getAllRepairs, confirmUnrepairableRepair } from '../../../api/repairs';
import PageHeader from '../../../components/common/PageHeader';

const ConfirmUnrepairable = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRepairs = async () => {
    setLoading(true);
    setError(null);
    try {
      const allRepairs = await getAllRepairs();
      setRepairs(allRepairs.filter(r => r.status === 'UNREPAIRABLE' && !r.adminConfirmed));
    } catch (err) {
      setError('Gagal memuat data repair');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleConfirm = async (id) => {
    if (!window.confirm('Yakin ingin mengkonfirmasi alat ini sebagai rusak permanen?')) return;
    try {
      await confirmUnrepairableRepair(id);
      setSuccessMsg('Berhasil konfirmasi rusak permanen!');
      fetchRepairs();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal konfirmasi: ' + (err.response?.data?.message || err.message));
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Alat', 'Deskripsi', 'Dilaporkan', 'Catatan'];
    const rows = repairs.map(row => [
      row.id,
      row.equipment?.name || '-',
      row.description,
      row.reportedDate ? new Date(row.reportedDate).toLocaleString('id-ID') : '-',
      row.notes || '-'
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'confirm_unrepairable.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'equipment', header: 'Alat', sortable: true, render: row => row.equipment?.name || '-' },
    { id: 'description', header: 'Deskripsi', sortable: true },
    { id: 'reportedDate', header: 'Dilaporkan', sortable: true, render: row => row.reportedDate ? new Date(row.reportedDate).toLocaleDateString('id-ID') : '-' },
    { id: 'notes', header: 'Catatan', sortable: true },
    { id: 'actions', header: 'Aksi', sortable: false, render: row => (
      <button
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow text-xs"
        onClick={() => handleConfirm(row.id)}
      >
        Konfirmasi Rusak Permanen
      </button>
    ) },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <PageHeader title="Konfirmasi Rusak Permanen" icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05z" />
          </svg>
        }>
          <button
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
            onClick={exportToCSV}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            CSV
          </button>
        </PageHeader>
        {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">{successMsg}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <DataTable columns={columns} data={repairs} isLoading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default ConfirmUnrepairable; 