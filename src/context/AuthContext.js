import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Mock de autenticação - substituir pela chamada real da API
      if (email === 'admin@logitrack.com' && password === 'admin123') {
        const mockUser = {
          id: 1,
          email: 'admin@logitrack.com',
          name: 'Administrador',
        };
        await AsyncStorage.setItem('@LogiTrack:user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@LogiTrack:user');
    setUser(null);
  };

  const loadStoredData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@LogiTrack:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados armazenados:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
        loadStoredData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 