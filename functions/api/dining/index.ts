import { Env, DiningReservation, DiningReservationRequest } from '../../types';
import { verifyAuth } from '../auth/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === 'GET') {
      return handleGetReservations(request, env);
    } else if (method === 'POST') {
      return handleCreateReservation(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteReservation(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Dining reservations API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetReservations(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    SELECT * FROM dining_reservations 
    WHERE member_id = ? AND status = 'confirmed'
    ORDER BY date ASC, time ASC
  `);
  
  const result = await stmt.bind(member.id).all();

  return new Response(JSON.stringify({ reservations: result.results }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateReservation(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body: DiningReservationRequest = await request.json();
  
  if (!body.date || !body.time || !body.partySize) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check for existing reservation at the same time (simple conflict check)
  const conflictCheck = env.DB.prepare(`
    SELECT COUNT(*) as count FROM dining_reservations 
    WHERE date = ? AND time = ? AND status = 'confirmed'
  `);
  const existingCount = await conflictCheck.bind(body.date, body.time).first();

  // Allow up to 5 reservations per time slot
  if (existingCount && existingCount.count >= 5) {
    return new Response(JSON.stringify({ error: 'No availability at this time' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    INSERT INTO dining_reservations (member_id, date, time, party_size, special_requests)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    member.id,
    body.date,
    body.time,
    body.partySize,
    body.specialRequests || null
  ).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Dining reservation created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to create reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteReservation(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const reservationId = url.searchParams.get('id');

  if (!reservationId) {
    return new Response(JSON.stringify({ error: 'Reservation ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE dining_reservations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ? AND member_id = ?
  `);
  
  const result = await stmt.bind(reservationId, member.id).run();

  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Reservation cancelled successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Reservation not found or unauthorized' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
