import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../utils/animations.css';


const ActionButton = ({ label, path, color = 'blue', onClick, icon, fullWidth = false }) => {
  const colorVariants = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
    green: 'bg-green-600 hover:bg-green-700 text-white shadow-green-200',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-200',
    red: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-200',
    white: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-gray-200',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-200'
  };

  const colorClass = colorVariants[color] || colorVariants.blue;
  const widthClass = fullWidth ? 'col-span-2' : '';

  const buttonClasses = `${colorClass} ${widthClass} py-3 px-4 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center text-sm font-medium hover-scale focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:outline-none`;

  if (path) {
    return (
      <Link
        to={path}
        className={buttonClasses}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};


const QuickActions = ({ actions = [] }) => {
  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fadeIn">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Tindakan Cepat
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-gray-500 text-base">Tidak ada tindakan yang tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Tindakan Cepat
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            label={action.label}
            path={action.path}
            color={action.color}
            onClick={action.onClick}
            icon={action.icon}
            fullWidth={action.fullWidth}
          />
        ))}
      </div>
    </div>
  );
};

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'gray', 'white', 'gradient']),
  onClick: PropTypes.func,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool,
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      color: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.node,
      fullWidth: PropTypes.bool,
    })
  ),
};

export default QuickActions; 