import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRegistrations } from '../hooks/useEvents';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { registrations, loading, cancelRegistration } = useRegistrations(user?.id);
  const [cancelling, setCancelling] = React.useState(null);

  const handleCancelRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        setCancelling(registrationId);
        await cancelRegistration(registrationId);
      } catch (err) {
        alert('Failed to cancel registration: ' + err.message);
      } finally {
        setCancelling(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      registered: 'status-registered',
      cancelled: 'status-cancelled',
      attended: 'status-attended'
    };
    return classes[status] || '';
  };

  const getPaymentBadgeClass = (status) => {
    const classes = {
      pending: 'payment-pending',
      completed: 'payment-completed'
    };
    return classes[status] || '';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome, {profile?.name || 'User'}!</h1>
          <p className="user-email">{user?.email}</p>
          {profile?.college && <p className="user-college">🎓 {profile.college}</p>}
        </div>
        
        <div className="header-actions">
          <Link to="/events" className="btn-primary">
            Browse Events
          </Link>
          <button onClick={signOut} className="btn-secondary">
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">
            {registrations?.filter(r => r.status === 'registered').length || 0}
          </div>
          <div className="stat-label">Active Registrations</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {registrations?.filter(r => r.status === 'attended').length || 0}
          </div>
          <div className="stat-label">Events Attended</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {registrations?.filter(r => r.payment_status === 'pending').length || 0}
          </div>
          <div className="stat-label">Pending Payments</div>
        </div>
      </div>

      <div className="registrations-section">
        <h2>Your Event Registrations</h2>
        
        {loading ? (
          <div className="loading">Loading registrations...</div>
        ) : registrations?.length === 0 ? (
          <div className="empty-state">
            <p>You haven't registered for any events yet.</p>
            <Link to="/events" className="btn-primary">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="registrations-list">
            {registrations?.map((registration) => (
              <div key={registration.id} className="registration-card">
                <div className="registration-main">
                  <h3>{registration.events?.title}</h3>
                  <div className="registration-meta">
                    <span className="event-date">
                      📅 {formatDate(registration.events?.event_date)}
                    </span>
                    {registration.events?.location && (
                      <span className="event-location">
                        📍 {registration.events.location}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="registration-status">
                  <span className={`status-badge ${getStatusBadgeClass(registration.status)}`}>
                    {registration.status}
                  </span>
                  <span className={`payment-badge ${getPaymentBadgeClass(registration.payment_status)}`}>
                    {registration.payment_status}
                  </span>
                </div>

                <div className="registration-actions">
                  <Link 
                    to={`/events/${registration.event_id}`}
                    className="btn-view"
                  >
                    View Event
                  </Link>
                  
                  {registration.status === 'registered' && (
                    <button
                      onClick={() => handleCancelRegistration(registration.id)}
                      className="btn-cancel"
                      disabled={cancelling === registration.id}
                    >
                      {cancelling === registration.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>

                {registration.events?.registration_fee > 0 && (
                  <div className="registration-fee">
                    Fee: ₹{registration.events.registration_fee}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
