import React, { useState, useEffect } from 'react';
import './Payments.css';

const Payments = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState({
    coach: '',
    paymentCode: '',
    page: 1,
    limit: 10
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.coach) params.append('coach', filters.coach);
      if (filters.paymentCode) params.append('paymentCode', filters.paymentCode);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetch(`https://kwetu-backend.onrender.com/api/customer/payment-reports?${params}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        setError('Failed to fetch payment reports');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount) => {
    return `KES ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFeedbackStatus = (feedback) => {
    if (feedback === "No feedback yet") {
      return { text: feedback, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
    return { text: 'Feedback received', color: 'text-green-600', bg: 'bg-green-100' };
  };

  if (loading && reports.length === 0) {
    return (
      <div className="payments-container">
        <div className="payments-wrapper">
          <div className="loading-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-card">
              <div className="skeleton-rows">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-row"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <div className="payments-wrapper">
        {/* Header */}
        <div className="payments-header">
          <h1 className="payments-title">Payment Reports</h1>
          <p className="payments-subtitle">Track and manage all payment transactions</p>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-row">
            <div className="search-input-wrapper">
              <div className="input-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by coach name..."
                  value={filters.coach}
                  onChange={(e) => handleFilterChange('coach', e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="search-input-wrapper">
              <div className="input-container">
                <span className="search-icon">💳</span>
                <input
                  type="text"
                  placeholder="Payment code..."
                  value={filters.paymentCode}
                  onChange={(e) => handleFilterChange('paymentCode', e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <button
              onClick={fetchReports}
              disabled={loading}
              className="refresh-btn"
            >
              <span className="btn-icon">🔄</span>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-card">
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="payments-table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Service</th>
                  <th className="table-th">Coach</th>
                  <th className="table-th">Payment</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Feedback</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {reports.map((report, index) => {
                  const feedbackStatus = getFeedbackStatus(report.feedback);
                  return (
                    <tr key={index} className="table-row">
                      <td className="table-td">
                        <div className="customer-info">
                          <div className="customer-avatar">
                            <span className="avatar-icon">👤</span>
                          </div>
                          <div className="customer-details">
                            <p className="customer-name">{report.customer.name}</p>
                            <p className="customer-email">{report.customer.email}</p>
                            <p className="customer-phone">{report.customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="service-info">
                          <p className="service-title">{report.service.title}</p>
                          <div className="service-hours">
                            <span className="hours-icon">⏰</span>
                            <span className="hours-text">{report.service.hours} hours</span>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="coach-info">
                          <div className="coach-avatar">
                            <span className="coach-initial">
                              {report.coach ? report.coach.charAt(0).toUpperCase() : ''}
                            </span>
                          </div>
                          <span className="coach-name">{report.coach || ''}</span>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="payment-info">
                          <p className="payment-amount">{formatCurrency(report.payment.amount)}</p>
                          <p className="payment-code">{report.payment.code}</p>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="date-info">
                          <span className="date-icon">📅</span>
                          <span className="date-text">{formatDate(report.payment.date)}</span>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className={`feedback-badge ${feedbackStatus.text === 'No feedback yet' ? 'feedback-none' : 'feedback-received'}`}>
                          {feedbackStatus.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {reports.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">
                <span>💳</span>
              </div>
              <h3 className="empty-title">No payment reports found</h3>
              <p className="empty-text">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-card">
            <div className="pagination-info">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} results
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="pagination-btn"
              >
                ‹
              </button>
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`page-btn ${pagination.currentPage === pageNum ? 'page-btn-active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="pagination-btn"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;