import { Env, CourtReservation, CourtReservationRequest } from '../../types';
import { verifyAuth } from '../auth/utils';

// Helper function to add CORS headers
function addCORSHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  // Handle OPTIONS requests for CORS
  if (method === 'OPTIONS') {
    return addCORSHeaders(new Response(null, { status: 200 }));
  }

  // Add debugging logs
  console.log('Tennis courts API called:', {
    method,
    url: url.toString(),
    environment: env.ENVIRONMENT || 'unknown',
    hasDB: !!env.DB,
    hasJWTSecret: !!env.JWT_SECRET
  });

  try {
    let response: Response;
    
    if (method === 'GET') {
      response = await handleGetCourtReservations(request, env);
    } else if (method === 'POST') {
      response = await handleCreateCourtReservation(request, env);
    } else if (method === 'DELETE') {
      response = await handleDeleteCourtReservation(request, env);
    } else {
      response = new Response('Method not allowed', { status: 405 });
    }

    return addCORSHeaders(response);
  } catch (error) {
    console.error('Tennis courts API error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      method,
      url: url.toString(),
      environment: env.ENVIRONMENT || 'unknown'
    });
    
    const errorResponse = new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    
    return addCORSHeaders(errorResponse);
  }
};

async function handleGetCourtReservations(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const courtType = url.searchParams.get('courtType');
  
  let query = `
    SELECT * FROM court_reservations 
    WHERE member_id = ? AND status = 'active'
  `;
  let params: any[] = [member.id];

  // Only filter by court type if specified
  if (courtType) {
    query += ` AND court_type = ?`;
    params.push(courtType);
  }

  if (startDate && endDate) {
    query += ` AND date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY date ASC, time ASC`;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  return new Response(JSON.stringify({ reservations: result.results || [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateCourtReservation(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body: CourtReservationRequest = await request.json();
  
  // Validate required fields
  if (!body.courtType || !body.date || !body.time || !body.duration) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate court type
  if (!['tennis', 'pickleball'].includes(body.courtType)) {
    return new Response(JSON.stringify({ error: 'Invalid court type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Auto-assign court if not specified
  let courtNumber = body.courtNumber;
  if (!courtNumber) {
    const maxCourts = body.courtType === 'tennis' ? 9 : 4;    // Find available court
    for (let i = 1; i <= maxCourts; i++) {
      const conflictCheck = env.DB.prepare(`
        SELECT id, time, duration FROM court_reservations 
        WHERE court_type = ? AND court_number = ? AND date = ? AND status = 'active'
      `);
      
      const existingReservations = await conflictCheck.bind(
        body.courtType, 
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
      body.courtType, 
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
    INSERT INTO court_reservations (member_id, court_type, court_number, date, time, duration, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    member.id,
    body.courtType,
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
      courtNumber,
      message: `${body.courtType === 'tennis' ? 'Tennis' : 'Pickleball'} court ${courtNumber} reserved successfully`
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

async function handleDeleteCourtReservation(request: Request, env: Env) {
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

  // Verify the reservation belongs to the member
  const verifyStmt = env.DB.prepare(`
    SELECT id FROM court_reservations WHERE id = ? AND member_id = ?
  `);
  const reservation = await verifyStmt.bind(reservationId, member.id).first();

  if (!reservation) {
    return new Response(JSON.stringify({ error: 'Reservation not found or unauthorized' }), {
      status: 404,
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
