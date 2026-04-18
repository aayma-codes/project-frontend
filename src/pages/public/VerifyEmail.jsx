import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../../components/common/Button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="text-center flex flex-col items-center justify-center py-10">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-text mb-2">Verifying your email...</h2>
          <p className="text-text-muted">Please wait while we confirm your email address.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={64} className="text-success mb-6" />
          <h2 className="text-2xl font-bold text-text mb-2">Email Verified!</h2>
          <p className="text-text-muted mb-8">Your account is now active. Redirecting you to sign in...</p>
          <Button onClick={() => navigate('/signin')}>Go to Sign In Now</Button>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={64} className="text-error mb-6" />
          <h2 className="text-2xl font-bold text-text mb-2">Verification Failed</h2>
          <p className="text-text-muted mb-8">The verification link is invalid or has expired.</p>
          <Button variant="outline" onClick={() => navigate('/signup')}>Back to Sign Up</Button>
        </>
      )}
    </div>
  );
}
