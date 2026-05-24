import {
  useState
} from "react";

import { AuthContext } from "./authContext";

export const AuthProvider = ({
  children,
}) => {

  const [authUser, setAuthUser] =
    useState(() => {
      const storedUser =
        localStorage.getItem("authUser");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    });

  // Login
  const login = (userData) => {
    localStorage.setItem(
      "authUser",
      JSON.stringify(userData)
    );

    setAuthUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authUser");

    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};