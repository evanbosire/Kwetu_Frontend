import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';

const Inventory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://kwetu-backend.onrender.com/api/inventory/reports');
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
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

  const filteredReports = reports.filter(report => 
    report.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.financial.paymentCode && 
     report.financial.paymentCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by supplier, item name, or payment code..."
          className="search-input"
        />
      </div>

      {/* Inventory Table */}
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Date</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Price/Unit</th>
              <th>Total Price</th>
              <th>Payment Status</th>
              <th>Payment Code</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={`${report.requestId}-${index}`}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;