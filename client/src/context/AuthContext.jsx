/* eslint-disable react/prop-types */
import  { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../middleware/firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => { 
    
    const [currentUser, setCurrentUser] = useState(null); 

    console.log(currentUser,"currentUser")
    const navigate = useNavigate();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const logout = async () => { 
        try {
            await signOut(auth);
            navigate('/');
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