import { Env, DiningReservation } from '../../../types';
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
    }    if (method === 'GET') {
      return handleGetAllReservations(request, env);
    } else if (method === 'POST') {
      return handleCreateReservation(request, env);
    } else if (method === 'PUT') {
      return handleUpdateReservation(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteReservation(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Admin dining API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetAllReservations(request: Request, env: Env) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  
  let query = `
    SELECT 
      dr.*,
      m.first_name,
      m.last_name,
      m.email,
      m.phone,
      m.member_id
    FROM dining_reservations dr
    JOIN members m ON dr.member_id = m.id
    WHERE dr.status = 'confirmed'
  `;
  let params: any[] = [];

  if (startDate && endDate) {
    query += ` AND dr.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY dr.date ASC, dr.time ASC`;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  return new Response(JSON.stringify({ 
    reservations: result.results,
    total: result.results?.length || 0
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateReservation(request: Request, env: Env) {
  const { memberIds, date, time, party_size, special_requests } = await request.json();

  if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return new Response(JSON.stringify({ error: 'At least one member ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!date || !time || !party_size) {
    return new Response(JSON.stringify({ error: 'Date, time, and party size are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use the first member as the primary member for the reservation
  const primaryMemberId = memberIds[0];

  const stmt = env.DB.prepare(`
    INSERT INTO dining_reservations (member_id, date, time, party_size, special_requests, status, created_by_admin)
    VALUES (?, ?, ?, ?, ?, 'confirmed', 1)
  `);

  try {
    const result = await stmt.bind(
      primaryMemberId,
      date,
      time,
      party_size,
      special_requests || null
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
  } catch (error) {
    console.error('Error creating dining reservation:', error);
    return new Response(JSON.stringify({ error: 'Failed to create reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateReservation(request: Request, env: Env) {
  const { id, date, time, party_size, special_requests } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Reservation ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE dining_reservations 
    SET date = ?, time = ?, party_size = ?, special_requests = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  try {
    await stmt.bind(date, time, party_size, special_requests, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return new Response(JSON.stringify({ error: 'Failed to update reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteReservation(request: Request, env: Env) {
  const url = new URL(request.url);
  const reservationId = url.searchParams.get('id');

  if (!reservationId) {
    return new Response(JSON.stringify({ error: 'Reservation ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE dining_reservations 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  try {
    await stmt.bind(reservationId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return new Response(JSON.stringify({ error: 'Failed to cancel reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
