import { Env, GuestPass, GuestPassRequest } from '../../types';
import { verifyAuth } from '../auth/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === 'GET') {
      return handleGetGuestPasses(request, env);
    } else if (method === 'POST') {
      return handleCreateGuestPass(request, env);
    } else if (method === 'DELETE') {
      return handleRevokeGuestPass(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Guest passes API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetGuestPasses(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    SELECT * FROM guest_passes 
    WHERE member_id = ? AND status = 'active' AND expires_at > CURRENT_TIMESTAMP
    ORDER BY visit_date ASC
  `);
  
  const result = await stmt.bind(member.id).all();

  return new Response(JSON.stringify({ guestPasses: result.results }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateGuestPass(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body: GuestPassRequest = await request.json();
  
  if (!body.guestName || !body.visitDate) {
    return new Response(JSON.stringify({ error: 'Guest name and visit date are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generate unique pass code
  const passCode = await generatePassCode();
  const expiresAt = new Date(new Date(body.visitDate).getTime() + 24 * 60 * 60 * 1000); // Expires 24 hours after visit date

  const stmt = env.DB.prepare(`
    INSERT INTO guest_passes (member_id, guest_name, guest_email, visit_date, pass_code, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    member.id,
    body.guestName,
    body.guestEmail || null,
    body.visitDate,
    passCode,
    expiresAt.toISOString()
  ).run();

  if (result.success) {
    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id,
      passCode,
      message: 'Guest pass created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to create guest pass' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleRevokeGuestPass(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const passId = url.searchParams.get('id');

  if (!passId) {
    return new Response(JSON.stringify({ error: 'Pass ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stmt = env.DB.prepare(`
    UPDATE guest_passes SET status = 'revoked' 
    WHERE id = ? AND member_id = ?
  `);
  
  const result = await stmt.bind(passId, member.id).run();

  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Guest pass revoked successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Guest pass not found or unauthorized' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function generatePassCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
