import React, { useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { getAvailableTimeSlots } from '../../../api/labBooking';

const LabBookingCalendar = ({ labId, onSelectTimeSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(1);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const durationOptions = [
    { value: 1, label: '1 Jam' },
    { value: 2, label: '2 Jam' },
    { value: 3, label: '3 Jam' },
    { value: 4, label: '4 Jam' },
    { value: 5, label: '5 Jam' },
    { value: 6, label: '6 Jam' },
    { value: 7, label: '7 Jam' },
    { value: 8, label: '8 Jam' }
  ];

  const fetchAvailableSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const slots = await getAvailableTimeSlots(labId, formattedDate);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setError('Gagal memuat slot waktu yang tersedia. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [labId, selectedDate]);

  useEffect(() => {
    if (labId && selectedDate) {
      fetchAvailableSlots();
    }
  }, [labId, selectedDate, fetchAvailableSlots]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    const isAvailable = isSlotAvailable(slot, selectedDuration);
    if (isAvailable) {
      const selectedDateTime = new Date(selectedDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const [hours, minutes] = slot.split(':').map(Number);
      selectedDateTime.setUTCHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(selectedDateTime);
      endDateTime.setUTCHours(hours + selectedDuration, minutes, 0, 0);
      
      const endHour = hours + selectedDuration;
      const formattedEnd = `${endHour.toString().padStart(2, '0')}:00`;
      
      setSelectedSlot({
        startTime: selectedDateTime,
        endTime: endDateTime,
        formattedStart: slot,
        formattedEnd: formattedEnd,
        duration: selectedDuration
      });
      
      onSelectTimeSlot({
        startTime: selectedDateTime,
        endTime: endDateTime,
        duration: selectedDuration
      });
    }
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    setSelectedSlot(null);
  };

  const isSlotAvailable = (slot, duration = 1) => {
    const [hours] = slot.split(':').map(Number);
    const endHour = hours + duration;
    
    if (endHour > 17) {
      return false;
    }
    
    if (!availableSlots || availableSlots.length === 0) return false;
    
    for (let i = 0; i < duration; i++) {
      const checkHour = hours + i;
      const checkSlot = `${checkHour.toString().padStart(2, '0')}:00`;
      
      const matchingSlot = availableSlots.find(availableSlot => {
        const availableStartTime = format(parseISO(availableSlot.startTime), 'HH:mm');
        return availableStartTime === checkSlot;
      });
      
      if (!matchingSlot || !matchingSlot.isAvailable) {
        return false;
      }
    }
    
    return true;
  };

  const generateWeekDays = () => {
    const days = [];
    let start = startOfWeek(currentDate, { weekStartsOn: 1 }); 
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      days.push(day);
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const prevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Pilih Tanggal & Waktu</h3>
        <div className="flex space-x-2">
          <button 
            onClick={prevWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={nextWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1">
              {format(day, 'EEE', { locale: id })}
            </div>
            <button
              onClick={() => handleDateClick(day)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${isSameDay(day, selectedDate) 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {format(day, 'd')}
            </button>
          </div>
        ))}
      </div>

      {/* Duration Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Durasi Booking
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDurationChange(option.value)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                selectedDuration === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {timeSlots.map((slot, index) => {
            const isAvailable = isSlotAvailable(slot, selectedDuration);
            const isSelected = selectedSlot && selectedSlot.formattedStart === slot;
            
            return (
              <button
                key={index}
                onClick={() => handleSlotClick(slot)}
                disabled={!isAvailable}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${isSelected
                  ? 'bg-indigo-600 text-white'
                  : isAvailable
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
          <p className="text-sm text-indigo-800">
            <span className="font-medium">Slot terpilih:</span> {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })} pukul {selectedSlot.formattedStart} - {selectedSlot.formattedEnd}
          </p>
          <p className="text-sm text-indigo-600 mt-1">
            <span className="font-medium">Durasi:</span> {selectedSlot.duration} jam
          </p>
        </div>
      )}
    </div>
  );
};

export default LabBookingCalendar;