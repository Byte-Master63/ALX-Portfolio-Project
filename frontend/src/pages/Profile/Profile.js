import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './Profile.css';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { transactions, budgets, summary } = useContext(FinanceContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="profile-content">
        <Card title="Account Information">
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="profile-details">
              <div className="profile-field">
                <label>Full Name</label>
                <p>{user?.name || 'N/A'}</p>
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <p>{user?.email || 'N/A'}</p>
              </div>

              <div className="profile-field">
                <label>Member Since</label>
                <p>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Account Statistics">
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon">💳</div>
              <div className="stat-details">
                <p className="stat-label">Total Transactions</p>
                <p className="stat-value">{transactions.length}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <p className="stat-label">Active Budgets</p>
                <p className="stat-value">{budgets.length}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">💰</div>
              <div className="stat-details">
                <p className="stat-label">Current Balance</p>
                <p className="stat-value">
                  R{(summary.balance || 0).toLocaleString('en-ZA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-details">
                <p className="stat-label">Total Income</p>
                <p className="stat-value">
                  R{(summary.totalIncome || 0).toLocaleString('en-ZA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Account Actions">
          <div className="profile-actions">
            <Button variant="danger" onClick={handleLogout}>
              🚪 Logout
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

export default Profile;
