import { Env } from '../../../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;

    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      return new Response(JSON.stringify({ error: 'No session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract session token from cookies
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies['admin_session'];
    
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'No session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete session from database
    await DB.prepare(
      'DELETE FROM admin_sessions WHERE session_token = ?'
    ).bind(sessionToken).run();

    // Clear session cookie
    const response = new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

    response.headers.set('Set-Cookie', `admin_session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`);

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

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
