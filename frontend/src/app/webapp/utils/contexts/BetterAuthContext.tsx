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
  image?: string | null;
  role?: string | null;
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
  readonly authenticatedUser: User | undefined;
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
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loginError, setLoginError] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  async function storeLoginError(error: string) {
    setLoginError(error);
  }

  async function logoutUser() {
    await authClient.signOut();
    setUser(undefined);
    window.location.href = "/";
  }

  async function startSession(data: User | undefined) {
    setIsLoading(true);
    setUser(data);
    setIsLoading(false);
  }

  const refreshSession = async () => {
    try {
      const { data } = await authClient.getSession();
      setSession(data?.session ?? null);
      setUser(data?.user ?? undefined);
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
        user: user || null,
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
