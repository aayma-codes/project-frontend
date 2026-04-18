import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        token,
        new_password: data.password,
        confirm_password: data.confirm_password
      });
      toast.success('Password reset successful! Please sign in.');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-error mb-2">Invalid Link</h2>
        <p className="text-text-muted">The password reset link is invalid or missing the token.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-text mb-2">Create New Password</h2>
        <p className="text-text-muted">Your new password must be different from previous used passwords.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="New Password"
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
          label="Confirm New Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register("confirm_password", { 
            required: "Please confirm password",
            validate: val => val === watch('password') || "Passwords do not match"
          })}
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}
