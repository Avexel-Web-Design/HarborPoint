import { Env, TeeTime } from '../../../types';
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
      return handleGetAllTeeTimes(request, env);
    } else if (method === 'POST') {
      return handleCreateTeeTime(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteTeeTime(request, env);
    } else if (method === 'PUT') {
      return handleUpdateTeeTime(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Admin tee times API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetAllTeeTimes(request: Request, env: Env) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  
  let query = `
    SELECT 
      ttb.*,
      m.first_name,
      m.last_name,
      m.email,
      m.phone,
      m.member_id as member_id_display
    FROM tee_time_bookings ttb
    JOIN members m ON ttb.member_id = m.id
    WHERE ttb.status = 'active'
  `;
  let params: any[] = [];

  if (startDate && endDate) {
    query += ` AND ttb.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY ttb.date ASC, ttb.time ASC`;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  // Format the response with proper field mapping
  const formattedTeeTimes = result.results?.map((booking: any) => ({
    id: booking.id,
    member_id: booking.member_id,
    member_id_display: booking.member_id_display,
    date: booking.date,
    time: booking.time,
    course_name: booking.course_name,
    players: booking.players || 1,
    player_names: booking.player_names,
    notes: booking.notes,
    status: booking.status,
    first_name: booking.first_name,
    last_name: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    created_at: booking.created_at,
    updated_at: booking.updated_at,
    allow_additional_players: booking.allow_additional_players
  })) || [];

  return new Response(JSON.stringify({ 
    teeTimes: formattedTeeTimes,
    total: formattedTeeTimes.length
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleDeleteTeeTime(request: Request, env: Env) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get('id');

  if (!bookingId) {
    return new Response(JSON.stringify({ error: 'Booking ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE tee_time_bookings 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);  try {
    await stmt.bind(bookingId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return new Response(JSON.stringify({ error: 'Failed to cancel booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateTeeTime(request: Request, env: Env) {
  const { id, memberIds, courseId, date, time, notes, players } = await request.json();
  console.log('Admin update request:', { id, memberIds, courseId, date, time, notes, players });

  if (!id) {
    return new Response(JSON.stringify({ error: 'Booking ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (memberIds && Array.isArray(memberIds) && memberIds.length > 1) {
    return new Response(JSON.stringify({ error: 'Please select only one member per booking' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get the current booking to preserve existing data
    const currentBookingStmt = env.DB.prepare(`
      SELECT * FROM tee_time_bookings WHERE id = ?
    `);
    const currentBooking = await currentBookingStmt.bind(id).first();

    if (!currentBooking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle member change
    let memberId = null;
    let finalPlayerNames = currentBooking.player_names;

    if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
      memberId = memberIds[0];
      
      // Get the new member's name
      const memberQuery = env.DB.prepare(`
        SELECT first_name, last_name FROM members WHERE id = ?
      `);
      const memberResult = await memberQuery.bind(memberId).first();
      
      if (memberResult) {
        const memberName = `${memberResult.first_name} ${memberResult.last_name}`;
        const playersCount = players || currentBooking.players;
        
        // Generate player names (member + guests if more than 1 player)
        if (playersCount === 1) {
          finalPlayerNames = memberName;
        } else {
          const guestNames = Array(playersCount - 1).fill(null).map((_, i) => `Guest ${i + 1}`);
          finalPlayerNames = [memberName, ...guestNames].join(', ');
        }
      }
    } else if (players && players !== currentBooking.players) {
      // Player count changed but no member change - update guest names
      const currentPrimary = currentBooking.player_names?.split(',')[0]?.trim() || 'Unknown Member';
      
      if (players === 1) {
        finalPlayerNames = currentPrimary;
      } else {
        const guestNames = Array(players - 1).fill(null).map((_, i) => `Guest ${i + 1}`);
        finalPlayerNames = [currentPrimary, ...guestNames].join(', ');
      }
    }

    const stmt = env.DB.prepare(`
      UPDATE tee_time_bookings 
      SET member_id = COALESCE(?, member_id),
          course_name = COALESCE(?, course_name),
          date = COALESCE(?, date),
          time = COALESCE(?, time),
          players = COALESCE(?, players),
          player_names = COALESCE(?, player_names),
          notes = COALESCE(?, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = await stmt.bind(
      memberId,
      courseId,
      date,
      time,
      players || null,
      finalPlayerNames,
      notes || null,
      id
    ).run();

    console.log('Update result:', result);

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Update failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    return new Response(JSON.stringify({ error: `Failed to update booking: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCreateTeeTime(request: Request, env: Env) {
  const { memberIds, courseId, date, time, notes, players } = await request.json();

  if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return new Response(JSON.stringify({ error: 'A member ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (memberIds.length > 1) {
    return new Response(JSON.stringify({ error: 'Please select only one member per booking. Create separate bookings for additional members.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!courseId || !date || !time) {
    return new Response(JSON.stringify({ error: 'Course, date, and time are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const memberId = memberIds[0];
  const playersCount = players || 1;

  // Check if this member already has a booking for this slot
  const conflictCheck = env.DB.prepare(`
    SELECT id FROM tee_time_bookings 
    WHERE course_name = ? AND date = ? AND time = ? AND member_id = ? AND status = 'active'
  `);
  const existing = await conflictCheck.bind(courseId, date, time, memberId).first();

  if (existing) {
    return new Response(JSON.stringify({ error: 'This member already has a booking for this time slot' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if adding this booking would exceed the 4-player limit
  const capacityCheck = env.DB.prepare(`
    SELECT SUM(players) as total_players FROM tee_time_bookings 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
  `);
  const capacityResult = await capacityCheck.bind(courseId, date, time).first();
  const currentPlayers = capacityResult?.total_players || 0;

  if (currentPlayers + playersCount > 4) {
    const remainingSpots = 4 - currentPlayers;
    return new Response(JSON.stringify({ 
      error: `This booking would exceed the 4-player limit. Only ${remainingSpots} spot${remainingSpots !== 1 ? 's' : ''} remaining.` 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get member name for the booking
    const memberQuery = env.DB.prepare(`
      SELECT first_name, last_name FROM members WHERE id = ?
    `);
    const memberResult = await memberQuery.bind(memberId).first();
    
    if (!memberResult) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const memberName = `${memberResult.first_name} ${memberResult.last_name}`;
    
    // Generate player names (member + guests if more than 1 player)
    let playerNames = memberName;
    if (playersCount > 1) {
      const guestNames = Array(playersCount - 1).fill(null).map((_, i) => `Guest ${i + 1}`);
      playerNames = [memberName, ...guestNames].join(', ');
    }

    const stmt = env.DB.prepare(`
      INSERT INTO tee_time_bookings (member_id, course_name, date, time, players, player_names, notes, allow_additional_players)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(
      memberId,
      courseId,
      date,
      time,
      playersCount,
      playerNames,
      notes || null,
      1 // Allow additional players by default for admin-created bookings
    ).run();

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        id: result.meta.last_row_id,
        message: 'Tee time booking created successfully'
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to create tee time booking' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error creating tee time booking:', error);
    return new Response(JSON.stringify({ error: 'Failed to create tee time booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
