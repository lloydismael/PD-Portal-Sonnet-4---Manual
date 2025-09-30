import React, { useState, useEffect } from 'react';
import { dashboardAPI, formAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_forms: 0,
    pending_forms: 0,
    approved_forms: 0,
    rejected_forms: 0
  });
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, formsRes] = await Promise.all([
        dashboardAPI.getStats(),
        formAPI.getAll({ submitted_by_id: 1 }) // Demo user ID
      ]);
      
      setStats(statsRes.data);
      setRecentForms(formsRes.data.forms.slice(0, 5)); // Last 5 forms
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected',
      completed: 'badge-approved'
    }[status] || 'badge-pending';

    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="modern-card animate-fade-in-scale">
        <div className="text-center" style={{ padding: '60px' }}>
          <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto 20px' }}></div>
          <p className="text-gradient">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Welcome Section */}
      <div className="modern-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h1 className="heading-xl">🚀 Welcome back, John!</h1>
          <p className="card-subtitle">Here's an overview of your reimbursement activities and recent submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="modern-grid" style={{ marginBottom: '2rem' }}>
        <div className="grid-item text-center animate-fade-in-scale" style={{ '--animation-delay': '0.1s' }}>
          <div className="stat-icon" style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>📊</div>
          <h3 className="stat-number text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>{stats.total_forms}</h3>
          <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Total Forms</p>
        </div>
        <div className="grid-item text-center animate-fade-in-scale" style={{ '--animation-delay': '0.2s' }}>
          <div className="stat-icon" style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>⏳</div>
          <h3 className="stat-number text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>{stats.pending_forms}</h3>
          <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Pending</p>
        </div>
        <div className="grid-item text-center animate-fade-in-scale" style={{ '--animation-delay': '0.3s' }}>
          <div className="stat-icon" style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>✅</div>
          <h3 className="stat-number text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>{stats.approved_forms}</h3>
          <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Approved</p>
        </div>
        <div className="grid-item text-center animate-fade-in-scale" style={{ '--animation-delay': '0.4s' }}>
          <div className="stat-icon" style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>❌</div>
          <h3 className="stat-number text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>{stats.rejected_forms}</h3>
          <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Rejected</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title heading-lg">⚡ Quick Actions</h2>
          <p className="card-subtitle">Jump right into creating new forms or managing existing ones</p>
        </div>
        <div className="d-flex gap-3 flex-wrap" style={{ justifyContent: 'center' }}>
          <a href="/forms/new" className="btn btn-gradient btn-lg">
            ➕ New Reimbursement
          </a>
          <a href="/forms/new" className="btn btn-primary btn-lg">
            💰 Cash Advance
          </a>
          <a href="/forms/new" className="btn btn-success btn-lg">
            📋 Liquidation
          </a>
          <a href="/forms" className="btn btn-secondary btn-lg">
            📝 View All Forms
          </a>
        </div>
      </div>

      {/* Recent Forms */}
      <div className="modern-card">
        <div className="card-header">
          <h2 className="card-title heading-lg">📈 Recent Forms</h2>
          <p className="card-subtitle">Your latest submitted forms and their current status</p>
        </div>

            {recentForms.length === 0 ? (
              <div className="text-center" style={{ padding: '40px' }}>
                <p>No forms submitted yet.</p>
                <a href="/forms/new" className="btn btn-primary mt-2">
                  Create Your First Form
                </a>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Form Number</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentForms.map(form => (
                      <tr key={form.id}>
                        <td><strong>{form.form_number}</strong></td>
                        <td>
                          {form.form_type === 'reimbursement' && '📋'}
                          {form.form_type === 'cash_advance' && '💰'}
                          {form.form_type === 'liquidation' && '📊'}
                          {' '}
                          {form.form_type.replace('_', ' ').toUpperCase()}
                        </td>
                        <td>{formatAmount(form.total_amount)}</td>
                        <td>{getStatusBadge(form.status)}</td>
                        <td>
                          {new Date(form.date_created).toLocaleDateString()}
                        </td>
                        <td>
                          {form.attachment_path && (
                            <a
                              href={`http://localhost:8000${form.attachment_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                            >
                              📎 View
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {recentForms.length > 0 && (
              <div className="text-center mt-3">
                <a href="/forms" className="btn btn-secondary btn-lg">
                  📋 View All Forms
                </a>
              </div>
            )}
      </div>
    </div>
  );
};

export default Dashboard;