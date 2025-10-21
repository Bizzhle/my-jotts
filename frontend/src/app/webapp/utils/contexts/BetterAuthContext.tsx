import { createContext, useEffect, useState } from "react";
import { authClient } from "../../../libs/betterAuthClient";

interface AuthUserProviderProps {
  children?: React.ReactElement;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
}

interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
}

interface AuthContextType {
  readonly isAuthenticated: boolean;
  readonly authenticatedUser: User | null;
  isLoading: boolean;
  user: User | null;
  logoutUser: () => void;
  startSession: (data: User) => void;
  session: Session | null;
  loginError: string;
  storeLoginError: (data: string) => void;
}

export const BetterAuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function BetterAuthProvider(props: AuthUserProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  async function storeLoginError(error: string) {
    setLoginError(error);
  }

  async function logoutUser() {
    await authClient.signOut();
    setUser(null);
  }

  async function startSession(data: User | null) {
    setIsLoading(true);
    setUser(data);
    setIsLoading(false);
  }

  const refreshSession = async () => {
    try {
      const { data } = await authClient.getSession();
      setSession(data?.session ?? null);
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession(); // 🔁 Runs once on app load / reload
  }, []);

  return (
    <BetterAuthContext.Provider
      value={{
        user: user,
        get isAuthenticated() {
          return !!user?.email;
        },
        get authenticatedUser() {
          return user;
        },
        isLoading,
        logoutUser,
        startSession,
        session,
        loginError,
        storeLoginError,
      }}
      {...props}
    />
  );
}
