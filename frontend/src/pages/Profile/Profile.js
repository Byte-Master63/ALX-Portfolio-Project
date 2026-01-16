// src/pages/Profile/Profile.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Alert from '../../components/Alert/Alert';
import { formatDate } from '../../utils/date';
import './Profile.css';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { summary } = useContext(FinanceContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Auto-dismiss alerts
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    // Validate name
    if (formData.name.trim().length < 2) {
      setAlert({ type: 'error', message: 'Name must be at least 2 characters' });
      setLoading(false);
      return;
    }

    // If changing password, validate
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setAlert({ type: 'error', message: 'New password must be at least 6 characters' });
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setAlert({ type: 'error', message: 'New passwords do not match' });
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setAlert({ type: 'error', message: 'Current password is required to change password' });
        setLoading(false);
        return;
      }
    }

    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('token');
      
      const updateData = {
        name: formData.name.trim()
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ type: 'success', message: 'Profile updated successfully!' });
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        // Refresh page to update user data
        window.location.reload();
      } else {
        setAlert({ type: 'error', message: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      return;
    }

    const secondConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
    if (secondConfirm !== 'DELETE') {
      setAlert({ type: 'info', message: 'Account deletion cancelled' });
      return;
    }

    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ type: 'success', message: 'Account deleted successfully' });
        setTimeout(() => logout(), 2000);
      } else {
        setAlert({ type: 'error', message: data.message || 'Failed to delete account' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <Card title="Profile">
          <p>Loading user information...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="profile-subtitle">Manage your account settings</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="profile-grid">
        {/* Profile Information Card */}
        <Card title="Profile Information" className="profile-card">
          {!isEditing ? (
            <div className="profile-info">
              <div className="profile-avatar">
                <span className="profile-avatar-text">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="profile-details">
                <div className="profile-detail-item">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
                
                <div className="profile-detail-item">
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
                
                <div className="profile-detail-item">
                  <label>Member Since</label>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="profile-actions">
                <Button 
                  variant="primary" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength="2"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  disabled
                  style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small className="form-hint">Email cannot be changed</small>
              </div>

              <div className="form-divider">
                <span>Change Password (Optional)</span>
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength="6"
                  disabled={loading}
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="profile-actions">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(prev => ({
                      ...prev,
                      name: user.name,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Account Statistics Card */}
        <Card title="Account Statistics" className="profile-card">
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <label>Total Transactions</label>
                <p className="stat-value">{summary?.transactionCount || 0}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <label>Current Balance</label>
                <p className="stat-value">${(summary?.balance || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <label>Total Income</label>
                <p className="stat-value income">${(summary?.totalIncome || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📉</div>
              <div className="stat-info">
                <label>Total Expenses</label>
                <p className="stat-value expense">${(summary?.totalExpenses || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone Card */}
        <Card title="Danger Zone" className="profile-card danger-card">
          <div className="danger-zone">
            <div className="danger-info">
              <h4>Delete Account</h4>
              <p>
                Once you delete your account, there is no going back. 
                All your transactions, budgets, and data will be permanently deleted.
              </p>
            </div>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
