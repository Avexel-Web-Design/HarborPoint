// functions/api/members/profile.ts
import { Env } from '../../types';
import { verifyAuth } from '../auth/utils';

export async function onRequestPut(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    
    // Verify authentication
    const member = await verifyAuth(request, env);
    if (!member) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const body = await request.json();
    const { firstName, lastName, phone } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return new Response(JSON.stringify({ error: 'First name and last name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update member profile
    const result = await env.DB.prepare(`
      UPDATE members 
      SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(firstName, lastName, phone || null, member.id).run();

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch updated member data
    const updatedMember = await env.DB.prepare(`
      SELECT id, email, first_name, last_name, membership_type, member_id, phone, is_active
      FROM members WHERE id = ?
    `).bind(member.id).first();

    if (!updatedMember) {
      return new Response(JSON.stringify({ error: 'Member not found after update' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return updated member data
    const memberResponse = {
      id: updatedMember.id,
      email: updatedMember.email,
      firstName: updatedMember.first_name,
      lastName: updatedMember.last_name,
      membershipType: updatedMember.membership_type,
      memberId: updatedMember.member_id,
      phone: updatedMember.phone
    };

    return new Response(JSON.stringify({ 
      message: 'Profile updated successfully',
      member: memberResponse 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
