import { createContext, useEffect } from "react";
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
  loading?: boolean;
}

export interface AuthContextValue extends AuthUserContextState {
  readonly isAuthenticated: boolean;
  readonly isLoggedIn: boolean;
  getUserInfo: () => void;
  logoutUser: () => void;
  startSession: (data: SessionInfo) => void;
  setLoading: (loading: boolean) => void;
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
    setState("loading", false);
  }

  async function startSession(data: SessionInfo) {
    setState("sessionInfo", data);
  }

  async function setLoading(loading: boolean) {
    setState("loading", loading);
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

  const handleReload = async () => {
    const session = SessionState.refreshToken;
    if (session) {
      const response = await ApiHandler.refreshToken();
      SessionState.accessToken = response?.accessToken;
      SessionState.refreshToken = response?.refreshToken;
      await startSession({
        accessToken: response?.accessToken,
        refreshToken: response?.refreshToken,
      });
      await getUserInfo();
    }
  };

  useEffect(() => {
    handleReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        getUserInfo,
        logoutUser,
        startSession,
        setLoading,
        get isLoggedIn() {
          return !!state.authenticatedUser;
        },
        get isAuthenticated() {
          return !!state.authenticatedUser?.emailAddress;
        },
        get authenticatedUser() {
          return state.authenticatedUser;
        },
        get loading() {
          return state.loading ?? true;
        },
      }}
      {...props}
    />
  );
}
