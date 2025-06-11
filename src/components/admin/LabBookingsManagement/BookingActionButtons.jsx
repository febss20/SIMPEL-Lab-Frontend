import React from 'react';
import IconButton from '../../common/IconButton';

const BookingActionButtons = ({ 
  booking, 
  onApprove, 
  onReject, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex gap-2 justify-start">
      {booking.status === 'PENDING' && (
        <>
          <IconButton 
            type="approve" 
            onClick={() => onApprove(booking.id)} 
            tooltip="Setujui"
            size="sm"
          />
          <IconButton 
            type="reject" 
            onClick={() => onReject(booking.id)} 
            tooltip="Tolak"
            size="sm"
          />
        </>
      )}
      <IconButton 
        type="edit" 
        onClick={() => onEdit(booking)} 
        tooltip="Edit"
        size="sm"
      />
      <IconButton 
        type="delete" 
        onClick={() => onDelete(booking.id)} 
        tooltip="Hapus"
        size="sm"
      />
    </div>
  );
};

export default BookingActionButtons;