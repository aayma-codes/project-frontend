import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/api/auth/forgot-password', data);
      setIsSent(true);
      toast.success('If your email is registered, you will receive a reset link');
    } catch (error) {
      // For security, still show success message or generic error
      toast.success('If your email is registered, you will receive a reset link');
      setIsSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-success" />
        </div>
        <h2 className="text-3xl font-display font-bold text-text mb-4">Check Your Inbox</h2>
        <p className="text-text-muted mb-8">
          We've sent password reset instructions to your email address. Please check your spam folder if you don't see it.
        </p>
        <Link to="/signin">
          <Button fullWidth>Return to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-text mb-2">Reset Password</h2>
        <p className="text-text-muted">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/signin" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
