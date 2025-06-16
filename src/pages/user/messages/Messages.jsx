import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import ConversationList from '../../../components/user/messages/ConversationList';
import MessageList from '../../../components/user/messages/MessageList';
import MessageInput from '../../../components/user/messages/MessageInput';
import MessageService from '../../../api/message';

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(userId || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      navigate(`/user/messages/${selectedUserId}`);
    } else {
      navigate('/user/messages');
    }
  }, [selectedUserId, navigate]);

  const fetchMessages = async (userId) => {
    try {
      setLoading(true);
      const data = await MessageService.getConversation(userId);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Gagal memuat pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedUserId || !content.trim()) return;

    try {
      setSendingMessage(true);
      const newMessage = await MessageService.sendMessage(selectedUserId, content);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSelectConversation = (userId) => {
    setSelectedUserId(userId);
    setShowConversationList(false);
  };

  const handleBackToConversations = () => {
    setShowConversationList(true);
    setSelectedUserId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Sidebar percakapan - Hidden on mobile when conversation is selected */}
            <div className={`${
              showConversationList ? 'w-full md:w-1/3' : 'hidden md:block md:w-1/3'
            } border-r border-gray-200`}>
              <ConversationList 
                onSelectConversation={handleSelectConversation} 
                selectedUserId={selectedUserId}
              />
            </div>
            
            {/* Area pesan - Full width on mobile when conversation is selected */}
            <div className={`${
              !showConversationList ? 'w-full' : 'hidden md:flex md:w-2/3'
            } flex flex-col`}>
              {selectedUserId ? (
                <>
                  {/* Header with back button for mobile */}
                  <div className="md:hidden flex items-center p-4 border-b bg-gray-50">
                    <button
                      onClick={handleBackToConversations}
                      className="mr-3 p-1 rounded-full hover:bg-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">Pesan</h2>
                  </div>
                  
                  {error ? (
                    <div className="flex-1 p-4 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <button 
                          onClick={() => fetchMessages(selectedUserId)} 
                          className="text-blue-500 hover:underline"
                        >
                          Coba lagi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <MessageList messages={messages} loading={loading} />
                  )}
                  <MessageInput 
                    onSendMessage={handleSendMessage} 
                    disabled={sendingMessage}
                  />
                </>
              ) : (
                <div className="flex-1 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">
                      Pilih percakapan atau mulai percakapan baru untuk mengirim pesan.
                    </p>
                    <button
                      onClick={handleBackToConversations}
                      className="md:hidden inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lihat Percakapan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;