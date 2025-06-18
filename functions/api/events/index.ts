import { Env, Event, EventRegistration } from '../../types';
import { verifyAuth } from '../auth/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === 'GET') {
      return handleGetEvents(request, env);
    } else if (method === 'POST') {
      return handleRegisterForEvent(request, env);
    } else if (method === 'DELETE') {
      return handleUnregisterFromEvent(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Events API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetEvents(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get all active events with registration status
  const stmt = env.DB.prepare(`
    SELECT 
      e.*,
      CASE WHEN er.member_id IS NOT NULL THEN 1 ELSE 0 END as is_registered,
      COUNT(er2.id) as registered_count
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id AND er.member_id = ? AND er.status = 'registered'
    LEFT JOIN event_registrations er2 ON e.id = er2.event_id AND er2.status = 'registered'
    WHERE e.status = 'active' AND e.date >= DATE('now')
    GROUP BY e.id
    ORDER BY e.date ASC, e.time ASC
  `);
  
  const result = await stmt.bind(member.id).all();

  return new Response(JSON.stringify({ events: result.results }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleRegisterForEvent(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  const eventId = body.eventId;
  
  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Event ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if event exists and is active
  const eventStmt = env.DB.prepare(`
    SELECT * FROM events WHERE id = ? AND status = 'active' AND date >= DATE('now')
  `);
  const event = await eventStmt.bind(eventId).first();

  if (!event) {
    return new Response(JSON.stringify({ error: 'Event not found or not available' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if already registered
  const existingStmt = env.DB.prepare(`
    SELECT id FROM event_registrations 
    WHERE event_id = ? AND member_id = ? AND status = 'registered'
  `);
  const existing = await existingStmt.bind(eventId, member.id).first();

  if (existing) {
    return new Response(JSON.stringify({ error: 'Already registered for this event' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check capacity if max_attendees is set
  if (event.max_attendees) {
    const countStmt = env.DB.prepare(`
      SELECT COUNT(*) as count FROM event_registrations 
      WHERE event_id = ? AND status = 'registered'
    `);
    const countResult = await countStmt.bind(eventId).first();
    
    if (countResult && countResult.count >= event.max_attendees) {
      return new Response(JSON.stringify({ error: 'Event is full' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Register for the event
  const stmt = env.DB.prepare(`
    INSERT INTO event_registrations (event_id, member_id)
    VALUES (?, ?)
  `);

  const result = await stmt.bind(eventId, member.id).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully registered for event'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to register for event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUnregisterFromEvent(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId');

  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Event ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE event_registrations SET status = 'cancelled' 
    WHERE event_id = ? AND member_id = ? AND status = 'registered'
  `);
  
  const result = await stmt.bind(eventId, member.id).run();

  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Successfully unregistered from event'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Registration not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
