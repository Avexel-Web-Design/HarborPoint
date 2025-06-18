// functions/api/auth/register.ts
import { Env, RegisterRequest, MemberResponse } from '../../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;

    // Parse request body
    const body: RegisterRequest = await request.json();
    const { email, password, firstName, lastName, phone, membershipType } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !membershipType) {
      return new Response(JSON.stringify({ 
        error: 'Email, password, first name, last name, and membership type are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if email already exists
    const existingMember = await DB.prepare(
      'SELECT id FROM members WHERE email = ?'
    ).bind(email).first();

    if (existingMember) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Generate member ID
    const memberId = await generateMemberId(DB);

    // Create member
    const result = await DB.prepare(
      `INSERT INTO members (email, password_hash, first_name, last_name, membership_type, member_id, phone, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
    ).bind(email, passwordHash, firstName, lastName, membershipType, memberId, phone || null).run();

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to create member' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create member preferences
    await DB.prepare(
      'INSERT INTO member_preferences (member_id) VALUES (?)'
    ).bind(result.meta.last_row_id).run();

    const memberResponse: MemberResponse = {
      id: result.meta.last_row_id,
      email,
      firstName,
      lastName,
      membershipType,
      memberId,
      phone
    };

    return new Response(JSON.stringify({
      success: true,
      member: memberResponse,
      message: 'Registration successful. Please log in.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function hashPassword(password: string): Promise<string> {
  // Simple password hashing for demo - in production, use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateMemberId(DB: D1Database): Promise<string> {
  // Generate a unique member ID
  let memberId: string;
  let attempts = 0;
  
  do {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    memberId = `BW${year}${randomNum}`;
    
    const existing = await DB.prepare(
      'SELECT id FROM members WHERE member_id = ?'
    ).bind(memberId).first();
    
    if (!existing) break;
    
    attempts++;
  } while (attempts < 10);

  return memberId;
}
