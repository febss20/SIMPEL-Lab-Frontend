import { useState, useEffect } from 'react';
import {
  getMostBorrowedEquipment,
  getMostRepairedEquipment,
  getEquipmentPerLab,
  getMaintenancePerTechnician,
  getTotalLoans
} from '../../api/reports';
import { getAllEquipment } from '../../api/admin';

export default function useReports() {
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

  return {
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
  };
} 