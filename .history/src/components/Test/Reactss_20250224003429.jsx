/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/offDayRequest.scss';

const OffDayRequest = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Şu anki tarih (23 Şubat 2025)
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [message, setMessage] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Hangi gün başlıyor (0 = Pazar, 1 = Pazartesi)

    for (let i = 0; i < firstDay; i++) {
      days.push(null); // Boş günler için
    }

    for (let day = 1; day <= daysInMonth(currentMonth); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleDateSelect = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      date: selectedDate.toLocaleDateString(),
      startTime,
      endTime,
      message
    });
    // Burada formu gönderen bir API çağrısı yapabilirsiniz
    alert('Off Day Request submitted successfully!');
    setMessage(''); // Formu sıfırla
  };

  return (
    <div className="off-day-request-container">
      <h1>Off Day Request</h1>
      <p className="instructions">
        Please provide the details of your off day request, including the date(s), reason for the request, and any other relevant information. If you have specific requirements or need to hand over responsibilities during your absence, kindly include that as well.
      </p>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="navigation-button" onClick={goToPreviousMonth}>
              <ChevronLeft size={20} />
            </button>
            <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button className="navigation-button" onClick={goToNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            {getMonthDays().map((day, index) => (
              <div
                key={index}
                className={`day-cell ${day && day.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                onClick={() => handleDateSelect(day)}
              >
                {day ? day.getDate() : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="time-section">
          <label>Add Time:</label>
          <div className="time-picker">
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
              })}
            </select>
            <span>-</span>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
              })}
            </select>
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write here..."
          className="message-input"
        />

        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default OffDayRequest;