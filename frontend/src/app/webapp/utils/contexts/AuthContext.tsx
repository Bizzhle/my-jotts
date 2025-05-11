import { createContext } from "react";
import { ApiHandler } from "../../../api-service/ApiRequestManager";
import { SessionState } from "../../../libs/SessionState";
import { useObjectReducer } from "../shared/objectReducer";

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

export function AuthProvider(props: AuthUserProviderProps) {
  const [state, setState] = useObjectReducer<AuthUserContextState>({});

  async function getUserInfo() {
    const user = await ApiHandler.getUserData();
    setState("authenticatedUser", user);
  }

  async function startSession(data: SessionInfo) {
    setState("sessionInfo", data);
  }

  async function logoutUser() {
    const refreshToken = SessionState.refreshToken;

    if (refreshToken) {
      await ApiHandler.logout({ refreshToken: refreshToken });
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
