// functions/api/auth/login.ts
import { Env, Member, LoginRequest, MemberResponse } from '../../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB, JWT_SECRET } = context.env;

    // Parse request body
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }    // Find member by email
    const memberResult = await DB.prepare(
      'SELECT * FROM members WHERE email = ? AND is_active = 1'
    ).bind(email).first() as Member | null;

    if (!memberResult) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password (you'll need to implement password hashing)
    const isValidPassword = await verifyPassword(password, memberResult.password_hash);
    
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create session token
    const sessionToken = await createSessionToken(memberResult.id, JWT_SECRET);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save session to database
    await DB.prepare(
      'INSERT INTO member_sessions (member_id, session_token, expires_at) VALUES (?, ?, ?)'
    ).bind(memberResult.id, sessionToken, expiresAt.toISOString()).run();

    // Update last login
    await DB.prepare(
      'UPDATE members SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(memberResult.id).run();

    // Return success response with token
    const response = new Response(JSON.stringify({
      success: true,
      member: {
        id: memberResult.id,
        email: memberResult.email,
        firstName: memberResult.first_name,
        lastName: memberResult.last_name,
        membershipType: memberResult.membership_type,
        memberId: memberResult.member_id
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });    // Set HTTP-only cookie with more permissive settings for development
    const cookieOptions = [
      `session=${sessionToken}`,
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${7 * 24 * 60 * 60}`,
      'Path=/'
      // Removed Domain and Secure flags for localhost development
    ].join('; ');
    
    console.log('Setting cookie:', cookieOptions); // Debug log
    response.headers.set('Set-Cookie', cookieOptions);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Simple password verification for demo - in production, use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === hash;
}

async function createSessionToken(memberId: number, secret: string): Promise<string> {
  const payload = {
    memberId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  // Simple JWT creation - in production, use a proper JWT library
  const header = { alg: 'HS256', typ: 'JWT' };
  // Use Base64URL encoding (no padding, URL-safe)
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, secret);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  // Use Base64URL encoding (no padding, URL-safe)
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
