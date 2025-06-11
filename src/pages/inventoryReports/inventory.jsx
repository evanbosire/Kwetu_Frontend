import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';

const Inventory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState({
    supplier: '',
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, [pagination.currentPage, filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(filters.supplier && { supplier: filters.supplier }),
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      };

      const response = await axios.get('https://kwetu-backend.onrender.com/api/inventory/reports', {
        params
      });

      if (response.data.success) {
        setReports(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'stored': case 'paid': case 'accepted': return '#4CAF50';
      case 'supplied': case 'pending': return '#FF9800';
      case 'unpaid': return '#F44336';
      default: return '#757575';
    }
  };

  const clearFilters = () => {
    setFilters({
      supplier: '',
      status: '',
      paymentStatus: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Inventory Reports</h1>
      
      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Supplier</label>
          <input
            type="text"
            value={filters.supplier}
            onChange={(e) => handleFilterChange('supplier', e.target.value)}
            placeholder="Filter by supplier"
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="stored">Stored</option>
            <option value="supplied">Supplied</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Payment Status</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
          >
            <option value="">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <button className="apply-btn" onClick={fetchReports}>
          Apply Filters
        </button>
        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Inventory Table */}
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Price/Unit</th>
              <th>Total Price</th>
              <th>Payment Status</th>
              <th>Payment Code</th>
              <th>Inventory Status</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={`${report.requestId}-${index}`}>
                <td className="request-id">{report.requestId}</td>
                <td>{report.supplier}</td>
                <td>{formatDate(report.date)}</td>
                <td>{report.item.name}</td>
                <td>{report.item.quantity} {report.item.unit}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(report.item.status) }}>
                    {report.item.status}
                  </span>
                </td>
                <td>{formatCurrency(report.financial.pricePerUnit)}</td>
                <td>{formatCurrency(report.financial.totalPrice)}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(report.financial.paymentStatus) }}>
                    {report.financial.paymentStatus}
                  </span>
                </td>
                <td>{report.financial.paymentCode || '-'}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(report.inventory.status) }}>
                    {report.inventory.status}
                  </span>
                </td>
                <td className="feedback-cell">{report.item.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>
        
        <span className="page-info">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
        
        <span className="total-items">
          Total Items: {pagination.totalItems}
        </span>
      </div>
    </div>
  );
};

export default Inventory;