import React from 'react';
import PropTypes from 'prop-types';
import '../../utils/animations.css';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  isLoading = false,
  subtitle,
  footerText
}) => {
  const colorVariants = {
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      shadow: 'shadow-blue-100',
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-white',
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      shadow: 'shadow-green-100',
      gradientFrom: 'from-green-50',
      gradientTo: 'to-white',
    },
    red: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      shadow: 'shadow-red-100',
      gradientFrom: 'from-red-50',
      gradientTo: 'to-white',
    },
    yellow: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      shadow: 'shadow-yellow-100',
      gradientFrom: 'from-yellow-50',
      gradientTo: 'to-white',
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      shadow: 'shadow-purple-100',
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-white',
    },
    indigo: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      shadow: 'shadow-indigo-100',
      gradientFrom: 'from-indigo-50',
      gradientTo: 'to-white',
    },
    gray: {
      text: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      shadow: 'shadow-gray-100',
      gradientFrom: 'from-gray-50',
      gradientTo: 'to-white',
    },
  };

  const colorStyle = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`rounded-xl shadow-md border ${colorStyle.border} animate-fadeIn hover-scale card-shadow overflow-hidden bg-gradient-to-br ${colorStyle.gradientFrom} ${colorStyle.gradientTo}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-medium text-gray-700">{title}</h3>
          {icon && (
            <div className={`${colorStyle.text} ${colorStyle.bg} p-2 rounded-lg`}>
              <span className="text-2xl">{icon}</span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            {subtitle && <div className="h-4 bg-gray-100 rounded w-3/4"></div>}
          </div>
        ) : (
          <div className="space-y-1">
            <p className={`text-3xl font-bold ${colorStyle.text} transition-all duration-300`}>{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}
      </div>
      
      {footerText && (
        <div className={`p-3 ${colorStyle.bg} border-t ${colorStyle.border}`}>
          <p className="text-xs text-gray-600">{footerText}</p>
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'gray']),
  isLoading: PropTypes.bool,
  subtitle: PropTypes.string,
  footerText: PropTypes.string
};

export default StatCard; 