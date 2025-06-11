import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingTable.css';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://kwetu-backend.onrender.com/api/customer/bookings/summary-paginated?page=${page}&limit=10`
      );
      setBookings(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchBookings(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchBookings(currentPage + 1);
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <p className="error-text">Error: {error}</p>
        <button onClick={() => fetchBookings()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h2 className="table-header">Booking Report</h2>
      
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr className="table-header-row">
              <th className="first-column">Customer</th>
              <th>Service</th>
              <th>Hours</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr 
                key={index} 
                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
              >
                <td className="first-column">
                  <div className="customer-info">
                    <strong>{booking.customerName}</strong>
                    <small>{booking.customerEmail}</small>
                    <small>{booking.customerPhone}</small>
                  </div>
                </td>
                <td>
                  <strong>{booking.serviceTitle}</strong>
                  <small>ID: {booking.serviceId}</small>
                </td>
                <td className="centered-text">{booking.hours}h</td>
                <td className="centered-text">KES{booking.totalPrice.toFixed(2)}</td>
                <td>
                  <small>{new Date(booking.bookingDate).toLocaleDateString()}</small>
                  <small>{new Date(booking.bookingDate).toLocaleTimeString()}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        >
          Previous
        </button>
        
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingTable;