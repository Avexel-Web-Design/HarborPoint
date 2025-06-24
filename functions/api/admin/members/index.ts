import { Env } from '../../../types';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    const admin = await verifyAdminAuth(request, env.DB);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      return handleGetMembers(request, env);
    } else if (method === 'POST') {
      return handleCreateMember(request, env);
    } else if (method === 'PUT') {
      return handleUpdateMember(request, env);
    } else if (method === 'DELETE') {
      return handleDeleteMember(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Admin members API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetMembers(request: Request, env: Env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '25');
  const search = url.searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, email, first_name, last_name, membership_type, member_id, phone, is_active, created_at, last_login
    FROM members
  `;
  let countQuery = `SELECT COUNT(*) as total FROM members`;
  let params: any[] = [];

  if (search) {
    const searchCondition = ` WHERE (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR member_id LIKE ?)`;
    query += searchCondition;
    countQuery += searchCondition;
    const searchParam = `%${search}%`;
    params = [searchParam, searchParam, searchParam, searchParam];
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [membersResult, countResult] = await Promise.all([
    env.DB.prepare(query).bind(...params).all(),
    env.DB.prepare(countQuery).bind(...(search ? [params[0], params[1], params[2], params[3]] : [])).first()
  ]);

  return new Response(JSON.stringify({
    members: membersResult.results,
    total: countResult?.total || 0,
    page,
    limit
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateMember(request: Request, env: Env) {
  const body = await request.json();
  const { email, password, firstName, lastName, membershipType, phone } = body;

  if (!email || !password || !firstName || !lastName || !membershipType) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generate member ID
  const memberId = generateMemberId();
  
  // Hash password
  const passwordHash = await hashPassword(password);

  const stmt = env.DB.prepare(`
    INSERT INTO members (email, password_hash, first_name, last_name, membership_type, member_id, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(email, passwordHash, firstName, lastName, membershipType, memberId, phone || null).run();

  if (result.success) {
    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id,
      memberId,
      message: 'Member created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to create member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleUpdateMember(request: Request, env: Env) {
  const body = await request.json();
  const { id, email, firstName, lastName, membershipType, phone, isActive, password } = body;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Member ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let stmt: any;
  let params: any[];

  if (password && password.trim() !== '') {
    // Update with new password
    const passwordHash = await hashPassword(password);
    stmt = env.DB.prepare(`
      UPDATE members 
      SET email = ?, first_name = ?, last_name = ?, membership_type = ?, phone = ?, is_active = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    params = [email, firstName, lastName, membershipType, phone, isActive ? 1 : 0, passwordHash, id];
  } else {
    // Update without changing password
    stmt = env.DB.prepare(`
      UPDATE members 
      SET email = ?, first_name = ?, last_name = ?, membership_type = ?, phone = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    params = [email, firstName, lastName, membershipType, phone, isActive ? 1 : 0, id];
  }

  const result = await stmt.bind(...params).run();

  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: password && password.trim() !== '' ? 'Member updated successfully with new password' : 'Member updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Member not found or update failed' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeleteMember(request: Request, env: Env) {
  const url = new URL(request.url);
  const memberId = url.searchParams.get('id');

  if (!memberId) {
    return new Response(JSON.stringify({ error: 'Member ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Soft delete by setting is_active to false
  const stmt = env.DB.prepare(`
    UPDATE members SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `);

  const result = await stmt.bind(memberId).run();

  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: 'Member deactivated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Member not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function verifyAdminAuth(request: Request, DB: D1Database) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['admin_session'];
  if (!sessionToken) return null;

  const sessionResult = await DB.prepare(`
    SELECT ase.*, au.* FROM admin_sessions ase
    JOIN admin_users au ON ase.admin_id = au.id
    WHERE ase.session_token = ? AND ase.expires_at > CURRENT_TIMESTAMP AND au.is_active = 1
  `).bind(sessionToken).first();

  return sessionResult ? {
    id: sessionResult.id,
    username: sessionResult.username,
    fullName: sessionResult.full_name,
    role: sessionResult.role
  } : null;
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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateMemberId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BC${timestamp}${random}`;
}
