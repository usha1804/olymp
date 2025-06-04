import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  userType(userType: any): unknown;
  email: string;
  role: "student" | "school" | "sales" | "admin";
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // You can add localStorage here for persistence
  };

  const logout = () => {
    setUser(null);
    // Also remove from localStorage if you persist
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
