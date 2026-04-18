import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state on load
  checkAuth: async () => {
    set({ isLoading: true });
    const token = localStorage.getItem('access_token');
    
    // Check if it's a demo token
    if (token?.startsWith('demo_')) {
      const role = token.split('_')[1];
      set({ 
        user: { 
          id: 'demo-123', 
          full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, 
          email: `${role}@demo.com`, 
          role: role.toUpperCase() 
        }, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return;
    }

    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await api.get('/api/auth/me');
      set({ user: response.data, isAuthenticated: true, error: null });
    } catch {
      set({ user: null, isAuthenticated: false, error: 'Session expired' });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // DEMO LOGIN LOGIC FOR COMPETITION
    const demoRoles = ['worker', 'advocate', 'verifier', 'admin'];
    const lowerEmail = email.toLowerCase();
    const matchedRole = demoRoles.find(role => lowerEmail === `${role}@demo.com`);

    if (matchedRole) {
      const demoUser = {
        id: 'demo-' + Date.now(),
        full_name: `Demo ${matchedRole.charAt(0).toUpperCase() + matchedRole.slice(1)}`,
        email: email,
        role: matchedRole.toUpperCase()
      };
      localStorage.setItem('access_token', `demo_${matchedRole}`);
      set({ user: demoUser, isAuthenticated: true, isLoading: false, error: null });
      return { success: true, role: matchedRole.toUpperCase() };
    }

    try {
      const response = await api.post('/api/auth/signin', { email, password });
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      const userRes = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      set({ user: userRes.data, isAuthenticated: true, isLoading: false });
      return { success: true, role: userRes.data.role };
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Invalid email or password', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.detail };
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/api/auth/signup', data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.detail };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('access_token');
      if (!token?.startsWith('demo_')) {
        await api.post('/api/auth/signout');
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null })
}));
