import React, { useState, useEffect } from 'react';
import { formAPI } from '../services/api';

const FormList = ({ showAssignedToMe = false }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    form_type: '',
    status: '',
  });

  useEffect(() => {
    loadForms();
  }, [filter, showAssignedToMe]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const filters = { ...filter };
      
      if (showAssignedToMe) {
        filters.assigned_to_id = 3; // Demo: Project Manager ID
      } else {
        filters.submitted_by_id = 1; // Demo: Current User ID
      }

      const response = await formAPI.getAll(filters);
      setForms(response.data.forms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (formId, newStatus) => {
    try {
      await formAPI.updateStatus(formId, newStatus);
      loadForms(); // Reload forms
    } catch (error) {
      console.error('Error updating status:', error);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      time: 'short'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFormTypeLabel = (type) => {
    const labels = {
      reimbursement: 'Reimbursement',
      cash_advance: 'Cash Advance',
      liquidation: 'Liquidation'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center" style={{ padding: '40px' }}>
          <p>Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">
          {showAssignedToMe ? 'Forms for Review' : 'My Forms'}
        </h2>
        <p className="card-subtitle">
          {showAssignedToMe 
            ? 'Forms assigned to you for review and approval'
            : 'Track your submitted forms and their status'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-4">
          <select
            value={filter.form_type}
            onChange={(e) => setFilter(prev => ({ ...prev, form_type: e.target.value }))}
            className="form-control"
          >
            <option value="">All Types</option>
            <option value="reimbursement">Reimbursement</option>
            <option value="cash_advance">Cash Advance</option>
            <option value="liquidation">Liquidation</option>
          </select>
        </div>
        <div className="col-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="form-control"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {forms.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <p>No forms found.</p>
          {!showAssignedToMe && (
            <button 
              className="btn btn-primary mt-2"
              onClick={() => window.location.href = '/forms/new'}
            >
              Create Your First Form
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Form Number</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Cost Center</th>
                {showAssignedToMe && <th>Submitted By</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map(form => (
                <tr key={form.id} className="slide-in">
                  <td>
                    <strong>{form.form_number}</strong>
                  </td>
                  <td>{getFormTypeLabel(form.form_type)}</td>
                  <td>{formatAmount(form.total_amount)}</td>
                  <td>{formatDate(form.date_created)}</td>
                  <td>{getStatusBadge(form.status)}</td>
                  <td>
                    {form.cost_center.name}
                    <br />
                    <small className="text-muted">
                      {form.cost_center.customer.name}
                    </small>
                  </td>
                  {showAssignedToMe && (
                    <td>{form.submitted_by.full_name}</td>
                  )}
                  <td>
                    <div className="d-flex gap-2">
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
                      
                      {showAssignedToMe && form.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(form.id, 'approved')}
                            className="btn btn-success btn-sm"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(form.id, 'rejected')}
                            className="btn btn-error btn-sm"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormList;