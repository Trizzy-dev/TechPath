import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  type User,
} from "../api/authApi";

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(
      "techpath_user"
    );

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("techpath_token")
  );

  async function login(
    email: string,
    password: string
  ) {
    const result = await loginUser({
      email,
      password,
    });

    localStorage.setItem(
      "techpath_token",
      result.token
    );

    localStorage.setItem(
      "techpath_user",
      JSON.stringify(result.user)
    );

    setToken(result.token);
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("techpath_token");
    localStorage.removeItem("techpath_user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}