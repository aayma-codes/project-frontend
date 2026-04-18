import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Button from '../common/Button';
import { Menu, X, ShieldCheck, LogIn, UserPlus, Home, LayoutDashboard, ChevronDown, User, Shield, Gavel } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'For Advocates', href: '/#advocates' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const { scrollY } = useScroll();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  const handleDemoLogin = async (role) => {
    const res = await login(`${role}@demo.com`, 'password');
    if (res.success) {
      setMobileOpen(false);
      setShowDemoMenu(false);
      navigate(`/${role}/dashboard`);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface/90 backdrop-blur-xl shadow-lg border-b border-border/40 py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <img src="/src/assets/logo.png" alt="K" className="w-6 h-6 brightness-0 invert" />
            </div>
            <span className="text-2xl lg:text-3xl font-display font-bold text-primary tracking-tighter">KamaiKitab</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-text-muted hover:text-primary hover:scale-105 transition-all relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}

            {/* Demo Dropdown */}
            <div className="relative">
              <button 
                onMouseEnter={() => setShowDemoMenu(true)}
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 text-sm font-bold text-primary hover:scale-105 transition-all outline-none"
              >
                <LayoutDashboard size={18} />
                Demo Portals
                <ChevronDown size={14} className={`transition-transform duration-300 ${showDemoMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDemoMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setShowDemoMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-border/40 overflow-hidden py-2"
                  >
                    {[
                      { role: 'worker', label: 'Worker Portal', icon: User, color: 'text-primary' },
                      { role: 'advocate', label: 'Advocate Portal', icon: Gavel, color: 'text-accent' },
                      { role: 'verifier', label: 'Verifier Portal', icon: Shield, color: 'text-success' },
                    ].map(item => (
                      <button
                        key={item.role}
                        onClick={() => handleDemoLogin(item.role)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-sm font-semibold text-text"
                      >
                        <item.icon size={18} className={item.color} />
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Auth Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/signin" title="Sign In" className="p-2.5 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 transition-all">
              <LogIn size={22} />
            </Link>
            <Link to="/signup">
              <Button size="sm" className="px-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <UserPlus size={18} />
                <span>Join Now</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl text-text-muted hover:bg-background transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-50 bg-surface md:hidden"
        >
          <div className="flex flex-col h-full p-8">
            <div className="flex items-center justify-between mb-12">
              <span className="text-2xl font-display font-bold text-primary">KamaiKitab</span>
              <button onClick={() => setMobileOpen(false)}><X size={30} /></button>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Main Menu</p>
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold text-text hover:text-primary"
                >
                  {link.label}
                </a>
              ))}

              <div className="h-px bg-border/40 my-2" />
              
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Demo Portals</p>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => handleDemoLogin('worker')} className="flex items-center gap-3 text-lg font-bold text-primary">
                  <User size={20} /> Worker Portal
                </button>
                <button onClick={() => handleDemoLogin('advocate')} className="flex items-center gap-3 text-lg font-bold text-accent">
                  <Gavel size={20} /> Advocate Portal
                </button>
                <button onClick={() => handleDemoLogin('verifier')} className="flex items-center gap-3 text-lg font-bold text-success">
                  <Shield size={20} /> Verifier Portal
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link to="/signin" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" fullWidth size="lg" className="rounded-2xl">Sign In</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button fullWidth size="lg" className="rounded-2xl">Create Account</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
