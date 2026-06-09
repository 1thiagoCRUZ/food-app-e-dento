import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RestaurantData {
  id: number;
  name: string;
  cnpj: string;
  isOpen: boolean;
}

interface AuthContextType {
  user: User | null;
  restaurant: RestaurantData | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  toggleRestaurantStatus: () => Promise<void>;
  fetchMyRestaurant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (parsedUser.role === 'RESTAURANT') {
            await fetchMyRestaurant();
          }
        } catch (e) {
          console.error('Failed to parse user from local storage', e);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const fetchMyRestaurant = async () => {
    try {
      const data = await api.get('/restaurants/my');
      setRestaurant(data);
    } catch (e) {
      console.error('Failed to fetch restaurant data', e);
      setRestaurant(null);
    }
  };

  const login = async (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    if (user.role === 'RESTAURANT') {
      await fetchMyRestaurant();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRestaurant(null);
  };

  const toggleRestaurantStatus = async () => {
    if (!restaurant) return;
    const newStatus = !restaurant.isOpen;
    
    // Optimistic update
    setRestaurant(prev => prev ? { ...prev, isOpen: newStatus } : null);
    
    try {
      await api.patch(`/restaurants/${restaurant.id}/status`, { isOpen: newStatus });
    } catch (e) {
      // Revert on failure
      setRestaurant(prev => prev ? { ...prev, isOpen: !newStatus } : null);
      console.error('Failed to toggle restaurant status', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, restaurant, isLoading, login, logout, toggleRestaurantStatus, fetchMyRestaurant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
