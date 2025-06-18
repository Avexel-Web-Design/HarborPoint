// functions/api/auth/me.ts
import { Env, Member, MemberResponse } from '../../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;

    // Get session token from cookie
    const cookieHeader = request.headers.get('Cookie');
    const sessionToken = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('session='))
      ?.split('=')[1];

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if session is valid
    const sessionResult = await DB.prepare(
      'SELECT member_id FROM member_sessions WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP'
    ).bind(sessionToken).first() as { member_id: number } | null;

    if (!sessionResult) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get member details
    const memberResult = await DB.prepare(
      'SELECT * FROM members WHERE id = ? AND is_active = 1'
    ).bind(sessionResult.member_id).first() as Member | null;

    if (!memberResult) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const memberResponse: MemberResponse = {
      id: memberResult.id,
      email: memberResult.email,
      firstName: memberResult.first_name,
      lastName: memberResult.last_name,
      membershipType: memberResult.membership_type,
      memberId: memberResult.member_id,
      phone: memberResult.phone
    };

    return new Response(JSON.stringify({ member: memberResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get member error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
