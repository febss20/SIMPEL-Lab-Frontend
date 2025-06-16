import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MessageService from '../../../api/message';
import LoadingSpinner from '../../common/LoadingSpinner';

const ConversationList = ({ onSelectConversation, selectedUserId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await MessageService.getConversations();
        setConversations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Gagal memuat percakapan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-blue-500 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Belum ada percakapan.</p>
        <Link 
          to="/user/messages/new" 
          className="mt-2 text-blue-500 hover:underline block"
        >
          Mulai percakapan baru
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="flex justify-between items-center p-3 sm:p-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">Percakapan</h2>
        <Link 
          to="/user/messages/new" 
          className="text-blue-500 hover:text-blue-700 p-1"
          title="Percakapan Baru"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      <ul className="divide-y divide-gray-200">
        {conversations.map((conversation) => {
          const isSelected = selectedUserId === conversation.user.id;
          const formattedDate = new Date(conversation.lastMessage?.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          });
          
          return (
            <li 
              key={conversation.user.id} 
              className={`hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
              onClick={() => onSelectConversation(conversation.user.id)}
            >
              <div className="flex items-center px-3 sm:px-4 py-3 relative">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-sm sm:text-base font-medium">
                    {conversation.user.fullName ? conversation.user.fullName.charAt(0).toUpperCase() : conversation.user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate pr-2">
                      {conversation.user.fullName || conversation.user.username}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">
                      {formattedDate}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 truncate pr-6">
                    {conversation.lastMessage?.content || 'Belum ada pesan'}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;