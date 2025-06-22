import { Env } from '../../../types';

interface Admin {
  id: number;
  username: string;
  fullName: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export async function verifyAdminAuth(request: Request, env: Env): Promise<Admin | null> {
  try {
    const cookieHeader = request.headers.get('Cookie');
    
    if (!cookieHeader) {
      return null;
    }

    // Extract session token from cookies
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies['admin_session'];
    
    if (!sessionToken) {
      return null;
    }

    // Find active admin session in database
    const sessionResult = await env.DB.prepare(`
      SELECT as_table.*, au.* FROM admin_sessions as_table
      JOIN admin_users au ON as_table.admin_id = au.id
      WHERE as_table.session_token = ? AND as_table.expires_at > CURRENT_TIMESTAMP AND au.is_active = 1
    `).bind(sessionToken).first();

    if (!sessionResult) {
      return null;
    }

    return {
      id: sessionResult.id,
      username: sessionResult.username,
      fullName: sessionResult.full_name,
      email: sessionResult.email,
      is_active: sessionResult.is_active,
      created_at: sessionResult.created_at,
      last_login: sessionResult.last_login
    };
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return null;
  }
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
