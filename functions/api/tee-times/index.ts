import { Env, TeeTime, TeeTimeRequest } from '../../types';
import { verifyAuth } from '../auth/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  try {
    if (method === 'GET') {
      return handleGetTeeTimes(request, env);
    } else if (method === 'POST') {
      return handleCreateTeeTime(request, env);
    } else if (method === 'PUT') {
      return handleUpdateTeeTime(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteTeeTime(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Tee times API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetTeeTimes(request: Request, env: Env) {
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
  let query = `
    SELECT * FROM tee_time_bookings 
    WHERE member_id = ? AND status = 'active'
  `;
  let params: any[] = [member.id];

  if (startDate && endDate) {
    query += ` AND date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY date ASC, time ASC`;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  // Map course names and format the response
  const courseNames = {
    'birches': 'The Birches',
    'woods': 'The Woods',
    'farms': 'The Farms'
  };

  const formattedTeeTimes = result.results?.map((teeTime: any) => ({
    ...teeTime,
    courseName: courseNames[teeTime.course_name as keyof typeof courseNames] || teeTime.course_name
  })) || [];

  return new Response(JSON.stringify({ teeTimes: formattedTeeTimes }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateTeeTime(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body: TeeTimeRequest = await request.json();
  
  // Validate required fields
  if (!body.courseId || !body.date || !body.time || !body.players) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }  // Check if the tee time slot is available or has space for additional players
  const existingCheck = env.DB.prepare(`
    SELECT id, players, allow_additional_players, member_id FROM tee_time_bookings 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
    ORDER BY created_at ASC
  `);
  const existingBookings = await existingCheck.bind(body.courseId, body.date, body.time).all();  if (existingBookings.results && existingBookings.results.length > 0) {
    // Calculate total players across all bookings
    const totalPlayers = existingBookings.results.reduce((sum: number, booking: any) => sum + (booking.players || 1), 0);
    const maxPlayers = 4;
    
    // Check if the first booking allows additional players and there's space
    const firstBooking = existingBookings.results[0];
    if (firstBooking.allow_additional_players && totalPlayers + body.players <= maxPlayers) {
      // Create a new individual booking for this member
      const memberName = `${member.first_name} ${member.last_name}`;
      const stmt = env.DB.prepare(`
        INSERT INTO tee_time_bookings (member_id, course_name, date, time, players, player_names, notes, allow_additional_players)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = await stmt.bind(
        member.id,
        body.courseId,
        body.date,
        body.time,
        body.players,
        memberName,
        body.notes || null,
        body.allowOthersToJoin ? 1 : 0
      ).run();

      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          id: result.meta.last_row_id,
          message: 'Successfully joined the tee time'
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }    } else {
      return new Response(JSON.stringify({ error: 'Tee time slot is full or not accepting additional players' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }  // Create the tee time booking
  const memberName = `${member.first_name} ${member.last_name}`;
  // Always use the actual number of players, not inflated count
  const playersToBook = body.players;
    const stmt = env.DB.prepare(`
    INSERT INTO tee_time_bookings (member_id, course_name, date, time, players, player_names, notes, allow_additional_players)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    member.id,
    body.courseId,
    body.date,
    body.time,
    playersToBook,
    memberName,
    body.notes || null,
    body.allowOthersToJoin ? 1 : 0
  ).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Tee time booked successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to create tee time' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateTeeTime(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const teeTimeId = url.searchParams.get('id');

  if (!teeTimeId) {
    return new Response(JSON.stringify({ error: 'Tee time ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();

  // Validate input
  if (!body.players || body.players < 1 || body.players > 4) {
    return new Response(JSON.stringify({ error: 'Players must be between 1 and 4' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }  // Verify the tee time booking belongs to the member
  const verifyStmt = env.DB.prepare(`
    SELECT id, players, course_name, date, time FROM tee_time_bookings WHERE id = ? AND member_id = ?
  `);
  const teeTime = await verifyStmt.bind(teeTimeId, member.id).first();

  if (!teeTime) {
    return new Response(JSON.stringify({ error: 'Tee time booking not found or access denied' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if the updated player count would exceed the 4-player limit
  if (body.players !== teeTime.players) {
    const capacityCheck = env.DB.prepare(`
      SELECT SUM(players) as total_players FROM tee_time_bookings 
      WHERE course_name = ? AND date = ? AND time = ? AND status = 'active' AND id != ?
    `);
    const capacityResult = await capacityCheck.bind(teeTime.course_name, teeTime.date, teeTime.time, teeTimeId).first();
    const otherPlayersCount = capacityResult?.total_players || 0;

    if (otherPlayersCount + body.players > 4) {
      const maxAllowed = 4 - otherPlayersCount;
      return new Response(JSON.stringify({ 
        error: `This would exceed the 4-player limit. Maximum ${maxAllowed} player${maxAllowed !== 1 ? 's' : ''} allowed for this booking.` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }  // Update the tee time booking
  let playerNames: string | null = null;
  
  // If player count changed, update player names
  if (body.players !== teeTime.players) {
    // Get member name for player names generation
    const memberQuery = env.DB.prepare(`
      SELECT first_name, last_name FROM members WHERE id = ?
    `);
    const memberResult = await memberQuery.bind(member.id).first();
    
    if (memberResult) {
      const memberName = `${memberResult.first_name} ${memberResult.last_name}`;
      
      if (body.players === 1) {
        playerNames = memberName;
      } else {
        const guestNames = Array(body.players - 1).fill(null).map((_, i) => `Guest ${i + 1}`);
        playerNames = [memberName, ...guestNames].join(', ');
      }
    }
  }

  const updateStmt = env.DB.prepare(`
    UPDATE tee_time_bookings 
    SET players = ?, 
        player_names = COALESCE(?, player_names),
        allow_additional_players = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  const result = await updateStmt.bind(
    body.players,
    playerNames,
    body.allowOthersToJoin ? 1 : 0,
    teeTimeId
  ).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Tee time updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to update tee time' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteTeeTime(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const teeTimeId = url.searchParams.get('id');

  if (!teeTimeId) {
    return new Response(JSON.stringify({ error: 'Tee time ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Verify the tee time booking belongs to the member
  const verifyStmt = env.DB.prepare(`
    SELECT id FROM tee_time_bookings WHERE id = ? AND member_id = ?
  `);
  const teeTime = await verifyStmt.bind(teeTimeId, member.id).first();

  if (!teeTime) {
    return new Response(JSON.stringify({ error: 'Tee time booking not found or unauthorized' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Cancel the tee time booking (soft delete)
  const stmt = env.DB.prepare(`
    UPDATE tee_time_bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  
  const result = await stmt.bind(teeTimeId).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Tee time cancelled successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to cancel tee time' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
