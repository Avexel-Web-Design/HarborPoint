// functions/api/auth/logout.ts
import { Env } from '../../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;

    // Get session token from cookie
    const cookieHeader = request.headers.get('Cookie');
    const sessionToken = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('session='))
      ?.split('=')[1];

    if (sessionToken) {
      // Delete session from database
      await DB.prepare(
        'DELETE FROM member_sessions WHERE session_token = ?'
      ).bind(sessionToken).run();
    }

    // Clear the session cookie
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });    response.headers.set('Set-Cookie', 
      'session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/'
    );

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
