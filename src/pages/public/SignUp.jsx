import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUp() {
  const { register: registerAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const onSubmit = async (data) => {
    // Teammate's backend expects: { name, email, password, confirm_password }
    const response = await registerAuth({
      name: data.full_name, // Mapping full_name from form to name for API
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password
    });

    if (response.success) {
      toast.success('Verification email sent! Please check your inbox.', { duration: 5000 });
      navigate('/signin');
    } else {
      toast.error(response.error || 'Registration failed');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-text mb-2">Create an Account</h2>
        <p className="text-text-muted">Join KamaiKitab to take control of your gig earnings.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          icon={User}
          placeholder="e.g. John Doe"
          error={errors.name?.message}
          {...register("name", { 
            required: "Name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
            maxLength: { value: 50, message: "Maximum 50 characters" }
          })}
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="user@example.com"
          error={errors.email?.message}
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { 
            required: "Password is required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              message: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
            }
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register("confirm_password", { 
            required: "Please confirm password",
            validate: val => val === watch('password') || "Passwords do not match"
          })}
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Create Account
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="h-px bg-border flex-1"></div>
        <span className="text-sm text-text-muted">OR</span>
        <div className="h-px bg-border flex-1"></div>
      </div>

      <button className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-text font-medium hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20 outline-none">
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>

      <p className="mt-8 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/signin" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
