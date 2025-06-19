// functions/api/members/change-password.ts
import { Env } from '../../types';
import { verifyAuth, verifyPassword, hashPassword } from '../auth/utils';

export async function onRequestPost(context: { request: Request; env: Env }) {
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
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Current password and new password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ error: 'New password must be at least 8 characters long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, member.password_hash);
    if (!isCurrentPasswordValid) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    const result = await env.DB.prepare(`
      UPDATE members 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(newPasswordHash, member.id).run();

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to update password' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Invalidate all existing sessions for security
    await env.DB.prepare(`
      DELETE FROM member_sessions WHERE member_id = ?
    `).bind(member.id).run();

    return new Response(JSON.stringify({ 
      message: 'Password changed successfully. Please log in again.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Password change error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
