import React, { useState, useEffect } from 'react';
import MessageService from '../../api/message';
import '../../utils/animations.css';

const UnreadBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { count } = await MessageService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Polling untuk memperbarui jumlah pesan yang belum dibaca setiap 30 detik
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || unreadCount === 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-md animate-pulse transition-all duration-300 hover:scale-110 hover:bg-red-700">
      {unreadCount}
    </span>
  );
};

export default UnreadBadge;