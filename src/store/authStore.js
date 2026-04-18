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

    // Try Real Backend First
    try {
      const response = await api.post('/api/auth/signin', { email, password });
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      const userRes = await api.get('/api/auth/me');
      set({ user: userRes.data, isAuthenticated: true, isLoading: false });
      return { success: true, role: userRes.data.role };
    } catch (error) {
      // Fallback to DEMO LOGIN if specific demo emails are used
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

      set({ 
        error: error.response?.data?.detail || 'Invalid email or password', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.detail || 'Connection failed' };
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Map frontend fields to backend expected: { name, email, password, confirm_password }
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password
      };
      await api.post('/api/auth/signup', payload);
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
      if (token && !token.startsWith('demo_')) {
        await api.post('/api/auth/signout');
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  forgotPassword: async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  },

  resetPassword: async (token, new_password, confirm_password) => {
    try {
      await api.post('/api/auth/reset-password', { token, new_password, confirm_password });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  },
  
  clearError: () => set({ error: null })
}));
