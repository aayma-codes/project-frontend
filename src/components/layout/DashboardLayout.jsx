import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import ChatbotWidget from '../features/ChatbotWidget';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  UploadCloud, 
  AlertTriangle, 
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  BarChart3,
  Megaphone,
  Users
} from 'lucide-react';

const workerNav = [
  { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
  { name: 'Add Earnings', path: '/worker/earnings/add', icon: UploadCloud },
  { name: 'History', path: '/worker/earnings/history', icon: History },
  { name: 'Analytics', path: '/worker/analytics', icon: BarChart3 },
  { name: 'Certificate', path: '/worker/certificate', icon: FileText },
  { name: 'Alerts', path: '/worker/alerts', icon: AlertTriangle },
  { name: 'Grievances', path: '/worker/grievances', icon: Megaphone },
  { name: 'Profile', path: '/worker/profile', icon: UserIcon },
];

const verifierNav = [
  { name: 'Dashboard', path: '/verifier/dashboard', icon: ShieldCheck },
];

const advocateNav = [
  { name: 'Dashboard', path: '/advocate/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', path: '/advocate/analytics', icon: BarChart3 },
  { name: 'Vulnerable', path: '/advocate/vulnerable', icon: AlertTriangle },
  { name: 'Grievances', path: '/advocate/grievances', icon: Megaphone },
];

const adminNav = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: UserIcon },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = 
    user?.role === 'WORKER' ? workerNav :
    user?.role === 'VERIFIER' ? verifierNav :
    user?.role === 'ADVOCATE' ? advocateNav :
    user?.role === 'ADMIN' ? adminNav : workerNav; // fallback to worker

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-text/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border/50 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-display font-bold text-primary tracking-tight">KamaiKitab</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-text-muted hover:text-text"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex items-center gap-3 border-b border-border/50 bg-background/30">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
            {user?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <p className="text-sm font-semibold text-text truncate max-w-[140px]">{user?.name || 'Worker User'}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role?.toLowerCase() || 'worker'}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-text-muted hover:bg-background hover:text-text'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-text-muted'} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-4 py-3 text-error rounded-xl hover:bg-error/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-surface border-b border-border/50 px-4 py-3 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="text-lg font-display font-bold text-primary">KamaiKitab</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-text-muted hover:bg-background rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto h-full pb-20"
          >
            <Outlet />
          </motion.div>
        </div>

        {/* Chatbot overlay */}
        <ChatbotWidget />
      </main>
    </div>
  );
}
