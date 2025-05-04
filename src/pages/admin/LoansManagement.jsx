import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import IconButton from '../../components/common/IconButton';
import { getAllLoans, updateLoanStatus, deleteLoan } from '../../api/loans';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';

const LoansManagement = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const statusOptions = ['PENDING', 'APPROVED', 'ACTIVE', 'RETURNED', 'REJECTED', 'OVERDUE'];

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLoans();
      setLoans(data);
    } catch (err) {
      setError('Gagal memuat data peminjaman');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const exportToCSV = () => {
    const headers = ['ID', 'Equipment', 'User', 'Status', 'Tanggal Pinjam', 'Tanggal Kembali'];
    const rows = filteredLoans.map(item => [
      item.id,
      item.equipment?.name || item.equipmentId || '-',
      item.user?.fullName || item.user?.username || item.userId || '-',
      item.status,
      item.startDate ? new Date(item.startDate).toLocaleString('id-ID') : '-',
      item.endDate ? new Date(item.endDate).toLocaleString('id-ID') : '-',
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'loans_management.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLoans = loans.filter(item => {
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const equipmentName = item.equipment?.name || '';
    const userName = item.user?.fullName || item.user?.username || '';
    return matchStatus && (
      equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      (item.status || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateLoanStatus(id, status);
      fetchLoans();
    } catch (err) {
      alert('Gagal memperbarui status peminjaman');
    }
  };

  const columns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'equipment', header: 'Equipment', sortable: true, render: row => row.equipment?.name || row.equipmentId || '-' },
    { id: 'user', header: 'User', sortable: true, render: row => row.user?.fullName || row.user?.username || row.userId || '-' },
    { id: 'status', header: 'Status', sortable: true, render: row => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
        {row.status}
      </span>
    ) },
    { id: 'startDate', header: 'Tanggal Pinjam', sortable: true, render: row => row.startDate ? new Date(row.startDate).toLocaleDateString('id-ID') : '-' },
    { id: 'endDate', header: 'Tanggal Kembali', sortable: true, render: row => row.endDate ? new Date(row.endDate).toLocaleDateString('id-ID') : '-' },
    {
      id: 'actions',
      header: 'Aksi',
      sortable: false,
      render: (row) => (
        <div className="flex gap-2 justify-start">
          <IconButton
            type="view"
            onClick={() => { setViewData(row); setShowViewModal(true); }}
            tooltip="Lihat Detail"
            size="sm"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          {row.status === 'PENDING' && (
            <>
              <IconButton 
                type="approve" 
                onClick={() => handleUpdateStatus(row.id, 'APPROVED')} 
                tooltip="Approve"
                size="sm"
              />
              <IconButton 
                type="reject" 
                onClick={() => handleUpdateStatus(row.id, 'REJECTED')} 
                tooltip="Reject"
                size="sm"
              />
            </>
          )}
          <IconButton 
            type="edit" 
            onClick={() => openStatusModal(row)} 
            tooltip="Update Status"
            size="sm"
            disabled={row.status !== 'APPROVED'}
          />
          <IconButton 
            type="delete" 
            onClick={() => handleDelete(row.id)} 
            tooltip="Hapus"
            size="sm"
          />
        </div>
      )
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-indigo-100 text-indigo-800';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus peminjaman ini?')) return;
    try {
      await deleteLoan(id);
      fetchLoans();
    } catch (err) {
      alert('Gagal menghapus peminjaman');
    }
  };

  const openStatusModal = (loan) => {
    if (loan.status !== 'APPROVED') return;
    setShowStatusModal(loan.id);
    setSelectedStatus(loan.status);
  };
  const closeStatusModal = () => {
    setShowStatusModal(null);
    setSelectedStatus('');
  };
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    try {
      await handleUpdateStatus(showStatusModal, selectedStatus);
      closeStatusModal();
    } catch (err) {
      alert('Gagal memperbarui status');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
          <PageHeader 
            title="Manajemen Peminjaman" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Cari equipment, user, status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
            <select
              className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="RETURNED">Returned</option>
              <option value="ACTIVE">Active</option>
              <option value="OVERDUE">Overdue</option>
            </select>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
              onClick={exportToCSV}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              CSV
            </button>
          </div>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <DataTable columns={columns} data={filteredLoans} isLoading={isLoading} />
        <Modal isOpen={!!showStatusModal} onClose={closeStatusModal} title="Update Status Peminjaman">
          <form onSubmit={handleStatusSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Baru</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                required
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={closeStatusModal}>Batal</button>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition" disabled={statusLoading}>{statusLoading ? 'Memproses...' : 'Update'}</button>
            </div>
          </form>
        </Modal>
        {showViewModal && viewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
            <div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-fadeIn" 
              style={{animation: 'fadeInScale 0.3s ease-out'}}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-500 p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Detail Peminjaman
                  </h2>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informasi Dasar
                      </div>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">ID:</span>
                        <span className="font-medium text-gray-900">{viewData.id}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">User:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.user?.fullName || viewData.user?.username || viewData.userId || '-'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Equipment:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.equipment?.name || viewData.equipmentId || '-'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewData.status)}`}>
                          {viewData.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-700 mb-3 border-b border-purple-200 pb-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Waktu Peminjaman
                      </div>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Tgl Pinjam:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.startDate ? new Date(viewData.startDate).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Tgl Kembali:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.endDate ? new Date(viewData.endDate).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Tgl Pengembalian:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.returnDate ? 
                            <span className="text-green-600">{new Date(viewData.returnDate).toLocaleString('id-ID')}</span> : 
                            <span className="text-gray-400 italic">Belum dikembalikan</span>
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M9 20h6M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        </svg>
                        Catatan
                      </div>
                    </h3>
                    <div className="bg-white p-3 rounded border border-green-100 h-24 overflow-y-auto">
                      {viewData.notes || <span className="text-gray-400 italic">Tidak ada catatan</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Informasi Sistem
                      </div>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Dibuat:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.createdAt ? new Date(viewData.createdAt).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Diubah:</span>
                        <span className="font-medium text-gray-900">
                          {viewData.updatedAt ? new Date(viewData.updatedAt).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t">
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white rounded-md shadow-md transition-all duration-200 flex items-center" 
                    onClick={() => setShowViewModal(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LoansManagement; 