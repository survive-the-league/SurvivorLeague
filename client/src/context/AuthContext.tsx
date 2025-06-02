/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/middleware/firebase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    currentUser: User | null;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => { 
    const [currentUser, setCurrentUser] = useState<User | null>(null); 
    const navigate = useNavigate();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const logout = async (): Promise<void> => { 
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};