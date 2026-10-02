import {
  createContext,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { LoginResponse, User } from "../types/auth.types";
import { ApiError } from "../services/api";
import {
  getCurrentUser,
  logout as logoutApi,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (response: LoginResponse) => void;
  logout: () => Promise<void>;
  updateUserName: (name: string) => void;
  retryAuthentication: () => void;
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
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const skipNextTokenValidation = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (skipNextTokenValidation.current) {
      skipNextTokenValidation.current = false;
      return;
    }

    let isActive = true;

    const loadCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser(token);
        if (isActive) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 403)
        ) {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setAuthError(
            error instanceof Error
              ? error.message
              : "Failed to verify the current session",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isActive = false;
    };
  }, [sessionAttempt, token]);

  const login = (response: LoginResponse) => {
    skipNextTokenValidation.current = true;
    setAuthError(null);
    setIsLoading(false);
    setToken(response.accessToken);
    setUser(response.user);
    setSessionAttempt((attempt) => attempt + 1);

    localStorage.setItem("token", response.accessToken);
    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );
  };

  const updateUserName = useCallback((name: string) => {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, name } : currentUser,
    );
  }, []);

  const logout = async () => {
    if (token) {
      await logoutApi(token);
    }

    setToken(null);
    setUser(null);
    setAuthError(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const retryAuthentication = () => {
    setIsLoading(true);
    setAuthError(null);
    setSessionAttempt((attempt) => attempt + 1);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        login,
        logout,
        updateUserName,
        retryAuthentication,
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