import express from 'express';

export default function eventRoutes(supabase, verifySupabaseJWT) {
  const router = express.Router();

  // Get all active events (public)
  router.get('/', async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let query = supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date_time', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Fetch events error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get single event with creator info (public)
  router.get('/:id', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!created_by(name, college)
        `)
        .eq('id', req.params.id)
        .single();

      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(data);
    } catch (error) {
      res.status(404).json({ error: 'Event not found' });
    }
  });

  // Get events by category (public)
  router.get('/category/:category', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('category', req.params.category)
        .eq('is_active', true)
        .order('date_time', { ascending: true });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create event (admin only)
  router.post('/', verifySupabaseJWT, async (req, res) => {
    try {
      // Verify user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const {
        title,
        description,
        category,
        date_time,
        venue,
        max_participants,
        image_url,
        fee
      } = req.body;

      if (!title || !description || !category || !date_time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const eventData = {
        title,
        description,
        category,
        date_time,
        venue,
        max_participants: max_participants || null,
        image_url: image_url || null,
        fee: fee || 0,
        created_by: req.user.id,
        is_active: true
      };

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Create event error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Update event (admin only)
  router.put('/:id', verifySupabaseJWT, async (req, res) => {
    try {
      // Verify user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { data, error } = await supabase
        .from('events')
        .update({
          ...req.body,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete/Deactivate event (admin only)
  router.delete('/:id', verifySupabaseJWT, async (req, res) => {
    try {
      // Verify user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // Soft delete by setting is_active to false
      const { data, error } = await supabase
        .from('events')
        .update({ is_active: false })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json({ message: 'Event deactivated', data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
