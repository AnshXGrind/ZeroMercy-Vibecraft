import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [JSON.stringify(filters)]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, refetch: fetchEvents };
};

export const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  return { event, loading, error, refetch: fetchEvent };
};

export const useRegistrations = (userId) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRegistrations();
    }
  }, [userId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          events (
            id,
            title,
            event_date,
            location,
            registration_fee
          )
        `)
        .eq('user_id', userId)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          user_id: userId,
          event_id: eventId,
          status: 'registered',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchRegistrations();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const cancelRegistration = async (registrationId) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'cancelled' })
        .eq('id', registrationId);

      if (error) throw error;
      await fetchRegistrations();
    } catch (err) {
      throw err;
    }
  };

  return {
    registrations,
    loading,
    error,
    refetch: fetchRegistrations,
    registerForEvent,
    cancelRegistration
  };
};
