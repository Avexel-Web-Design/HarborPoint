// functions/types.ts
export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export interface Member {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  membership_type: string;
  member_id: string;
  is_active: boolean;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface MemberSession {
  id: number;
  member_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  membershipType: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MemberResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  memberId: string;
  phone?: string;
}

export interface TeeTime {
  id: number;
  member_id: number;
  course_name: string;
  date: string;
  time: string;
  players: number;
  player_names?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TeeTimeRequest {
  courseId: string;
  date: string;
  time: string;
  players: number;
  playerNames?: string;
  notes?: string;
}

export interface DiningReservation {
  id: number;
  member_id: number;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DiningReservationRequest {
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}

export interface GuestPass {
  id: number;
  member_id: number;
  guest_name: string;
  guest_email?: string;
  visit_date: string;
  pass_code: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export interface GuestPassRequest {
  guestName: string;
  guestEmail?: string;
  visitDate: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  max_attendees?: number;
  cost: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  member_id: number;
  registered_at: string;
  status: string;
}

export interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = any>(): Promise<T | null>;
    run(): Promise<D1Result>;
    all<T = any>(): Promise<D1Result<T>>;
  }

  interface D1Result<T = any> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: {
      changed_db: boolean;
      changes: number;
      duration: number;
      last_row_id: number;
      rows_read: number;
      rows_written: number;
    };
  }

  type PagesFunction<Env = any> = (context: {
    request: Request;
    env: Env;
    params: Record<string, string>;
    waitUntil: (promise: Promise<any>) => void;
  }) => Response | Promise<Response>;
}
