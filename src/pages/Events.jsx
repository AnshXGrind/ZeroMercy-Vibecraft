import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { Link } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const { events, loading, error } = useEvents({
    category: selectedCategory,
    search: searchQuery
  });

  const categories = [
    { value: '', label: 'All Events' },
    { value: 'competition', label: 'Competitions' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'technical', label: 'Technical' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <p>Discover and register for exciting events at Vibecraft</p>
      </div>

      <div className="events-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events found</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              {event.image_url && (
                <div className="event-image">
                  <img src={event.image_url} alt={event.title} />
                </div>
              )}
              
              <div className="event-content">
                <div className="event-category">{event.category}</div>
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="event-date">
                    <span className="icon">📅</span>
                    {formatDate(event.event_date)}
                  </div>
                  
                  {event.location && (
                    <div className="event-location">
                      <span className="icon">📍</span>
                      {event.location}
                    </div>
                  )}
                  
                  {event.registration_fee > 0 && (
                    <div className="event-fee">
                      <span className="icon">💰</span>
                      ₹{event.registration_fee}
                    </div>
                  )}
                </div>
                
                <Link to={`/events/${event.id}`} className="btn-register">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
