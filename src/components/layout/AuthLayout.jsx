import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left side - Branding & Feature List */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-primary overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative z-10 w-full text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                 <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              </div>
               <span className="text-3xl font-display font-bold tracking-tighter">KamaiKitab</span>
            </div>
            
            <h2 className="text-6xl font-display font-bold leading-[1.05] mb-12 tracking-tighter">
              The Digital Ledger for <br /> 
              <span className="text-accent italic">Modern Labour.</span>
            </h2>

            <div className="space-y-8">
               {[
                 { icon: Shield, title: 'Verified Income', desc: 'Transform informal earnings into bank-ready records.' },
                 { icon: Zap, title: 'Real-time Analytics', desc: 'Instantly spot unfair deductions and rate drops.' },
                 { icon: TrendingUp, title: 'Community Power', desc: 'Join 10,000+ workers advocating for fairness.' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                      <item.icon size={24} className="text-accent" />
                   </div>
                   <div>
                     <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                     <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-24 bg-[#FFFBFA]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-4 mb-12 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-display font-bold text-primary tracking-tighter">KamaiKitab</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
