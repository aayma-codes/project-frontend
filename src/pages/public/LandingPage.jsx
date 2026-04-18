import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import Button from '../../components/common/Button';
import {
  ShieldCheck, BarChart3, Users, ArrowRight, TrendingUp,
  FileText, Megaphone, MapPin, ChevronDown, Star, Zap,
  Smartphone, Search, Scale, Activity, Apple, Play
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const features = [
  {
    icon: BarChart3,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Earnings Dashboard',
    desc: 'Unified view of your gross income, platform deductions, and net pay across all platforms.',
  },
  {
    icon: ShieldCheck,
    color: 'text-success',
    bg: 'bg-success/10',
    title: 'Verified Certificates',
    desc: 'Generate printable certificates verified by community peers for banks or landlords.',
  },
  {
    icon: Megaphone,
    color: 'text-accent',
    bg: 'bg-accent/10',
    title: 'Anonymous Reports',
    desc: 'Securely report rate drops or unfair deactivations without fear of platform retaliation.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Log Your Shifts',
    desc: 'Enter your hours and earnings manually or via bulk CSV import from platform exports.',
    icon: Smartphone
  },
  {
    num: '02',
    title: 'Verify with Proof',
    desc: 'Upload screenshots of your platform earnings. Community verifiers authenticate your records.',
    icon: Search
  },
  {
    num: '03',
    title: 'Claim Your Rights',
    desc: 'Use your verified data to prove income, track trends, and fight systemic platform bias.',
    icon: Scale
  }
];

export default function LandingPage() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full overflow-x-hidden bg-[#FFFBFA]">

      {/* ── HERO ── */}
      <section className="w-full relative min-h-[90vh] flex items-center pt-24 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl lg:text-8xl font-display font-bold leading-[0.95] mb-8 tracking-tighter text-text"
            >
              The Power of <br />
              <span className="text-primary italic">Verified</span> Earnings.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xl lg:text-2xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              KamaiKitab empowers Pakistan's gig workforce to track, verify, and leverage their income data for a fairer future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to="/signup">
                <Button size="lg" className="px-10 py-8 text-xl rounded-full shadow-2xl shadow-primary/30 group">
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex items-center justify-center gap-12 grayscale opacity-50 overflow-hidden"
            >
               {/* Platform Icons placeholder */}
               <div className="flex gap-16 animate-marquee whitespace-nowrap">
                  <span className="text-2xl font-bold tracking-widest">FOODPANDA</span>
                  <span className="text-2xl font-bold tracking-widest">INDRIVE</span>
                  <span className="text-2xl font-bold tracking-widest">BYKEA</span>
                  <span className="text-2xl font-bold tracking-widest">CAREEM</span>
                  <span className="text-2xl font-bold tracking-widest">UBER</span>
               </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ── FEATURES ── */}
      <section id="features" className="w-full py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            {...fadeUp}
          >
            <p className="text-primary font-bold tracking-widest text-sm uppercase mb-4">Powerful Features</p>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-text mb-6 tracking-tighter">
              A Toolbox for the <br /> <span className="text-primary">Gig Economy.</span>
            </h2>
            <p className="text-text-muted text-lg">
              We provide the tools gig workers need to prove their income, track their time, and fight for their rights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-background border border-border/40 hover:border-primary/30 transition-all group"
              >
                <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <f.icon size={32} className={f.color} />
                </div>
                <h3 className="text-2xl font-bold text-text mb-4">{f.title}</h3>
                <p className="text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE MOCKUP SECTION ── */}
      <section id="how-it-works" className="w-full py-24 bg-surface/50 border-y border-border/40">
        <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-text mb-8 leading-tight">
              A Modern App for a <br />
              <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">Modern Workforce</span>
            </h2>
            <div className="space-y-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-border/50 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <step.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text mb-2">{step.title}</h3>
                    <p className="text-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-text text-white px-6 py-3 rounded-2xl cursor-pointer hover:scale-105 transition-all">
                <Apple size={24} />
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-60 leading-none">Download on</p>
                  <p className="text-lg font-bold leading-none">App Store</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-text text-white px-6 py-3 rounded-2xl cursor-pointer hover:scale-105 transition-all">
                <Play size={24} className="fill-white" />
                <div>
                  <p className="text-[10px] uppercase font-bold opacity-60 leading-none">Get it on</p>
                  <p className="text-lg font-bold leading-none">Google Play</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img
                src="/src/assets/mobile_mockup_premium.png"
                alt="KamaiKitab Premium App"
                className="w-full max-w-[420px] drop-shadow-[0_40px_60px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
              />
              <div className="absolute -bottom-10 -left-10 bg-white border border-border/40 p-6 rounded-3xl shadow-xl hidden lg:block animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-success" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">100% Secure</p>
                    <p className="text-xs text-text-muted">Your data, your rights.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ADVOCATES SECTION ── */}
      <section id="advocates" className="w-full py-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <motion.div {...fadeUp}>
                <p className="text-primary font-bold tracking-widest text-sm uppercase mb-4">Empowering Advocacy</p>
                <h2 className="text-4xl lg:text-7xl font-display font-bold text-text mb-8 tracking-tighter">
                  Real Data for <br /> Real Change.
                </h2>
                <p className="text-xl text-text-muted mb-12 leading-relaxed">
                  We give labour advocates the eagle-eye view they need to spot systemic volatility and platform bias at the city-zone level.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-4xl font-display font-bold text-primary">2.4Cr+</p>
                    <p className="text-sm font-bold text-text-muted uppercase tracking-wider">Earnings Tracked</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-display font-bold text-accent">98.2%</p>
                    <p className="text-sm font-bold text-text-muted uppercase tracking-wider">Grievance Accuracy</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-text text-white p-10 lg:p-16 rounded-[40px] shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
                <h3 className="text-3xl font-display font-bold mb-8 relative z-10">Advocate Dashboard Features</h3>
                <div className="space-y-6 relative z-10">
                  {[
                    { icon: MapPin, title: 'Income Heatmaps', desc: 'Identify city zones where earnings are dropping below survival levels.' },
                    { icon: Activity, title: 'Commission Tracker', desc: 'Monitor real-time shifts in platform deduction rates.' },
                    { icon: Users, title: 'Cluster Analysis', desc: 'Auto-group similar complaints to identify systemic deactivation patterns.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start hover:translate-x-2 transition-transform duration-300 cursor-default">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon size={22} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-text pt-24 pb-12 text-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <img src="/src/assets/logo.png" alt="K" className="w-6 h-6 brightness-0 invert" />
                </div>
                <span className="text-3xl font-display font-bold tracking-tighter">KamaiKitab</span>
              </div>
              <p className="text-white/50 text-lg max-w-sm mb-10 leading-relaxed">
                Empowering Pakistan's gig workforce with financial transparency and community-driven advocacy.
              </p>
              <div className="flex gap-4">
                 {/* Social placeholders */}
                 {[1,2,3,4].map(s => <div key={s} className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer" />)}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-primary">Platform</h4>
              <ul className="space-y-4 text-white/60 font-medium">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#advocates" className="hover:text-white transition-colors">For Advocates</a></li>
                <li><Link to="/signin" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-accent">Contact</h4>
              <ul className="space-y-4 text-white/60 font-medium">
                <li>support@kamaikitab.pk</li>
                <li>Lahore, Pakistan</li>
                <li>+92 300 1234567</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40 font-medium">
            <p>© {new Date().getFullYear()} KamaiKitab. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
