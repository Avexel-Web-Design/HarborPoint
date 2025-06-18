import { Env } from '../../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;

    const admin = await verifyAdminAuth(request, DB);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ admin }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin me error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function verifyAdminAuth(request: Request, DB: D1Database) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['admin_session'];
  
  if (!sessionToken) {
    return null;
  }

  // Find active admin session
  const sessionResult = await DB.prepare(`
    SELECT ase.*, au.* FROM admin_sessions ase
    JOIN admin_users au ON ase.admin_id = au.id
    WHERE ase.session_token = ? AND ase.expires_at > CURRENT_TIMESTAMP AND au.is_active = 1
  `).bind(sessionToken).first();

  if (!sessionResult) {
    return null;
  }

  return {
    id: sessionResult.id,
    username: sessionResult.username,
    fullName: sessionResult.full_name,
    role: sessionResult.role
  };
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
