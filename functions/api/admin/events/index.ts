import { Env, Event } from '../../../types';
import { verifyAdminAuth } from '../auth/utils.ts';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    const admin = await verifyAdminAuth(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      return handleGetAllEvents(request, env);
    } else if (method === 'POST') {
      return handleCreateEvent(request, env);
    } else if (method === 'PUT') {
      return handleUpdateEvent(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteEvent(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Admin events API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetAllEvents(request: Request, env: Env) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  
  let query = `
    SELECT 
      e.*,
      COUNT(er.id) as registered_count
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
    WHERE e.status = 'active'
  `;
  let params: any[] = [];

  if (startDate && endDate) {
    query += ` AND e.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY e.id ORDER BY e.date ASC, e.time ASC`;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  return new Response(JSON.stringify({ 
    events: result.results,
    total: result.results?.length || 0
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateEvent(request: Request, env: Env) {
  const { title, description, date, time, location, max_capacity, price } = await request.json();

  if (!title || !date || !time || !location) {
    return new Response(JSON.stringify({ error: 'Title, date, time, and location are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    INSERT INTO events (title, description, date, time, location, max_capacity, price, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  try {
    const result = await stmt.bind(title, description, date, time, location, max_capacity || null, price || 0).run();
    return new Response(JSON.stringify({ 
      success: true, 
      eventId: result.meta.last_row_id 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response(JSON.stringify({ error: 'Failed to create event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateEvent(request: Request, env: Env) {
  const { id, title, description, date, time, location, max_capacity, price } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Event ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE events 
    SET title = ?, description = ?, date = ?, time = ?, location = ?, max_capacity = ?, price = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  try {
    await stmt.bind(title, description, date, time, location, max_capacity || null, price || 0, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return new Response(JSON.stringify({ error: 'Failed to update event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteEvent(request: Request, env: Env) {
  const url = new URL(request.url);
  const eventId = url.searchParams.get('id');

  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Event ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE events 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  try {
    await stmt.bind(eventId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error cancelling event:', error);
    return new Response(JSON.stringify({ error: 'Failed to cancel event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
