import { Env } from '../../../types';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    const admin = await verifyAdminAuth(request, env.DB);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE') {
      return handlePermanentDeleteMember(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Admin members permanent delete API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handlePermanentDeleteMember(request: Request, env: Env) {
  const url = new URL(request.url);
  const memberId = url.searchParams.get('id');

  if (!memberId) {
    return new Response(JSON.stringify({ error: 'Member ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Start a transaction to delete all related data
    // Note: Cloudflare D1 doesn't support transactions yet, so we'll delete in order
    // with foreign key constraints handling most of the cleanup automatically
    
    // Delete the member (foreign key constraints will cascade delete related records)
    const stmt = env.DB.prepare(`
      DELETE FROM members WHERE id = ?
    `);

    const result = await stmt.bind(memberId).run();

    if (result.success && result.meta.changes > 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Member permanently deleted successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Permanent delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function verifyAdminAuth(request: Request, DB: D1Database) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['admin_session'];
  if (!sessionToken) return null;

  const sessionResult = await DB.prepare(`
    SELECT ase.*, au.* FROM admin_sessions ase
    JOIN admin_users au ON ase.admin_id = au.id
    WHERE ase.session_token = ? AND ase.expires_at > CURRENT_TIMESTAMP AND au.is_active = 1
  `).bind(sessionToken).first();

  return sessionResult ? {
    id: sessionResult.id,
    username: sessionResult.username,
    fullName: sessionResult.full_name,
    role: sessionResult.role
  } : null;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
