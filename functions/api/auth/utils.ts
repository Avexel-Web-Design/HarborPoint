// functions/api/auth/utils.ts
import { Env, Member } from '../../types';

export async function verifyAuth(request: Request, env: Env): Promise<Member | null> {
  try {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      return null;
    }

    // Extract session token from cookies
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies['session'];
    
    if (!sessionToken) {
      return null;
    }

    // Find active session
    const sessionResult = await env.DB.prepare(`
      SELECT ms.*, m.* FROM member_sessions ms
      JOIN members m ON ms.member_id = m.id
      WHERE ms.session_token = ? AND ms.expires_at > CURRENT_TIMESTAMP AND m.is_active = 1
    `).bind(sessionToken).first();

    if (!sessionResult) {
      return null;
    }

    return {
      id: sessionResult.id,
      email: sessionResult.email,
      password_hash: sessionResult.password_hash,
      first_name: sessionResult.first_name,
      last_name: sessionResult.last_name,
      membership_type: sessionResult.membership_type,
      member_id: sessionResult.member_id,
      is_active: sessionResult.is_active,
      phone: sessionResult.phone,
      created_at: sessionResult.created_at,
      updated_at: sessionResult.updated_at,
      last_login: sessionResult.last_login
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  // For now, we'll use a simple comparison. In production, use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === hash;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSessionToken(memberId: number, jwtSecret: string): Promise<string> {
  // Simple token generation - in production use proper JWT
  const tokenData = {
    memberId,
    timestamp: Date.now(),
    random: Math.random()
  };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(tokenData) + jwtSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
