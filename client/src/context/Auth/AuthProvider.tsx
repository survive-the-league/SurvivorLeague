import { useEffect, useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { env } from "../../config/env";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Cookies from "js-cookie";

export interface AuthState {
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    token: string;
  } | null;
  isLoading: boolean;
}

const AUTH_INITIAL_STATE: AuthState = {
  currentUser: null,
  isLoading: true,
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: "[AUTH] - SetLoading", payload: true });
      await verifyToken();
      dispatch({ type: "[AUTH] - SetLoading", payload: false });
    };
    
    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${env.VITE_APP_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!data.ok) {
        return { success: false, message: data.error };
      }

      const userData = {
        id: data.result.user.id,
        email: data.result.user.email,
        displayName: data.result.user.displayName || "",
        token: data.result.token,
        lives: data.result.user.lives,
      };

      dispatch({
        type: "[AUTH] - Login",
        payload: userData,
      });

      console.log(
        "🚀 ~ file: AuthProvider.tsx:84 ~ login ~ data.result.token:",
        data.result.token
      );

      Cookies.set("token", data.result.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      return { success: true, message: "User logged in successfully" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error logging in" };
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${env.VITE_APP_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (!data.ok) {
        return { success: false, message: data.error };
      }

      const userData = {
        id: data.result.user.id,
        email: data.result.user.email,
        displayName: data.result.user.displayName || "",
        token: data.result.token,
        lives: data.result.user.lives,
      };

      if (!userData.displayName) {
        userData.displayName = userData.email.split("@")[0];
      }

      dispatch({ type: "[AUTH] - Login", payload: userData });
      Cookies.set("token", data.result.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return { success: true, message: "User registered successfully" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error registering user" };
    }
  };

  const logout = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${env.VITE_APP_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.currentUser?.token}`,
        },
      });
      const data = await response.json();

      if (!data.ok) {
        return { success: false, message: data.error };
      }
      dispatch({ type: "[AUTH] - Logout" });
      Cookies.remove("token");
      return { success: true, message: "User logged out successfully" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error logging out" };
    }
  };

  const loginWithGoogle = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;
      const user = result.user;

      const response = await fetch(`${env.VITE_APP_API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          idToken: credential?.idToken,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        return { success: false, message: data.error };
      }

      const userData = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName!,
        token: token!,
        lives: 3,
      };

      dispatch({
        type: "[AUTH] - Login",
        payload: userData,
      });

      return {
        success: true,
        message: "User logged in successfully with Google",
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error logging in with Google" };
    }
  };

  const verifyToken = async (): Promise<void> => {
    try {
      dispatch({ type: "[AUTH] - SetLoading", payload: true });
      const token = Cookies.get("token");

      if (!token) {
        dispatch({ type: "[AUTH] - SetLoading", payload: false });
        return;
      }

      const response = await fetch(
        `${env.VITE_APP_API_BASE_URL}/auth/refresh`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!data.ok) {
        dispatch({ type: "[AUTH] - SetLoading", payload: false });
        return;
      }

      const userData = {
        id: data.result.user.id,
        email: data.result.user.email,
        displayName: data.result.user.displayName || "",
        token: data.result.token,
        lives: data.result.user.lives,
      };

      if (!userData.displayName) {
        userData.displayName = userData.email.split("@")[0];
      }

      dispatch({
        type: "[AUTH] - Login",
        payload: userData,
      });

      dispatch({ type: "[AUTH] - SetLoading", payload: false });
      Cookies.set("token", data.result.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: "[AUTH] - SetLoading", payload: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loginWithGoogle,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
