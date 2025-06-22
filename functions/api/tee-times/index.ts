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
    SELECT * FROM tee_times 
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
  }
  // Check if the tee time slot is available or has space for additional players
  const existingCheck = env.DB.prepare(`
    SELECT id, players FROM tee_times 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
  `);
  const existing = await existingCheck.bind(body.courseId, body.date, body.time).first();

  if (existing) {
    const currentPlayers = existing.players || 1;
    const maxPlayers = 4;
    
    // If we allow others to join and there's space, we can add to the existing booking
    if (body.allowOthersToJoin && currentPlayers + body.players <= maxPlayers) {
      // Update the existing tee time to add more players
      const updateStmt = env.DB.prepare(`
        UPDATE tee_times 
        SET players = players + ?, 
            player_names = CASE 
              WHEN player_names IS NULL THEN ? 
              ELSE player_names || ', ' || ? 
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      const memberName = `${member.first_name} ${member.last_name}`;
      const result = await updateStmt.bind(
        body.players,
        memberName,
        memberName,
        existing.id
      ).run();

      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          id: existing.id,
          message: 'Successfully joined the tee time'
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Tee time slot is already booked or no space available' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  // Create the tee time
  const memberName = `${member.first_name} ${member.last_name}`;
  const playersToBook = body.allowOthersToJoin ? body.players : 4; // If allowing others, book exact amount; otherwise, book full slot
  
  const stmt = env.DB.prepare(`
    INSERT INTO tee_times (member_id, course_name, date, time, players, player_names, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    member.id,
    body.courseId,
    body.date,
    body.time,
    playersToBook,
    memberName,
    body.notes || null
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

  // Verify the tee time belongs to the member
  const verifyStmt = env.DB.prepare(`
    SELECT id FROM tee_times WHERE id = ? AND member_id = ?
  `);
  const teeTime = await verifyStmt.bind(teeTimeId, member.id).first();

  if (!teeTime) {
    return new Response(JSON.stringify({ error: 'Tee time not found or unauthorized' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Cancel the tee time (soft delete)
  const stmt = env.DB.prepare(`
    UPDATE tee_times SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
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
