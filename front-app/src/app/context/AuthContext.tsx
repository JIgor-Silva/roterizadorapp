import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo o tipo User aqui para incluir a role, 
// assumindo que a API de login retornará essa informação.
export interface User {
  id: string;
  name: string;
  email: string;
  store_id: string;
  store_name: string;
  role: 'admin' | 'delivery_person'; // Role do usuário
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedUser && storedToken) {
        if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
      }
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/users/sign_in', {
        user: { email, password },
      });

      console.log('Resposta da API:', JSON.stringify(response.data, null, 2));

      const { user, token } = response.data;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', token); 
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      console.log('AuthContext - User set after login:', user);
      setIsLoading(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Email ou senha incorretos.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.delete('/users/sign_out');
    } catch (error) {
      console.error('Erro ao fazer logout no backend:', error);
    
    } finally {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userToken'); 
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
