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
      m.member_id
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

  return new Response(JSON.stringify({ 
    teeTimes: result.results,
    total: result.results?.length || 0
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
  const { id, date, time, guests, notes } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Tee time ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE tee_times 
    SET date = ?, time = ?, guests = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  try {
    await stmt.bind(date, time, guests, notes, id).run();
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
