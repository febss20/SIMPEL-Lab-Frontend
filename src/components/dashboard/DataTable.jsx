import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../utils/animations.css';

const DataTable = ({ columns, data, isLoading = false, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const handleSort = (columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };
  
  const sortedData = sortColumn
    ? [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        
        if (valueA === valueB) return 0;
        
        if (sortDirection === 'asc') {
          return valueA < valueB ? -1 : 1;
        } else {
          return valueA > valueB ? -1 : 1;
        }
      })
    : data;
    
  const paginatedData = sortedData.slice(startIndex, endIndex);
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 animate-fadeIn">
        <div className="animate-pulse">
          <div className="h-14 bg-indigo-50"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex">
              {[...Array(columns.length)].map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className="h-16 flex-1 m-1 rounded bg-gray-100"
                  style={{ animationDelay: `${(index + colIndex) * 0.1}s` }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100 animate-fadeIn">
        <div className="py-6 flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg">Tidak ada data untuk ditampilkan</p>
          <p className="text-gray-400 text-sm mt-1">Data akan muncul di sini ketika tersedia</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 animate-fadeIn">
      <div className="overflow-x-auto modern-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.sortable !== false ? 'cursor-pointer hover:bg-indigo-100 transition-colors' : ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.id)}
                >
                  <div className="flex items-center group">
                    {column.header}
                    {column.sortable !== false && (
                      <span className={`ml-1 transition-transform duration-200 ${sortColumn === column.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                        {sortColumn === column.id 
                          ? (sortDirection === 'asc' ? '▲' : '▼') 
                          : <span className="text-gray-300">⇅</span>}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className="hover:bg-blue-50 transition-all duration-200 ease-in-out even:bg-gray-50 hover-scale"
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id || rowIndex}-${column.id}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 hover-scale'
              }`}
            >
              Sebelumnya
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 hover-scale'
              }`}
            >
              Selanjutnya
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{' '}
                <span className="font-medium">
                  {Math.min(endIndex, data.length)}
                </span>{' '}
                dari <span className="font-medium">{data.length}</span> hasil
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors'
                  }`}
                >
                  &laquo;
                </button>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors'
                        } hover-scale`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 3 ||
                    pageNumber === currentPage + 3
                  ) {
                    return (
                      <span
                        key={`ellipsis-${pageNumber}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors'
                  }`}
                >
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  itemsPerPage: PropTypes.number
};

export default DataTable; 