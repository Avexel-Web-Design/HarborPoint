import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  memberId: string;
  phone?: string;
}

interface AuthContextType {
  member: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  membershipType: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
      } else {
        setMember(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setMember(null);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      const response = await fetch('/api/members/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMember(responseData.member);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Profile update failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/members/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        // Password changed successfully, user needs to log in again
        setMember(null);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Password change failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  const value: AuthContextType = {
    member,
    isLoading,
    isAuthenticated: !!member,
    login,
    logout,
    register,
    checkAuth,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
