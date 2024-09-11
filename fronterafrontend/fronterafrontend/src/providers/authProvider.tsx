import { jwtDecode } from "jwt-decode";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SetStateAction } from "react";

export type TUser = {
  email: string;
  id: number;
  name: string;
  role: string;
};

type TAuthContext = {
  user: TUser | null;
  setUser: React.Dispatch<SetStateAction<TUser | null>>;
  logout: () => void;
};

const authContext = React.createContext<null | TAuthContext>(null);

export function useAuth(): [
  TUser | null | undefined,
  React.Dispatch<SetStateAction<TUser | null>> | undefined,
  (() => void) | undefined
] {
  const ctx = useContext(authContext);
  return [ctx?.user, ctx?.setUser, ctx?.logout];
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<TUser | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    if (setUser) setUser(null);
    window.location.href = "/login";
  };

  const verify_auth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || token.length === 0) {
      if (
        window.location.pathname !== "/login" &&
        !window.location.pathname.includes("reset")
      ) {
        window.location.href = "/login";
      }
    } else {
      if (window.location.pathname === "/login") window.location.href = "/";
      const user: any = jwtDecode(token);
      setUser(user);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    verify_auth();
  }, [window.location.pathname]);

  const values = { user, setUser, logout };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}
