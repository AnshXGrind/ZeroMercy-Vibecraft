import express from 'express';

export default function registrationRoutes(supabase) {
  const router = express.Router();

  // Register for event
  router.post('/', async (req, res) => {
    try {
      const { eventId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ error: 'Event ID required' });
      }

      // Check event capacity and status
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, title, max_participants, current_participants, fee, is_active')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      if (!event.is_active) {
        return res.status(400).json({ error: 'Event is not active' });
      }
      
      if (event.max_participants && event.current_participants >= event.max_participants) {
        return res.status(400).json({ error: 'Event is full' });
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('event_id', eventId)
        .single();

      if (existing) {
        return res.status(400).json({ error: 'Already registered for this event' });
      }

      // Create registration
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          {
            user_id: req.user.id,
            event_id: eventId,
            payment_status: event.fee > 0 ? 'pending' : 'completed'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Successfully registered',
        registration: data,
        event: {
          title: event.title,
          fee: event.fee
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === '23505') {
        res.status(400).json({ error: 'Already registered for this event' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Get user's registrations
  router.get('/my-registrations', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          event:events(*)
        `)
        .eq('user_id', req.user.id)
        .order('registration_date', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get registration details
  router.get('/:id', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          event:events(*),
          user:profiles(name, email, college)
        `)
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .single();

      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      res.json(data);
    } catch (error) {
      res.status(404).json({ error: 'Registration not found' });
    }
  });

  // Cancel registration
  router.delete('/:id', async (req, res) => {
    try {
      // First check if registration exists and belongs to user
      const { data: registration, error: fetchError } = await supabase
        .from('registrations')
        .select('*, event:events(title, date_time)')
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .single();

      if (fetchError || !registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Check if event hasn't started yet (allow cancellation)
      const eventDate = new Date(registration.event.date_time);
      const now = new Date();
      
      if (eventDate < now) {
        return res.status(400).json({ error: 'Cannot cancel past event registration' });
      }

      // Delete registration
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

      if (error) throw error;

      res.json({ 
        message: 'Registration cancelled successfully',
        event: registration.event.title
      });
    } catch (error) {
      console.error('Cancel registration error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update payment status (for payment integration)
  router.patch('/:id/payment', async (req, res) => {
    try {
      const { payment_status, transaction_id } = req.body;

      if (!payment_status) {
        return res.status(400).json({ error: 'Payment status required' });
      }

      const { data, error } = await supabase
        .from('registrations')
        .update({
          payment_status,
          transaction_id: transaction_id || null
        })
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: 'Payment status updated',
        registration: data
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get event registrations (admin only)
  router.get('/event/:eventId', async (req, res) => {
    try {
      // Verify admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          user:profiles(name, email, phone, college)
        `)
        .eq('event_id', req.params.eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
