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
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Sidebar percakapan */}
            <div className="w-1/3 border-r">
              <ConversationList 
                onSelectConversation={handleSelectConversation} 
                selectedUserId={selectedUserId}
              />
            </div>
            
            {/* Area pesan */}
            <div className="w-2/3 flex flex-col">
              {selectedUserId ? (
                <>
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
                  <p className="text-gray-500 text-center">
                    Pilih percakapan atau mulai percakapan baru untuk mengirim pesan.
                  </p>
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