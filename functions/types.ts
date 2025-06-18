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

export interface MemberResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  memberId: string;
  phone?: string;
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
