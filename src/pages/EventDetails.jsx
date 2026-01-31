import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { useRegistrations } from '../hooks/useEvents';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(id);
  const { user } = useAuth();
  const { registrations, registerForEvent } = useRegistrations(user?.id);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState('');
  const [success, setSuccess] = useState('');

  const isRegistered = registrations?.some(
    reg => reg.event_id === id && reg.status === 'registered'
  );

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      setRegError('');
      await registerForEvent(id);
      setSuccess('Successfully registered for the event!');
    } catch (err) {
      setRegError(err.message || 'Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-container">
        <div className="error-message">Event not found</div>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      {event.image_url && (
        <div className="event-banner">
          <img src={event.image_url} alt={event.title} />
        </div>
      )}

      <div className="event-details-content">
        <div className="event-details-header">
          <div className="event-category-badge">{event.category}</div>
          <h1>{event.title}</h1>
        </div>

        <div className="event-info-grid">
          <div className="info-card">
            <span className="icon">📅</span>
            <div>
              <h3>Date & Time</h3>
              <p>{formatDate(event.event_date)}</p>
            </div>
          </div>

          {event.location && (
            <div className="info-card">
              <span className="icon">📍</span>
              <div>
                <h3>Location</h3>
                <p>{event.location}</p>
              </div>
            </div>
          )}

          {event.registration_fee !== null && (
            <div className="info-card">
              <span className="icon">💰</span>
              <div>
                <h3>Registration Fee</h3>
                <p>{event.registration_fee > 0 ? `₹${event.registration_fee}` : 'Free'}</p>
              </div>
            </div>
          )}

          {event.max_participants && (
            <div className="info-card">
              <span className="icon">👥</span>
              <div>
                <h3>Max Participants</h3>
                <p>{event.max_participants}</p>
              </div>
            </div>
          )}
        </div>

        <div className="event-description-section">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>

        <div className="registration-section">
          {success && <div className="success-message">{success}</div>}
          {regError && <div className="error-message">{regError}</div>}

          {isRegistered ? (
            <div className="registered-badge">
              ✓ You are registered for this event
            </div>
          ) : (
            <button
              className="btn-register-event"
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? 'Registering...' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
