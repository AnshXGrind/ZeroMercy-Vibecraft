import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // GET /api/registrations - Get user's registrations
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, events(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // POST /api/registrations - Register for event
    if (req.method === 'POST') {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).json({ error: 'event_id is required' });
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', event_id)
        .single();

      if (existing) {
        return res.status(400).json({ error: 'Already registered for this event' });
      }

      const { data, error } = await supabase
        .from('registrations')
        .insert([{ user_id: user.id, event_id }])
        .select('*, events(*)')
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // DELETE /api/registrations/:id - Cancel registration
    if (req.method === 'DELETE') {
      const registrationId = req.url.split('/').pop();

      // Verify ownership
      const { data: registration } = await supabase
        .from('registrations')
        .select('user_id')
        .eq('id', registrationId)
        .single();

      if (!registration || registration.user_id !== user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { error } = await supabase
        .from('registrations')
        .update({ status: 'cancelled' })
        .eq('id', registrationId);

      if (error) throw error;
      return res.status(200).json({ message: 'Registration cancelled' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Registrations API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
