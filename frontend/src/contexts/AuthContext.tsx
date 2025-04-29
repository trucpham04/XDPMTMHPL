<<<<<<< Updated upstream
// AuthContext.tsx
import { createContext, useContext } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import type { ReactNode } from "react";

const AuthContext = createContext<ReturnType<typeof useAuthHook> | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
=======
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { login, logout, getCurrentUser } from '../services/auth';

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loginUser: (identifier: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái người dùng khi tải ứng dụng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          roles: userData.roles || ['user'],
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loginUser = async (identifier: string, password: string) => {
    try {
      const response = await login(identifier, password);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles,
      });
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
>>>>>>> Stashed changes
