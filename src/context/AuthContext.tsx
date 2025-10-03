// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean; // Thêm trạng thái loading
    signIn: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Mặc định là true

    useEffect(() => {
        const authData = localStorage.getItem('wedding_guest_auth');
        if (authData) {
            try {
                const parsedData = JSON.parse(authData);
                const now = Date.now();
                
                if (parsedData.auth && parsedData.expiry > now) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('wedding_guest_auth');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Failed to parse auth data from localStorage', error);
                localStorage.removeItem('wedding_guest_auth');
                setIsAuthenticated(false);
            }
        }
        setIsLoading(false); // Đã hoàn thành việc kiểm tra, set loading thành false
    }, []);

    const signIn = () => {
        const authData = {
            auth: true,
            expiry: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10
        };
        localStorage.setItem('wedding_guest_auth', JSON.stringify(authData));
        setIsAuthenticated(true);
    };

    const signOut = () => {
        localStorage.removeItem('wedding_guest_auth');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};