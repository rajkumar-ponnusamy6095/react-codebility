import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { LoginResponse, User } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const login = (response: LoginResponse) => {
    setToken(response.token);
    setUser(response.user);

    localStorage.setItem("token", response.token);
    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};