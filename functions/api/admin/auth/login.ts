import { Env, AdminLoginRequest } from '../../../types';
import { hashPassword, createSessionToken } from '../../auth/utils';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB, JWT_SECRET } = context.env;

    const body: AdminLoginRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find admin user
    const adminResult = await DB.prepare(
      'SELECT * FROM admin_users WHERE username = ? AND is_active = 1'
    ).bind(username).first();

    if (!adminResult) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For demo purposes, we'll use simple password checking
    // In production, use proper password hashing
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== adminResult.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create session token
    const sessionToken = await createSessionToken(adminResult.id, JWT_SECRET);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save session to database
    await DB.prepare(
      'INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES (?, ?, ?)'
    ).bind(adminResult.id, sessionToken, expiresAt.toISOString()).run();

    // Update last login
    await DB.prepare(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(adminResult.id).run();

    const adminResponse = {
      id: adminResult.id,
      username: adminResult.username,
      fullName: adminResult.full_name,
      role: adminResult.role
    };

    // Set session cookie
    const response = new Response(JSON.stringify({ admin: adminResponse }), {
      headers: { 'Content-Type': 'application/json' }
    });

    response.headers.set('Set-Cookie', `admin_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/`);

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
