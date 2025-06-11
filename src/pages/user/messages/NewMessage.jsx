import React from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import NewConversation from '../../../components/user/messages/NewConversation';

const NewMessage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <NewConversation />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewMessage;