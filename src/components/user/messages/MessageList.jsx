import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const MessageList = ({ messages, loading }) => {
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  // Scroll ke pesan terbaru saat pesan berubah
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Belum ada pesan. Mulai percakapan dengan mengirim pesan pertama.
        </p>
      </div>
    );
  }

  // Mengelompokkan pesan berdasarkan tanggal
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              {date}
            </span>
          </div>
          
          {dateMessages.map((message) => {
            const isCurrentUser = message.senderId === user.id;
            const time = new Date(message.createdAt).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            });
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                      {message.sender.fullName ? message.sender.fullName.charAt(0).toUpperCase() : message.sender.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-2 shadow`}>
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'} text-right mt-1`}>
                    {time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;