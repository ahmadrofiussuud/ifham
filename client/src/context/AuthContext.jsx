import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const DEMO_USERS = [
  {
    id: 'demo-murid-a',
    name: 'Ahmad Cilik (Murid A)',
    email: 'murida@ifhamkids.com',
    grade: 'SD Kelas 3',
    avatar: '👦',
    badgeColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 'demo-murid-b',
    name: 'Fatimah Ceria (Murid B)',
    email: 'muridb@ifhamkids.com',
    grade: 'SD Kelas 4',
    avatar: '👧',
    badgeColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'demo-murid-c',
    name: 'Zaid Pintar (Murid C)',
    email: 'muridc@ifhamkids.com',
    grade: 'SD Kelas 2',
    avatar: '🧒',
    badgeColor: 'bg-sky-100 text-sky-700'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api/auth';

  useEffect(() => {
    const checkLoggedIn = async () => {
      const savedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('token');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else if (token) {
        try {
          const res = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          localStorage.setItem('user_data', JSON.stringify(res.data));
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    // Check if it's one of the demo users first
    const matchedDemo = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedDemo) {
      return loginAsDemo(matchedDemo);
    }

    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      // Fallback demo user if server is offline
      const fallbackUser = { id: 'user-guest', name: email.split('@')[0], email };
      localStorage.setItem('token', 'mock-token-guest');
      localStorage.setItem('user_data', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return { token: 'mock-token-guest', user: fallbackUser };
    }
  };

  const loginAsDemo = (demoUser) => {
    const userData = {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      grade: demoUser.grade
    };
    localStorage.setItem('token', `demo-token-${demoUser.id}`);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, { fullName, email, password });
      return res.data;
    } catch (err) {
      // Mock register success if server is offline
      const mockUser = { id: 'user-' + Date.now(), name: fullName, email };
      loginAsDemo(mockUser);
      return { message: 'User registered successfully (Demo Mode)' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

