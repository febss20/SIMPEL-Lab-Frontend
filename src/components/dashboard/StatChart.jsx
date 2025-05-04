import React from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import '../../utils/animations.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatChart = ({ title, data, options, type = 'bar', isLoading = false }) => {
  const defaultBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 11,
            weight: 'medium'
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#6366F1',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(243, 244, 246, 1)',
        },
        ticks: {
          font: {
            size: 10
          },
          padding: 5
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const defaultPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            weight: 'medium'
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#6366F1',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13,
          weight: 'bold'
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const chartOptions = type === 'bar'
    ? { ...defaultBarOptions, ...options }
    : { ...defaultPieOptions, ...options };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fadeIn hover-scale card-shadow">
      <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        {title}
      </h3>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-48 bg-gray-100 rounded"></div>
          <div className="h-8 mt-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
        </div>
      ) : (
        <div className="h-48 md:h-64">
          {type === 'bar' ? (
            <Bar data={data} options={chartOptions} />
          ) : (
            <Pie data={data} options={chartOptions} />
          )}
        </div>
      )}
    </div>
  );
};

StatChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  type: PropTypes.oneOf(['bar', 'pie']),
  isLoading: PropTypes.bool,
};

export default StatChart; 