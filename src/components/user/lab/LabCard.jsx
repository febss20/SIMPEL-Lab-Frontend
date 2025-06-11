import React from 'react';
import { Link } from 'react-router-dom';

const LabCard = ({ lab }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 h-full flex flex-col">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={lab.image || '/lab-placeholder.svg'}
          alt={lab.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{lab.name}</h3>
        
        <div className="mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-500">{lab.location || 'Lokasi tidak tersedia'}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {lab.description || 'Tidak ada deskripsi tersedia untuk laboratorium ini.'}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
              Kapasitas: {lab.capacity || 'N/A'} orang
            </span>
            
            <Link
              to={`/user/lab/${lab.id}/book`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors hover:underline"
            >
              <span>Pesan</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabCard;