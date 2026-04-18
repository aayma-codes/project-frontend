import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignIn() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    const response = await login(data.email, data.password);
    if (response.success) {
      toast.success('Signed in successfully!');
      
      // Redirect based on role
      const role = response.role?.toLowerCase();
      if (role) {
        navigate(`/${role}/dashboard`);
      } else {
        navigate('/worker/dashboard'); // Fallback
      }
    } else {
      toast.error(response.error || 'Invalid credentials');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-text mb-2">Welcome Back</h2>
        <p className="text-text-muted">Sign in to track your earnings and access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="user@example.com"
          error={errors.email?.message}
          {...register("email", { 
            required: "Email is required",
          })}
        />

        <div>
          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { 
              required: "Password is required",
            })}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
          Sign In
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="h-px bg-border flex-1"></div>
        <span className="text-sm text-text-muted">OR</span>
        <div className="h-px bg-border flex-1"></div>
      </div>

      {/* Mock Google Sign in for competition frontend */}
      <button 
        onClick={() => toast.success('Google Sign-in mocked for competition demo')}
        className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-text font-medium hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20 outline-none"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <p className="mt-8 text-center text-sm text-text-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign Up
        </Link>
      </p>

      {/* Demo Credentials Hint for Competition */}
      <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-[10px] uppercase font-bold text-primary mb-2 tracking-widest">Competition Demo Access</p>
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-text-muted">
          <div><span className="text-primary font-bold">Worker:</span> worker@demo.com</div>
          <div><span className="text-primary font-bold">Advocate:</span> advocate@demo.com</div>
          <div><span className="text-primary font-bold">Verifier:</span> verifier@demo.com</div>
          <div><span className="text-primary font-bold">Pass:</span> any</div>
        </div>
      </div>
    </div>
  );
}
