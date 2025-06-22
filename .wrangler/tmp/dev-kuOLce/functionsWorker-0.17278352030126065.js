var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-JoutAu/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-g8FgVR/functionsWorker-0.17278352030126065.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
async function verifyAuth(request, env) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    console.log("Cookie header:", cookieHeader);
    if (!cookieHeader) {
      console.log("No cookie header found");
      return null;
    }
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies["session"];
    console.log("Session token from cookie:", sessionToken);
    if (!sessionToken) {
      console.log("No session token found in cookies");
      return null;
    }
    if (sessionToken.includes(".")) {
      console.log("Detected JWT token, verifying...");
      return await verifyJWT(sessionToken, env);
    } else {
      console.log("Detected hash token, checking database...");
      const sessionResult = await env.DB.prepare(`
        SELECT ms.*, m.* FROM member_sessions ms
        JOIN members m ON ms.member_id = m.id
        WHERE ms.session_token = ? AND ms.expires_at > CURRENT_TIMESTAMP AND m.is_active = 1
      `).bind(sessionToken).first();
      if (!sessionResult) {
        console.log("No active session found in database");
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
      };
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}
__name(verifyAuth, "verifyAuth");
__name2(verifyAuth, "verifyAuth");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword, "hashPassword");
__name2(hashPassword, "hashPassword");
async function createSessionToken(memberId, jwtSecret) {
  const tokenData = {
    memberId,
    timestamp: Date.now(),
    random: Math.random()
  };
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(tokenData) + jwtSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(createSessionToken, "createSessionToken");
__name2(createSessionToken, "createSessionToken");
function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
__name(parseCookies, "parseCookies");
__name2(parseCookies, "parseCookies");
async function verifyJWT(token, env) {
  try {
    console.log("Verifying JWT token:", token.substring(0, 50) + "...");
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !signature) {
      console.log("Invalid JWT format");
      return null;
    }
    console.log("JWT parts:");
    console.log("  Header:", encodedHeader);
    console.log("  Payload:", encodedPayload);
    console.log("  Signature received:", signature);
    const data = `${encodedHeader}.${encodedPayload}`;
    console.log("Data to sign:", data);
    const expectedSignature = await createJWTSignature(data, env.JWT_SECRET);
    console.log("Expected signature:", expectedSignature);
    if (signature !== expectedSignature) {
      console.log("JWT signature verification failed");
      console.log("Signature comparison:");
      console.log("  Received: ", signature);
      console.log("  Expected: ", expectedSignature);
      console.log("  Match: ", signature === expectedSignature);
      return null;
    }
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/")));
    console.log("JWT payload:", payload);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) {
      console.log("JWT token expired");
      return null;
    }
    const memberResult = await env.DB.prepare(
      "SELECT * FROM members WHERE id = ? AND is_active = 1"
    ).bind(payload.memberId).first();
    if (!memberResult) {
      console.log("Member not found or inactive");
      return null;
    }
    console.log("JWT verification successful for member:", memberResult.id);
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
    console.error("JWT verification error:", error);
    return null;
  }
}
__name(verifyJWT, "verifyJWT");
__name2(verifyJWT, "verifyJWT");
async function createJWTSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(createJWTSignature, "createJWTSignature");
__name2(createJWTSignature, "createJWTSignature");
var onRequestPost = /* @__PURE__ */ __name2(async (context) => {
  try {
    const request = context.request;
    const { DB, JWT_SECRET } = context.env;
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const adminResult = await DB.prepare(
      "SELECT * FROM admin_users WHERE username = ? AND is_active = 1"
    ).bind(username).first();
    if (!adminResult) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== adminResult.password_hash) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sessionToken = await createSessionToken(adminResult.id, JWT_SECRET);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    await DB.prepare(
      "INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES (?, ?, ?)"
    ).bind(adminResult.id, sessionToken, expiresAt.toISOString()).run();
    await DB.prepare(
      "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(adminResult.id).run();
    const adminResponse = {
      id: adminResult.id,
      username: adminResult.username,
      fullName: adminResult.full_name,
      role: adminResult.role
    };
    const cookieOptions = [
      `admin_session=${sessionToken}`,
      "HttpOnly",
      "SameSite=Lax",
      // Changed to Lax for better local development compatibility
      `Max-Age=${24 * 60 * 60}`,
      "Path=/"
    ].join("; ");
    const response = new Response(JSON.stringify({ admin: adminResponse }), {
      headers: { "Content-Type": "application/json" }
    });
    response.headers.set("Set-Cookie", cookieOptions);
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
var onRequestPost2 = /* @__PURE__ */ __name2(async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const cookies = parseCookies2(cookieHeader);
    const sessionToken = cookies["admin_session"];
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    await DB.prepare(
      "DELETE FROM admin_sessions WHERE session_token = ?"
    ).bind(sessionToken).run();
    const response = new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
    response.headers.set("Set-Cookie", `admin_session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`);
    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
function parseCookies2(cookieHeader) {
  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
__name(parseCookies2, "parseCookies2");
__name2(parseCookies2, "parseCookies");
var onRequestGet = /* @__PURE__ */ __name2(async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;
    const admin = await verifyAdminAuth(request, DB);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ admin }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin me error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");
async function verifyAdminAuth(request, DB) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }
  const cookies = parseCookies3(cookieHeader);
  const sessionToken = cookies["admin_session"];
  if (!sessionToken) {
    return null;
  }
  const sessionResult = await DB.prepare(`
    SELECT ase.*, au.* FROM admin_sessions ase
    JOIN admin_users au ON ase.admin_id = au.id
    WHERE ase.session_token = ? AND ase.expires_at > CURRENT_TIMESTAMP AND au.is_active = 1
  `).bind(sessionToken).first();
  if (!sessionResult) {
    return null;
  }
  return {
    id: sessionResult.id,
    username: sessionResult.username,
    fullName: sessionResult.full_name,
    role: sessionResult.role
  };
}
__name(verifyAdminAuth, "verifyAdminAuth");
__name2(verifyAdminAuth, "verifyAdminAuth");
function parseCookies3(cookieHeader) {
  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
__name(parseCookies3, "parseCookies3");
__name2(parseCookies3, "parseCookies");
var onRequestPost3 = /* @__PURE__ */ __name2(async (context) => {
  try {
    const request = context.request;
    const { DB, JWT_SECRET } = context.env;
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const memberResult = await DB.prepare(
      "SELECT * FROM members WHERE email = ? AND is_active = 1"
    ).bind(email).first();
    if (!memberResult) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const isValidPassword = await verifyPassword(password, memberResult.password_hash);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sessionToken = await createSessionToken2(memberResult.id, JWT_SECRET);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    await DB.prepare(
      "INSERT INTO member_sessions (member_id, session_token, expires_at) VALUES (?, ?, ?)"
    ).bind(memberResult.id, sessionToken, expiresAt.toISOString()).run();
    await DB.prepare(
      "UPDATE members SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(memberResult.id).run();
    const response = new Response(JSON.stringify({
      success: true,
      member: {
        id: memberResult.id,
        email: memberResult.email,
        firstName: memberResult.first_name,
        lastName: memberResult.last_name,
        membershipType: memberResult.membership_type,
        memberId: memberResult.member_id
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    const cookieOptions = [
      `session=${sessionToken}`,
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${7 * 24 * 60 * 60}`,
      "Path=/"
      // Removed Domain and Secure flags for localhost development
    ].join("; ");
    console.log("Setting cookie:", cookieOptions);
    response.headers.set("Set-Cookie", cookieOptions);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
async function verifyPassword(password, hash) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex === hash;
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
async function createSessionToken2(memberId, secret) {
  const payload = {
    memberId,
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
    // 7 days
  };
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, secret);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
__name(createSessionToken2, "createSessionToken2");
__name2(createSessionToken2, "createSessionToken");
async function createSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(createSignature, "createSignature");
__name2(createSignature, "createSignature");
var onRequestPost4 = /* @__PURE__ */ __name2(async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;
    const cookieHeader = request.headers.get("Cookie");
    const sessionToken = cookieHeader?.split(";").find((c) => c.trim().startsWith("session="))?.split("=")[1];
    if (sessionToken) {
      await DB.prepare(
        "DELETE FROM member_sessions WHERE session_token = ?"
      ).bind(sessionToken).run();
    }
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    response.headers.set(
      "Set-Cookie",
      "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/"
    );
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
var onRequestGet2 = /* @__PURE__ */ __name2(async (context) => {
  console.log("=== AUTH ME REQUEST ===");
  console.log("Request headers:", Object.fromEntries(context.request.headers.entries()));
  try {
    const member = await verifyAuth(context.request, context.env);
    if (!member) {
      console.log("Authentication failed - no member returned");
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Authentication successful for member:", member.id);
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");
var onRequestPost5 = /* @__PURE__ */ __name2(async (context) => {
  try {
    const request = context.request;
    const { DB } = context.env;
    const body = await request.json();
    const { email, password, firstName, lastName, phone, membershipType } = body;
    if (!email || !password || !firstName || !lastName || !membershipType) {
      return new Response(JSON.stringify({
        error: "Email, password, first name, last name, and membership type are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingMember = await DB.prepare(
      "SELECT id FROM members WHERE email = ?"
    ).bind(email).first();
    if (existingMember) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const passwordHash = await hashPassword2(password);
    const memberId = await generateMemberId(DB);
    const result = await DB.prepare(
      `INSERT INTO members (email, password_hash, first_name, last_name, membership_type, member_id, phone, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
    ).bind(email, passwordHash, firstName, lastName, membershipType, memberId, phone || null).run();
    if (!result.success) {
      return new Response(JSON.stringify({ error: "Failed to create member" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    await DB.prepare(
      "INSERT INTO member_preferences (member_id) VALUES (?)"
    ).bind(result.meta.last_row_id).run();
    const memberResponse = {
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
      message: "Registration successful. Please log in."
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
async function hashPassword2(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword2, "hashPassword2");
__name2(hashPassword2, "hashPassword");
async function generateMemberId(DB) {
  let memberId;
  let attempts = 0;
  do {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const randomNum = Math.floor(Math.random() * 1e4).toString().padStart(4, "0");
    memberId = `BW${year}${randomNum}`;
    const existing = await DB.prepare(
      "SELECT id FROM members WHERE member_id = ?"
    ).bind(memberId).first();
    if (!existing) break;
    attempts++;
  } while (attempts < 10);
  return memberId;
}
__name(generateMemberId, "generateMemberId");
__name2(generateMemberId, "generateMemberId");
async function verifyAdminAuth2(request, env) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
      return null;
    }
    const cookies = parseCookies4(cookieHeader);
    const sessionToken = cookies["admin_session"];
    if (!sessionToken) {
      return null;
    }
    const sessionResult = await env.DB.prepare(`
      SELECT as_table.*, au.* FROM admin_sessions as_table
      JOIN admin_users au ON as_table.admin_id = au.id
      WHERE as_table.session_token = ? AND as_table.expires_at > CURRENT_TIMESTAMP AND au.is_active = 1
    `).bind(sessionToken).first();
    if (!sessionResult) {
      return null;
    }
    return {
      id: sessionResult.id,
      username: sessionResult.username,
      fullName: sessionResult.full_name,
      email: sessionResult.email,
      is_active: sessionResult.is_active,
      created_at: sessionResult.created_at,
      last_login: sessionResult.last_login
    };
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return null;
  }
}
__name(verifyAdminAuth2, "verifyAdminAuth2");
__name2(verifyAdminAuth2, "verifyAdminAuth");
function parseCookies4(cookieHeader) {
  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
__name(parseCookies4, "parseCookies4");
__name2(parseCookies4, "parseCookies");
var onRequest = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    const admin = await verifyAdminAuth2(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (method === "GET") {
      return handleGetAllReservations(request, env);
    } else if (method === "POST") {
      return handleCreateReservation(request, env);
    } else if (method === "PUT") {
      return handleUpdateReservation(request, env);
    } else if (method === "DELETE") {
      return handleDeleteReservation(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Admin dining API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetAllReservations(request, env) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  let query = `
    SELECT 
      dr.*,
      m.first_name,
      m.last_name,
      m.email,
      m.phone,
      m.member_id
    FROM dining_reservations dr
    JOIN members m ON dr.member_id = m.id
    WHERE dr.status = 'confirmed'
  `;
  let params = [];
  if (startDate && endDate) {
    query += ` AND dr.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }
  query += ` ORDER BY dr.date ASC, dr.time ASC`;
  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();
  return new Response(JSON.stringify({
    reservations: result.results,
    total: result.results?.length || 0
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetAllReservations, "handleGetAllReservations");
__name2(handleGetAllReservations, "handleGetAllReservations");
async function handleCreateReservation(request, env) {
  const { memberIds, date, time, party_size, special_requests } = await request.json();
  if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return new Response(JSON.stringify({ error: "At least one member ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!date || !time || !party_size) {
    return new Response(JSON.stringify({ error: "Date, time, and party size are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const primaryMemberId = memberIds[0];
  const stmt = env.DB.prepare(`
    INSERT INTO dining_reservations (member_id, date, time, party_size, special_requests, status, created_by_admin)
    VALUES (?, ?, ?, ?, ?, 'confirmed', 1)
  `);
  try {
    const result = await stmt.bind(
      primaryMemberId,
      date,
      time,
      party_size,
      special_requests || null
    ).run();
    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        id: result.meta.last_row_id,
        message: "Dining reservation created successfully"
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Failed to create reservation" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error creating dining reservation:", error);
    return new Response(JSON.stringify({ error: "Failed to create reservation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateReservation, "handleCreateReservation");
__name2(handleCreateReservation, "handleCreateReservation");
async function handleUpdateReservation(request, env) {
  const { id, date, time, party_size, special_requests } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Reservation ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE dining_reservations 
    SET date = ?, time = ?, party_size = ?, special_requests = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  try {
    await stmt.bind(date, time, party_size, special_requests, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return new Response(JSON.stringify({ error: "Failed to update reservation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleUpdateReservation, "handleUpdateReservation");
__name2(handleUpdateReservation, "handleUpdateReservation");
async function handleDeleteReservation(request, env) {
  const url = new URL(request.url);
  const reservationId = url.searchParams.get("id");
  if (!reservationId) {
    return new Response(JSON.stringify({ error: "Reservation ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE dining_reservations 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  try {
    await stmt.bind(reservationId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return new Response(JSON.stringify({ error: "Failed to cancel reservation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleDeleteReservation, "handleDeleteReservation");
__name2(handleDeleteReservation, "handleDeleteReservation");
var onRequest2 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    const admin = await verifyAdminAuth2(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (method === "GET") {
      return handleGetAllEvents(request, env);
    } else if (method === "POST") {
      return handleCreateEvent(request, env);
    } else if (method === "PUT") {
      return handleUpdateEvent(request, env);
    } else if (method === "DELETE") {
      return handleDeleteEvent(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Admin events API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetAllEvents(request, env) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  let query = `
    SELECT 
      e.*,
      COUNT(er.id) as registered_count
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
    WHERE e.status = 'active'
  `;
  let params = [];
  if (startDate && endDate) {
    query += ` AND e.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }
  query += ` GROUP BY e.id ORDER BY e.date ASC, e.time ASC`;
  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();
  return new Response(JSON.stringify({
    events: result.results,
    total: result.results?.length || 0
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetAllEvents, "handleGetAllEvents");
__name2(handleGetAllEvents, "handleGetAllEvents");
async function handleCreateEvent(request, env) {
  const { title, description, date, time, location, max_capacity, price } = await request.json();
  if (!title || !date || !time || !location) {
    return new Response(JSON.stringify({ error: "Title, date, time, and location are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    INSERT INTO events (title, description, date, time, location, max_attendees, cost, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  try {
    const result = await stmt.bind(title, description, date, time, location, max_capacity || null, price || 0).run();
    return new Response(JSON.stringify({
      success: true,
      eventId: result.meta.last_row_id
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return new Response(JSON.stringify({ error: "Failed to create event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateEvent, "handleCreateEvent");
__name2(handleCreateEvent, "handleCreateEvent");
async function handleUpdateEvent(request, env) {
  const { id, title, description, date, time, location, max_capacity, price } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Event ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE events 
    SET title = ?, description = ?, date = ?, time = ?, location = ?, max_attendees = ?, cost = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  try {
    await stmt.bind(title, description, date, time, location, max_capacity || null, price || 0, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return new Response(JSON.stringify({ error: "Failed to update event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleUpdateEvent, "handleUpdateEvent");
__name2(handleUpdateEvent, "handleUpdateEvent");
async function handleDeleteEvent(request, env) {
  const url = new URL(request.url);
  const eventId = url.searchParams.get("id");
  if (!eventId) {
    return new Response(JSON.stringify({ error: "Event ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE events 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  try {
    await stmt.bind(eventId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error cancelling event:", error);
    return new Response(JSON.stringify({ error: "Failed to cancel event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleDeleteEvent, "handleDeleteEvent");
__name2(handleDeleteEvent, "handleDeleteEvent");
var onRequest3 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    const admin = await verifyAdminAuth3(request, env.DB);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (method === "GET") {
      return handleGetMembers(request, env);
    } else if (method === "POST") {
      return handleCreateMember(request, env);
    } else if (method === "PUT") {
      return handleUpdateMember(request, env);
    } else if (method === "DELETE") {
      return handleDeleteMember(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Admin members API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetMembers(request, env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "25");
  const search = url.searchParams.get("search") || "";
  const offset = (page - 1) * limit;
  let query = `
    SELECT id, email, first_name, last_name, membership_type, member_id, phone, is_active, created_at, last_login
    FROM members
  `;
  let countQuery = `SELECT COUNT(*) as total FROM members`;
  let params = [];
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
    env.DB.prepare(countQuery).bind(...search ? [params[0], params[1], params[2], params[3]] : []).first()
  ]);
  return new Response(JSON.stringify({
    members: membersResult.results,
    total: countResult?.total || 0,
    page,
    limit
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetMembers, "handleGetMembers");
__name2(handleGetMembers, "handleGetMembers");
async function handleCreateMember(request, env) {
  const body = await request.json();
  const { email, password, firstName, lastName, membershipType, phone } = body;
  if (!email || !password || !firstName || !lastName || !membershipType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const memberId = generateMemberId2();
  const passwordHash = await hashPassword3(password);
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
      message: "Member created successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Failed to create member" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateMember, "handleCreateMember");
__name2(handleCreateMember, "handleCreateMember");
async function handleUpdateMember(request, env) {
  const body = await request.json();
  const { id, email, firstName, lastName, membershipType, phone, isActive } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: "Member ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE members 
    SET email = ?, first_name = ?, last_name = ?, membership_type = ?, phone = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const result = await stmt.bind(email, firstName, lastName, membershipType, phone, isActive ? 1 : 0, id).run();
  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: "Member updated successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Member not found or update failed" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleUpdateMember, "handleUpdateMember");
__name2(handleUpdateMember, "handleUpdateMember");
async function handleDeleteMember(request, env) {
  const url = new URL(request.url);
  const memberId = url.searchParams.get("id");
  if (!memberId) {
    return new Response(JSON.stringify({ error: "Member ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE members SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `);
  const result = await stmt.bind(memberId).run();
  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: "Member deactivated successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Member not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleDeleteMember, "handleDeleteMember");
__name2(handleDeleteMember, "handleDeleteMember");
async function verifyAdminAuth3(request, DB) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = parseCookies5(cookieHeader);
  const sessionToken = cookies["admin_session"];
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
__name(verifyAdminAuth3, "verifyAdminAuth3");
__name2(verifyAdminAuth3, "verifyAdminAuth");
function parseCookies5(cookieHeader) {
  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
__name(parseCookies5, "parseCookies5");
__name2(parseCookies5, "parseCookies");
async function hashPassword3(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword3, "hashPassword3");
__name2(hashPassword3, "hashPassword");
function generateMemberId2() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
  return `BC${timestamp}${random}`;
}
__name(generateMemberId2, "generateMemberId2");
__name2(generateMemberId2, "generateMemberId");
var onRequest4 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    const admin = await verifyAdminAuth2(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (method === "GET") {
      return handleGetAllTeeTimes(request, env);
    } else if (method === "POST") {
      return handleCreateTeeTime(request, env);
    } else if (method === "DELETE") {
      return handleDeleteTeeTime(request, env);
    } else if (method === "PUT") {
      return handleUpdateTeeTime(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Admin tee times API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetAllTeeTimes(request, env) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  let query = `
    SELECT 
      tt.*,
      m.first_name,
      m.last_name,
      m.email,
      m.phone,
      m.member_id as member_id_display
    FROM tee_times tt
    JOIN members m ON tt.member_id = m.id
    WHERE tt.status = 'active'
  `;
  let params = [];
  if (startDate && endDate) {
    query += ` AND tt.date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }
  query += ` ORDER BY tt.date ASC, tt.time ASC`;
  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();
  const formattedTeeTimes = result.results?.map((teeTime) => ({
    id: teeTime.id,
    member_id: teeTime.member_id,
    member_id_display: teeTime.member_id_display,
    date: teeTime.date,
    time: teeTime.time,
    course_name: teeTime.course_name,
    players: teeTime.players || 1,
    player_names: teeTime.player_names,
    notes: teeTime.notes,
    status: teeTime.status,
    first_name: teeTime.first_name,
    last_name: teeTime.last_name,
    email: teeTime.email,
    phone: teeTime.phone,
    created_at: teeTime.created_at,
    updated_at: teeTime.updated_at
  })) || [];
  return new Response(JSON.stringify({
    teeTimes: formattedTeeTimes,
    total: formattedTeeTimes.length
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetAllTeeTimes, "handleGetAllTeeTimes");
__name2(handleGetAllTeeTimes, "handleGetAllTeeTimes");
async function handleDeleteTeeTime(request, env) {
  const url = new URL(request.url);
  const teeTimeId = url.searchParams.get("id");
  if (!teeTimeId) {
    return new Response(JSON.stringify({ error: "Tee time ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE tee_times 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  try {
    await stmt.bind(teeTimeId).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error cancelling tee time:", error);
    return new Response(JSON.stringify({ error: "Failed to cancel tee time" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleDeleteTeeTime, "handleDeleteTeeTime");
__name2(handleDeleteTeeTime, "handleDeleteTeeTime");
async function handleUpdateTeeTime(request, env) {
  const { id, memberIds, courseId, date, time, notes } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Tee time ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
    const memberQuery = env.DB.prepare(`
      SELECT first_name, last_name FROM members WHERE id IN (${memberIds.map(() => "?").join(",")})
    `);
    const memberResult = await memberQuery.bind(...memberIds).all();
    const memberNames = memberResult.results?.map((m) => `${m.first_name} ${m.last_name}`).join(", ") || "";
    const stmt = env.DB.prepare(`
      UPDATE tee_times 
      SET member_id = ?, course_name = ?, date = ?, time = ?, players = ?, player_names = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    try {
      await stmt.bind(memberIds[0], courseId || "birches", date, time, memberIds.length, memberNames, notes, id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error updating tee time:", error);
      return new Response(JSON.stringify({ error: "Failed to update tee time" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } else {
    const stmt = env.DB.prepare(`
      UPDATE tee_times 
      SET course_name = ?, date = ?, time = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    try {
      await stmt.bind(courseId || "birches", date, time, notes, id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error updating tee time:", error);
      return new Response(JSON.stringify({ error: "Failed to update tee time" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
}
__name(handleUpdateTeeTime, "handleUpdateTeeTime");
__name2(handleUpdateTeeTime, "handleUpdateTeeTime");
async function handleCreateTeeTime(request, env) {
  const { memberIds, courseId, date, time, notes } = await request.json();
  if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return new Response(JSON.stringify({ error: "At least one member ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!courseId || !date || !time) {
    return new Response(JSON.stringify({ error: "Course, date, and time are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const conflictCheck = env.DB.prepare(`
    SELECT id FROM tee_times 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
  `);
  const existing = await conflictCheck.bind(courseId, date, time).first();
  if (existing) {
    return new Response(JSON.stringify({ error: "Tee time slot is already booked" }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
  }
  const primaryMemberId = memberIds[0];
  const players = memberIds.length;
  const memberQuery = env.DB.prepare(`
    SELECT first_name, last_name FROM members WHERE id IN (${memberIds.map(() => "?").join(",")})
  `);
  const memberResult = await memberQuery.bind(...memberIds).all();
  const memberNames = memberResult.results?.map((m) => `${m.first_name} ${m.last_name}`).join(", ") || "";
  const stmt = env.DB.prepare(`
    INSERT INTO tee_times (member_id, course_name, date, time, players, player_names, notes, allow_additional_players, created_by_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)
  `);
  try {
    const result = await stmt.bind(
      primaryMemberId,
      courseId,
      date,
      time,
      players,
      memberNames,
      notes || null
    ).run();
    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        id: result.meta.last_row_id,
        message: "Tee time created successfully"
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Failed to create tee time" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error creating tee time:", error);
    return new Response(JSON.stringify({ error: "Failed to create tee time" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateTeeTime, "handleCreateTeeTime");
__name2(handleCreateTeeTime, "handleCreateTeeTime");
var onRequest5 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const url = new URL(request.url);
    const course = url.searchParams.get("course") || url.searchParams.get("courseId");
    const date = url.searchParams.get("date");
    if (!course || !date) {
      return new Response(JSON.stringify({ error: "Course and date parameters required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stmt = env.DB.prepare(`
      SELECT 
        tt.time, 
        tt.players, 
        tt.player_names,
        tt.allow_additional_players,
        m.first_name,
        m.last_name,
        m.member_id as member_display_id
      FROM tee_times tt
      JOIN members m ON tt.member_id = m.id
      WHERE tt.course_name = ? AND tt.date = ? AND tt.status = 'active'
      ORDER BY tt.time ASC
    `);
    const result = await stmt.bind(course, date).all();
    const bookedTeeTimes = result.results || [];
    const bookedTimes = bookedTeeTimes.map((row) => row.time);
    const allTimes = [];
    const startHour = 7;
    const endHour = 18;
    const maxPlayers = 4;
    const basePrice = 85;
    const courseNames = {
      "birches": "The Birches",
      "woods": "The Woods",
      "farms": "The Farms"
    };
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const bookedTeeTime = bookedTeeTimes.find((bt) => bt.time === timeStr);
        if (bookedTeeTime) {
          const currentPlayers = bookedTeeTime.players || 1;
          const remainingSpots = maxPlayers - currentPlayers;
          const allowsAdditional = bookedTeeTime.allow_additional_players;
          let status = "booked";
          if (remainingSpots > 0 && allowsAdditional) {
            status = "partial";
          }
          allTimes.push({
            id: `${course}-${date}-${timeStr}`,
            courseId: course,
            courseName: courseNames[course] || course,
            date,
            time: timeStr,
            players: currentPlayers,
            maxPlayers,
            price: basePrice,
            status,
            availableSpots: allowsAdditional ? remainingSpots : 0,
            bookedBy: {
              firstName: bookedTeeTime.first_name,
              lastName: bookedTeeTime.last_name,
              memberId: bookedTeeTime.member_display_id,
              playerNames: bookedTeeTime.player_names
            }
          });
        } else {
          allTimes.push({
            id: `${course}-${date}-${timeStr}`,
            courseId: course,
            courseName: courseNames[course] || course,
            date,
            time: timeStr,
            players: 0,
            maxPlayers,
            price: basePrice,
            status: "available"
          });
        }
      }
    }
    return new Response(JSON.stringify(allTimes), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Available times API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
var onRequest6 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    if (method === "GET") {
      return handleGetReservations(request, env);
    } else if (method === "POST") {
      return handleCreateReservation2(request, env);
    } else if (method === "DELETE") {
      return handleDeleteReservation2(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Dining reservations API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetReservations(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    SELECT * FROM dining_reservations 
    WHERE member_id = ? AND status = 'confirmed'
    ORDER BY date ASC, time ASC
  `);
  const result = await stmt.bind(member.id).all();
  return new Response(JSON.stringify({ reservations: result.results }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetReservations, "handleGetReservations");
__name2(handleGetReservations, "handleGetReservations");
async function handleCreateReservation2(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const body = await request.json();
  if (!body.date || !body.time || !body.partySize) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const conflictCheck = env.DB.prepare(`
    SELECT COUNT(*) as count FROM dining_reservations 
    WHERE date = ? AND time = ? AND status = 'confirmed'
  `);
  const existingCount = await conflictCheck.bind(body.date, body.time).first();
  if (existingCount && existingCount.count >= 5) {
    return new Response(JSON.stringify({ error: "No availability at this time" }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    INSERT INTO dining_reservations (member_id, date, time, party_size, special_requests)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = await stmt.bind(
    member.id,
    body.date,
    body.time,
    body.partySize,
    body.specialRequests || null
  ).run();
  if (result.success) {
    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id,
      message: "Dining reservation created successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Failed to create reservation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateReservation2, "handleCreateReservation2");
__name2(handleCreateReservation2, "handleCreateReservation");
async function handleDeleteReservation2(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const reservationId = url.searchParams.get("id");
  if (!reservationId) {
    return new Response(JSON.stringify({ error: "Reservation ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE dining_reservations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ? AND member_id = ?
  `);
  const result = await stmt.bind(reservationId, member.id).run();
  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: "Reservation cancelled successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Reservation not found or unauthorized" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleDeleteReservation2, "handleDeleteReservation2");
__name2(handleDeleteReservation2, "handleDeleteReservation");
var onRequest7 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    if (method === "GET") {
      return handleGetEvents(request, env);
    } else if (method === "POST") {
      return handleRegisterForEvent(request, env);
    } else if (method === "DELETE") {
      return handleUnregisterFromEvent(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Events API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetEvents(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    SELECT 
      e.*,
      CASE WHEN er.member_id IS NOT NULL THEN 1 ELSE 0 END as is_registered,
      COUNT(er2.id) as registered_count
    FROM events e
    LEFT JOIN event_registrations er ON e.id = er.event_id AND er.member_id = ? AND er.status = 'registered'
    LEFT JOIN event_registrations er2 ON e.id = er2.event_id AND er2.status = 'registered'
    WHERE e.status = 'active' AND e.date >= DATE('now')
    GROUP BY e.id
    ORDER BY e.date ASC, e.time ASC
  `);
  const result = await stmt.bind(member.id).all();
  return new Response(JSON.stringify({ events: result.results }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetEvents, "handleGetEvents");
__name2(handleGetEvents, "handleGetEvents");
async function handleRegisterForEvent(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const body = await request.json();
  const eventId = body.eventId;
  if (!eventId) {
    return new Response(JSON.stringify({ error: "Event ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const eventStmt = env.DB.prepare(`
    SELECT * FROM events WHERE id = ? AND status = 'active' AND date >= DATE('now')
  `);
  const event = await eventStmt.bind(eventId).first();
  if (!event) {
    return new Response(JSON.stringify({ error: "Event not found or not available" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  const existingStmt = env.DB.prepare(`
    SELECT id FROM event_registrations 
    WHERE event_id = ? AND member_id = ? AND status = 'registered'
  `);
  const existing = await existingStmt.bind(eventId, member.id).first();
  if (existing) {
    return new Response(JSON.stringify({ error: "Already registered for this event" }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (event.max_attendees) {
    const countStmt = env.DB.prepare(`
      SELECT COUNT(*) as count FROM event_registrations 
      WHERE event_id = ? AND status = 'registered'
    `);
    const countResult = await countStmt.bind(eventId).first();
    if (countResult && countResult.count >= event.max_attendees) {
      return new Response(JSON.stringify({ error: "Event is full" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  const stmt = env.DB.prepare(`
    INSERT INTO event_registrations (event_id, member_id)
    VALUES (?, ?)
  `);
  const result = await stmt.bind(eventId, member.id).run();
  if (result.success) {
    return new Response(JSON.stringify({
      success: true,
      message: "Successfully registered for event"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Failed to register for event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleRegisterForEvent, "handleRegisterForEvent");
__name2(handleRegisterForEvent, "handleRegisterForEvent");
async function handleUnregisterFromEvent(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId");
  if (!eventId) {
    return new Response(JSON.stringify({ error: "Event ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE event_registrations SET status = 'cancelled' 
    WHERE event_id = ? AND member_id = ? AND status = 'registered'
  `);
  const result = await stmt.bind(eventId, member.id).run();
  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: "Successfully unregistered from event"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Registration not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleUnregisterFromEvent, "handleUnregisterFromEvent");
__name2(handleUnregisterFromEvent, "handleUnregisterFromEvent");
var onRequest8 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const method = request.method;
  try {
    if (method === "GET") {
      return handleGetGuestPasses(request, env);
    } else if (method === "POST") {
      return handleCreateGuestPass(request, env);
    } else if (method === "DELETE") {
      return handleRevokeGuestPass(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Guest passes API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetGuestPasses(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    SELECT * FROM guest_passes 
    WHERE member_id = ? AND status = 'active' AND expires_at > CURRENT_TIMESTAMP
    ORDER BY visit_date ASC
  `);
  const result = await stmt.bind(member.id).all();
  return new Response(JSON.stringify({ guestPasses: result.results }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetGuestPasses, "handleGetGuestPasses");
__name2(handleGetGuestPasses, "handleGetGuestPasses");
async function handleCreateGuestPass(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const body = await request.json();
  if (!body.guestName || !body.visitDate) {
    return new Response(JSON.stringify({ error: "Guest name and visit date are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const passCode = await generatePassCode();
  const expiresAt = new Date(new Date(body.visitDate).getTime() + 24 * 60 * 60 * 1e3);
  const stmt = env.DB.prepare(`
    INSERT INTO guest_passes (member_id, guest_name, guest_email, visit_date, pass_code, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = await stmt.bind(
    member.id,
    body.guestName,
    body.guestEmail || null,
    body.visitDate,
    passCode,
    expiresAt.toISOString()
  ).run();
  if (result.success) {
    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id,
      passCode,
      message: "Guest pass created successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Failed to create guest pass" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateGuestPass, "handleCreateGuestPass");
__name2(handleCreateGuestPass, "handleCreateGuestPass");
async function handleRevokeGuestPass(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const passId = url.searchParams.get("id");
  if (!passId) {
    return new Response(JSON.stringify({ error: "Pass ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE guest_passes SET status = 'revoked' 
    WHERE id = ? AND member_id = ?
  `);
  const result = await stmt.bind(passId, member.id).run();
  if (result.success && result.meta.changes > 0) {
    return new Response(JSON.stringify({
      success: true,
      message: "Guest pass revoked successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Guest pass not found or unauthorized" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleRevokeGuestPass, "handleRevokeGuestPass");
__name2(handleRevokeGuestPass, "handleRevokeGuestPass");
async function generatePassCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
__name(generatePassCode, "generatePassCode");
__name2(generatePassCode, "generatePassCode");
var onRequest9 = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  try {
    if (method === "GET") {
      return handleGetTeeTimes(request, env);
    } else if (method === "POST") {
      return handleCreateTeeTime2(request, env);
    } else if (method === "DELETE") {
      return handleDeleteTeeTime2(request, env);
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Tee times API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
async function handleGetTeeTimes(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  let query = `
    SELECT * FROM tee_times 
    WHERE member_id = ? AND status = 'active'
  `;
  let params = [member.id];
  if (startDate && endDate) {
    query += ` AND date BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }
  query += ` ORDER BY date ASC, time ASC`;
  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(...params).all();
  const courseNames = {
    "birches": "The Birches",
    "woods": "The Woods",
    "farms": "The Farms"
  };
  const formattedTeeTimes = result.results?.map((teeTime) => ({
    ...teeTime,
    courseName: courseNames[teeTime.course_name] || teeTime.course_name
  })) || [];
  return new Response(JSON.stringify({ teeTimes: formattedTeeTimes }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetTeeTimes, "handleGetTeeTimes");
__name2(handleGetTeeTimes, "handleGetTeeTimes");
async function handleCreateTeeTime2(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const body = await request.json();
  if (!body.courseId || !body.date || !body.time || !body.players) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const existingCheck = env.DB.prepare(`
    SELECT id, players, allow_additional_players FROM tee_times 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
  `);
  const existing = await existingCheck.bind(body.courseId, body.date, body.time).first();
  if (existing) {
    const currentPlayers = existing.players || 1;
    const maxPlayers = 4;
    if (existing.allow_additional_players && currentPlayers + body.players <= maxPlayers) {
      const updateStmt = env.DB.prepare(`
        UPDATE tee_times 
        SET players = players + ?, 
            player_names = CASE 
              WHEN player_names IS NULL THEN ? 
              ELSE player_names || ', ' || ? 
            END,
            allow_additional_players = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      const memberName2 = `${member.first_name} ${member.last_name}`;
      const result2 = await updateStmt.bind(
        body.players,
        memberName2,
        memberName2,
        body.allowOthersToJoin ? 1 : 0,
        existing.id
      ).run();
      if (result2.success) {
        return new Response(JSON.stringify({
          success: true,
          id: existing.id,
          message: "Successfully joined the tee time"
        }), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Tee time slot is full or not accepting additional players" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  const memberName = `${member.first_name} ${member.last_name}`;
  const playersToBook = body.players;
  const stmt = env.DB.prepare(`
    INSERT INTO tee_times (member_id, course_name, date, time, players, player_names, notes, allow_additional_players)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = await stmt.bind(
    member.id,
    body.courseId,
    body.date,
    body.time,
    playersToBook,
    memberName,
    body.notes || null,
    body.allowOthersToJoin ? 1 : 0
  ).run();
  if (result.success) {
    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id,
      message: "Tee time booked successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Failed to create tee time" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreateTeeTime2, "handleCreateTeeTime2");
__name2(handleCreateTeeTime2, "handleCreateTeeTime");
async function handleDeleteTeeTime2(request, env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const teeTimeId = url.searchParams.get("id");
  if (!teeTimeId) {
    return new Response(JSON.stringify({ error: "Tee time ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const verifyStmt = env.DB.prepare(`
    SELECT id FROM tee_times WHERE id = ? AND member_id = ?
  `);
  const teeTime = await verifyStmt.bind(teeTimeId, member.id).first();
  if (!teeTime) {
    return new Response(JSON.stringify({ error: "Tee time not found or unauthorized" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  const stmt = env.DB.prepare(`
    UPDATE tee_times SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  const result = await stmt.bind(teeTimeId).run();
  if (result.success) {
    return new Response(JSON.stringify({
      success: true,
      message: "Tee time cancelled successfully"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return new Response(JSON.stringify({ error: "Failed to cancel tee time" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleDeleteTeeTime2, "handleDeleteTeeTime2");
__name2(handleDeleteTeeTime2, "handleDeleteTeeTime");
var routes = [
  {
    routePath: "/api/admin/auth/login",
    mountPath: "/api/admin/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/auth/logout",
    mountPath: "/api/admin/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/auth/me",
    mountPath: "/api/admin/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/auth/login",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/auth/logout",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/auth/me",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/auth/register",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/admin/dining",
    mountPath: "/api/admin/dining",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/admin/events",
    mountPath: "/api/admin/events",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/admin/members",
    mountPath: "/api/admin/members",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/admin/tee-times",
    mountPath: "/api/admin/tee-times",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/tee-times/available",
    mountPath: "/api/tee-times",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/dining",
    mountPath: "/api/dining",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/events",
    mountPath: "/api/events",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/guest-passes",
    mountPath: "/api/guest-passes",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/tee-times",
    mountPath: "/api/tee-times",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-JoutAu/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-JoutAu/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.17278352030126065.js.map
