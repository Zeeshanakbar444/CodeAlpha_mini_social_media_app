import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/user/me');
            setUser(response.data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        const response = await api.post('/user/register', formData);
        // Don't auto-login after registration
        // User must login manually
        return response.data;
    };

    const login = async (credentials) => {
        const response = await api.post('/user/login', credentials);
        setUser(response.data.data.user);
        return response.data;
    };

    const logout = async () => {
        await api.post('/user/logout');
        setUser(null);
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
