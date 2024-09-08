import { createContext, useContext } from "react";
import { useObjectReducer } from "../shared/objectReducer";
import {
  getUserData,
  logout,
} from "../../../api-service/services/auth-service";
import { SessionState } from "../../../libs/SessionState";

interface AuthUserProviderProps {
  children?: React.ReactElement;
}
export interface UserInfo {
  id: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  registrationDate: Date | string;
  lastLoggedIn: Date | string;
}

export interface SessionInfo {
  emailAddress?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthUserContextState {
  readonly authenticatedUser?: UserInfo;
  readonly sessionInfo?: SessionInfo;
}

export interface AuthContextValue extends AuthUserContextState {
  readonly isAuthenticated: boolean;
  readonly isLoggedIn: boolean;
  getUserInfo: () => void;
  logoutUser: () => void;
  startSession: (data: SessionInfo) => void;
}

export const AuthContext = createContext<AuthContextValue>({} as never);

export interface useAuthenticatedUserReturn extends AuthContextValue {
  authenticatedUser?: UserInfo;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export function AuthProvider(props: AuthUserProviderProps) {
  const [state, setState] = useObjectReducer<AuthUserContextState>({});

  async function getUserInfo() {
    const user = await getUserData();
    setState("authenticatedUser", user);
  }

  async function startSession(data: SessionInfo) {
    setState("sessionInfo", data);
  }

  async function logoutUser() {
    const refreshToken = SessionState.refreshToken;

    if (refreshToken) {
      await logout({ refreshToken: refreshToken });
      setState("authenticatedUser", undefined);
      SessionState.removeAccessToken();
      SessionState.removeRefreshToken();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        getUserInfo,
        logoutUser,
        startSession,
        get isLoggedIn() {
          return !!state.authenticatedUser;
        },
        get isAuthenticated() {
          return !!state.authenticatedUser?.emailAddress;
        },
        get authenticatedUser() {
          return state.authenticatedUser;
        },
      }}
      {...props}
    />
  );
}
