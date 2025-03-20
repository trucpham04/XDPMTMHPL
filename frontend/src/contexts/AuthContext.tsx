import { createContext, useContext, useState } from "react";
import React from "react";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); 

  const loginUser = (email: string, _password: string) => {
    setUser({ email }); 
  };

  const logoutUser = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loginUser, logoutUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

