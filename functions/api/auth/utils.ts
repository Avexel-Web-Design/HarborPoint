// functions/api/auth/utils.ts
import { Env, Member } from '../../types';

export async function verifyAuth(request: Request, env: Env): Promise<Member | null> {
  try {
    const cookieHeader = request.headers.get('Cookie');
    console.log('Auth verification - Cookie header:', cookieHeader ? 'present' : 'missing');
    console.log('Auth verification - Environment:', env.ENVIRONMENT || 'unknown');
    console.log('Auth verification - Has DB:', !!env.DB);
    console.log('Auth verification - Has JWT_SECRET:', !!env.JWT_SECRET);
    
    if (!cookieHeader) {
      console.log('No cookie header found');
      return null;
    }

    // Extract session token from cookies
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies['session'];
    console.log('Session token from cookie:', sessionToken ? 'present' : 'missing');
    
    if (!sessionToken) {
      console.log('No session token found in cookies');
      return null;
    }

    // Check if it's a JWT token (contains dots)
    if (sessionToken.includes('.')) {
      console.log('Detected JWT token, verifying...');
      return await verifyJWT(sessionToken, env);
    } else {
      console.log('Detected hash token, checking database...');
      // Find active session in database
      const sessionResult = await env.DB.prepare(`
        SELECT ms.*, m.* FROM member_sessions ms
        JOIN members m ON ms.member_id = m.id
        WHERE ms.session_token = ? AND ms.expires_at > CURRENT_TIMESTAMP AND m.is_active = 1
      `).bind(sessionToken).first();

      console.log('Database session lookup result:', sessionResult ? 'found' : 'not found');

      if (!sessionResult) {
        console.log('No active session found in database');
        return null;
      }

      return {
        id: sessionResult.id,
        email: sessionResult.email,
        password_hash: sessionResult.password_hash,
        first_name: sessionResult.first_name,
        last_name: sessionResult.last_name,
        membership_type: sessionResult.membership_type,
        member_id: sessionResult.member_id,
        is_active: sessionResult.is_active,
        phone: sessionResult.phone,
        created_at: sessionResult.created_at,
        updated_at: sessionResult.updated_at,
        last_login: sessionResult.last_login
      };    }
  } catch (error) {
    console.error('Auth verification error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      environment: env.ENVIRONMENT || 'unknown',
      hasDB: !!env.DB,
      hasJWTSecret: !!env.JWT_SECRET
    });
    return null;
  }
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  // For now, we'll use a simple comparison. In production, use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === hash;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSessionToken(memberId: number, jwtSecret: string): Promise<string> {
  // Simple token generation - in production use proper JWT
  const tokenData = {
    memberId,
    timestamp: Date.now(),
    random: Math.random()
  };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(tokenData) + jwtSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

async function verifyJWT(token: string, env: Env): Promise<Member | null> {
  try {
    console.log('Verifying JWT token:', token.substring(0, 50) + '...');
    
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature) {
      console.log('Invalid JWT format');
      return null;
    }

    console.log('JWT parts:');
    console.log('  Header:', encodedHeader);
    console.log('  Payload:', encodedPayload);
    console.log('  Signature received:', signature);

    // Verify signature
    const data = `${encodedHeader}.${encodedPayload}`;
    console.log('Data to sign:', data);
    const expectedSignature = await createJWTSignature(data, env.JWT_SECRET);
    console.log('Expected signature:', expectedSignature);
    
    if (signature !== expectedSignature) {
      console.log('JWT signature verification failed');
      console.log('Signature comparison:');
      console.log('  Received: ', signature);
      console.log('  Expected: ', expectedSignature);
      console.log('  Match: ', signature === expectedSignature);
      return null;
    }    // Decode payload (convert Base64URL to Base64 first)
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    console.log('JWT payload:', payload);
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('JWT token expired');
      return null;
    }

    // Get member from database
    const memberResult = await env.DB.prepare(
      'SELECT * FROM members WHERE id = ? AND is_active = 1'
    ).bind(payload.memberId).first();

    if (!memberResult) {
      console.log('Member not found or inactive');
      return null;
    }

    console.log('JWT verification successful for member:', memberResult.id);
    return {
      id: memberResult.id,
      email: memberResult.email,
      password_hash: memberResult.password_hash,
      first_name: memberResult.first_name,
      last_name: memberResult.last_name,
      membership_type: memberResult.membership_type,
      member_id: memberResult.member_id,
      is_active: memberResult.is_active,
      phone: memberResult.phone,
      created_at: memberResult.created_at,
      updated_at: memberResult.updated_at,
      last_login: memberResult.last_login
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

async function createJWTSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  // Convert to Base64URL (no padding, URL-safe characters)
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
