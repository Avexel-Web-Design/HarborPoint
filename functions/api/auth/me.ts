// functions/api/auth/me.ts
import { Env } from '../../types';
import { verifyAuth } from './utils';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  console.log('=== AUTH ME REQUEST ===');
  console.log('Request headers:', Object.fromEntries(context.request.headers.entries()));
  
  try {
    const member = await verifyAuth(context.request, context.env);
    
    if (!member) {
      console.log('Authentication failed - no member returned');
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Authentication successful for member:', member.id);
    return new Response(JSON.stringify({
      member: {
        id: member.id,
        email: member.email,
        firstName: member.first_name,
        lastName: member.last_name,
        membershipType: member.membership_type,
        memberId: member.member_id
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
