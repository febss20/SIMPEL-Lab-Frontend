import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotificationItem from './NotificationItem';
import LoadingSpinner from './LoadingSpinner';

const NotificationDropdown = ({ 
  notifications, 
  loading, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  const { user: currentUser } = useSelector(state => state.auth);
  const unreadNotifications = notifications.filter(notif => !notif.isRead);
  const hasUnread = unreadNotifications.length > 0;
  
  // Determine the correct notifications route based on user role
  const getNotificationsRoute = () => {
    if (!currentUser?.role) return '/user/notifications';
    
    switch (currentUser.role) {
      case 'ADMIN':
        return '/admin/notifications';
      case 'TECHNICIAN':
        return '/technician/notifications';
      case 'USER':
      default:
        return '/user/notifications';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
          <div className="flex items-center space-x-2">
            {hasUnread && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                title="Tandai semua sebagai dibaca"
              >
                Tandai semua
              </button>
            )}
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Tutup"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Stats */}
        {notifications.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            {hasUnread ? (
              <span>{unreadNotifications.length} notifikasi belum dibaca</span>
            ) : (
              <span>Semua notifikasi sudah dibaca</span>
            )}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 flex justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center">
              <svg className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-gray-500 text-sm">Tidak ada notifikasi</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Link 
            to={getNotificationsRoute()}
            onClick={onClose}
            className="block w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          >
            Lihat semua notifikasi
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;