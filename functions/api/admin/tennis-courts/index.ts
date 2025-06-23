import { Env, CourtReservation, CourtReservationRequest } from '../../../types';
import { verifyAdminAuth } from '../auth/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === 'GET') {
      return handleGetCourtReservations(request, env);
    } else if (method === 'POST') {
      return handleCreateCourtReservation(request, env);
    } else if (method === 'PUT') {
      return handleUpdateCourtReservation(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteCourtReservation(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Admin tennis courts API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetCourtReservations(request: Request, env: Env) {
  const admin = await verifyAdminAuth(request, env);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  const courtType = url.searchParams.get('courtType') || 'tennis';

  const query = `
    SELECT 
      cr.*,
      m.first_name,
      m.last_name,
      m.email,
      m.phone,
      m.member_id as member_id_display
    FROM court_reservations cr
    JOIN members m ON cr.member_id = m.id
    WHERE cr.date = ? AND cr.court_type = ? AND cr.status = 'active'
    ORDER BY cr.court_number ASC, cr.time ASC
  `;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(date, courtType).all();

  return new Response(JSON.stringify({ reservations: result.results || [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateCourtReservation(request: Request, env: Env) {
  const admin = await verifyAdminAuth(request, env);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  
  // Validate required fields
  if (!body.member_id || !body.court_type || !body.date || !body.time || !body.duration) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate court type
  if (!['tennis', 'pickleball'].includes(body.court_type)) {
    return new Response(JSON.stringify({ error: 'Invalid court type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if member exists
  const memberCheck = env.DB.prepare('SELECT id FROM members WHERE id = ?');
  const member = await memberCheck.bind(body.member_id).first();
  if (!member) {
    return new Response(JSON.stringify({ error: 'Member not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Auto-assign court if not specified
  let courtNumber = body.court_number;
  if (!courtNumber) {
    const maxCourts = body.court_type === 'tennis' ? 9 : 4;
      // Find available court
    for (let i = 1; i <= maxCourts; i++) {
      const conflictCheck = env.DB.prepare(`
        SELECT id, time, duration FROM court_reservations 
        WHERE court_type = ? AND court_number = ? AND date = ? AND status = 'active'
      `);
      
      const existingReservations = await conflictCheck.bind(
        body.court_type, 
        i, 
        body.date
      ).all();
      
      const newStartTime = new Date(`2000-01-01T${body.time}`);
      const newEndTime = new Date(newStartTime.getTime() + body.duration * 60000);
      
      let hasConflict = false;
      for (const reservation of existingReservations.results || []) {
        const existingStartTime = new Date(`2000-01-01T${reservation.time}`);
        const existingEndTime = new Date(existingStartTime.getTime() + reservation.duration * 60000);
        
        // Check for overlap
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
          hasConflict = true;
          break;
        }
      }
      
      if (!hasConflict) {
        courtNumber = i;
        break;
      }
    }
    
    if (!courtNumber) {
      return new Response(JSON.stringify({ error: 'No courts available at the requested time' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {    // Check if specified court is available
    const conflictCheck = env.DB.prepare(`
      SELECT id, time, duration FROM court_reservations 
      WHERE court_type = ? AND court_number = ? AND date = ? AND status = 'active'
    `);
    
    const existingReservations = await conflictCheck.bind(
      body.court_type, 
      courtNumber, 
      body.date
    ).all();
    
    const newStartTime = new Date(`2000-01-01T${body.time}`);
    const newEndTime = new Date(newStartTime.getTime() + body.duration * 60000);
    
    for (const reservation of existingReservations.results || []) {
      const existingStartTime = new Date(`2000-01-01T${reservation.time}`);
      const existingEndTime = new Date(existingStartTime.getTime() + reservation.duration * 60000);
      
      // Check for overlap
      if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
        return new Response(JSON.stringify({ error: 'Selected court is not available at the requested time' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  // Create the reservation
  const stmt = env.DB.prepare(`
    INSERT INTO court_reservations (member_id, court_type, court_number, date, time, duration, notes, created_by_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const result = await stmt.bind(
    body.member_id,
    body.court_type,
    courtNumber,
    body.date,
    body.time,
    body.duration,
    body.notes || null
  ).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Court reservation created successfully'
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

async function handleUpdateCourtReservation(request: Request, env: Env) {
  const admin = await verifyAdminAuth(request, env);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  
  if (!body.id) {
    return new Response(JSON.stringify({ error: 'Reservation ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if reservation exists
  const existingCheck = env.DB.prepare('SELECT id FROM court_reservations WHERE id = ?');
  const existing = await existingCheck.bind(body.id).first();
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Reservation not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Update the reservation
  const stmt = env.DB.prepare(`
    UPDATE court_reservations 
    SET court_type = ?, court_number = ?, date = ?, time = ?, duration = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  const result = await stmt.bind(
    body.court_type,
    body.court_number,
    body.date,
    body.time,
    body.duration,
    body.notes || null,
    body.id
  ).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Court reservation updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to update reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteCourtReservation(request: Request, env: Env) {
  const admin = await verifyAdminAuth(request, env);
  if (!admin) {
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

  // Cancel the reservation (soft delete)
  const stmt = env.DB.prepare(`
    UPDATE court_reservations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  
  const result = await stmt.bind(reservationId).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Court reservation cancelled successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to cancel reservation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
