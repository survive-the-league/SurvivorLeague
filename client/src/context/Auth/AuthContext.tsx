import { createContext } from 'react'; 
import { AuthState } from "./AuthProvider";

export interface AuthContextProps extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean, message: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean, message: string }>;
    logout: () => Promise<{ success: boolean, message: string }>;
    loginWithGoogle: () => Promise<{ success: boolean, message: string }>;
    verifyToken: () => Promise<{ success: boolean, message: string, user?: AuthState['currentUser'] }>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
