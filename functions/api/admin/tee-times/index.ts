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
      tt.*,
      m.first_name,
      m.last_name,
      m.email,
      m.phone,
      m.member_id as member_id_display
    FROM tee_times tt
    JOIN members m ON tt.member_id = m.id
    WHERE tt.status = 'active'
  `;
  let params: any[] = [];

  if (startDate && endDate) {
    query += ` AND tt.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY tt.date ASC, tt.time ASC`;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  // Format the response with proper field mapping
  const formattedTeeTimes = result.results?.map((teeTime: any) => ({
    id: teeTime.id,
    member_id: teeTime.member_id,
    member_id_display: teeTime.member_id_display,
    date: teeTime.date,
    time: teeTime.time,
    course_name: teeTime.course_name,
    players: teeTime.players || 1,
    player_names: teeTime.player_names,
    notes: teeTime.notes,
    status: teeTime.status,
    first_name: teeTime.first_name,
    last_name: teeTime.last_name,
    email: teeTime.email,
    phone: teeTime.phone,
    created_at: teeTime.created_at,
    updated_at: teeTime.updated_at
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
  const teeTimeId = url.searchParams.get('id');

  if (!teeTimeId) {
    return new Response(JSON.stringify({ error: 'Tee time ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE tee_times 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  try {
    await stmt.bind(teeTimeId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error cancelling tee time:', error);
    return new Response(JSON.stringify({ error: 'Failed to cancel tee time' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateTeeTime(request: Request, env: Env) {
  const { id, memberIds, courseId, date, time, notes } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Tee time ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
    // If updating member assignments, get member names
    const memberQuery = env.DB.prepare(`
      SELECT first_name, last_name FROM members WHERE id IN (${memberIds.map(() => '?').join(',')})
    `);
    const memberResult = await memberQuery.bind(...memberIds).all();
    const memberNames = memberResult.results?.map((m: any) => `${m.first_name} ${m.last_name}`).join(', ') || '';
    
    const stmt = env.DB.prepare(`
      UPDATE tee_times 
      SET member_id = ?, course_name = ?, date = ?, time = ?, players = ?, player_names = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    try {
      await stmt.bind(memberIds[0], courseId || 'birches', date, time, memberIds.length, memberNames, notes, id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error updating tee time:', error);
      return new Response(JSON.stringify({ error: 'Failed to update tee time' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    // Legacy update without member changes
    const stmt = env.DB.prepare(`
      UPDATE tee_times 
      SET course_name = ?, date = ?, time = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    try {
      await stmt.bind(courseId || 'birches', date, time, notes, id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error updating tee time:', error);
      return new Response(JSON.stringify({ error: 'Failed to update tee time' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

async function handleCreateTeeTime(request: Request, env: Env) {
  const { memberIds, courseId, date, time, notes } = await request.json();

  if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return new Response(JSON.stringify({ error: 'At least one member ID is required' }), {
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

  // Check if the tee time slot is available
  const conflictCheck = env.DB.prepare(`
    SELECT id FROM tee_times 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
  `);
  const existing = await conflictCheck.bind(courseId, date, time).first();

  if (existing) {
    return new Response(JSON.stringify({ error: 'Tee time slot is already booked' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Create tee time for the first member (primary member)
  const primaryMemberId = memberIds[0];
  const players = memberIds.length;
  
  // Get member names for display
  const memberQuery = env.DB.prepare(`
    SELECT first_name, last_name FROM members WHERE id IN (${memberIds.map(() => '?').join(',')})
  `);
  const memberResult = await memberQuery.bind(...memberIds).all();
  const memberNames = memberResult.results?.map((m: any) => `${m.first_name} ${m.last_name}`).join(', ') || '';
  const stmt = env.DB.prepare(`
    INSERT INTO tee_times (member_id, course_name, date, time, players, player_names, notes, allow_additional_players, created_by_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)
  `);

  try {
    const result = await stmt.bind(
      primaryMemberId,
      courseId,
      date,
      time,
      players,
      memberNames,
      notes || null
    ).run();

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        id: result.meta.last_row_id,
        message: 'Tee time created successfully'
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
  } catch (error) {
    console.error('Error creating tee time:', error);
    return new Response(JSON.stringify({ error: 'Failed to create tee time' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
