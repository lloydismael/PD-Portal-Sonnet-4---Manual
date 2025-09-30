import React, { useState, useEffect } from 'react';
import { formAPI, customerAPI, costCenterAPI, userAPI } from '../services/api';

const FormCreator = () => {
  const [formData, setFormData] = useState({
    form_type: 'reimbursement',
    total_amount: '',
    remarks: '',
    cost_center_id: '',
    submitted_by_id: 1, // Default user for demo
    assigned_to_id: '',
  });
  
  const [attachment, setAttachment] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadCostCenters(selectedCustomer);
    }
  }, [selectedCustomer]);

  const loadInitialData = async () => {
    try {
      const [customersRes, managersRes] = await Promise.all([
        customerAPI.getAll(),
        userAPI.getAll('project_manager')
      ]);
      setCustomers(customersRes.data.customers);
      setProjectManagers(managersRes.data.users);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setMessage('Error loading data. Please refresh the page.');
    }
  };

  const loadCostCenters = async (customerId) => {
    try {
      const response = await costCenterAPI.getAll(customerId);
      setCostCenters(response.data.cost_centers);
    } catch (error) {
      console.error('Error loading cost centers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      if (attachment) {
        submitData.append('attachment', attachment);
      }

      await formAPI.create(submitData);
      setMessage('Form submitted successfully!');
      
      // Reset form
      setFormData({
        form_type: 'reimbursement',
        total_amount: '',
        remarks: '',
        cost_center_id: '',
        submitted_by_id: 1,
        assigned_to_id: '',
      });
      setAttachment(null);
      setSelectedCustomer('');
      setCostCenters([]);
      
      // Reset file input
      const fileInput = document.getElementById('attachment');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formTypeLabels = {
    reimbursement: 'Reimbursement',
    cash_advance: 'Cash Advance',
    liquidation: 'Liquidation'
  };

  return (
    <div className="modern-card animate-fade-in-up">
      <div className="card-header">
        <h2 className="card-title heading-lg">✨ Create New Form</h2>
        <p className="card-subtitle">Submit a new reimbursement, cash advance, or liquidation request with ease</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'} mb-3`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Form Type *</label>
              <select
                name="form_type"
                value={formData.form_type}
                onChange={handleInputChange}
                className="form-control form-select"
                required
              >
                <option value="reimbursement">💰 Reimbursement</option>
                <option value="cash_advance">💳 Cash Advance</option>
                <option value="liquidation">📋 Liquidation</option>
              </select>
            </div>
          </div>

          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Total Amount *</label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleInputChange}
                className="form-control"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="form-control form-select"
                required
              >
                <option value="">🏢 Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    🏢 {customer.name} ({customer.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Cost Center *</label>
              <select
                name="cost_center_id"
                value={formData.cost_center_id}
                onChange={handleInputChange}
                className="form-control form-select"
                required
                disabled={!selectedCustomer}
              >
                <option value="">📊 Select a cost center</option>
                {costCenters.map(costCenter => (
                  <option key={costCenter.id} value={costCenter.id}>
                    📊 {costCenter.name} ({costCenter.code})
                  </option>
                ))}
              </select>
              {!selectedCustomer && (
                <small className="text-muted">Please select a customer first</small>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Submit To (Project Manager)</label>
          <select
            name="assigned_to_id"
            value={formData.assigned_to_id}
            onChange={handleInputChange}
            className="form-control form-select"
          >
            <option value="">👨‍💼 Select a project manager (optional)</option>
            {projectManagers.map(manager => (
              <option key={manager.id} value={manager.id}>
                👨‍💼 {manager.full_name} ({manager.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Remarks / Notes</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="form-control"
            rows="4"
            placeholder="Add any additional details or notes about this request..."
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Attachment</label>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="form-control"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
          />
          <small className="text-muted">
            Supported formats: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 10MB)
          </small>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => window.history.back()}
          >
            ⬅️ Cancel
          </button>
          <button
            type="submit"
            className="btn btn-gradient btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Submitting...
              </>
            ) : (
              <>🚀 Submit Form</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCreator;