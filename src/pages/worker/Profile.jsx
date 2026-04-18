import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuthStore();
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset } = useForm();

  const onProfileSave = (data) => {
    toast.success('Profile updated successfully! (Demo)');
  };

  const onPasswordSave = (data) => {
    if (data.new_password !== data.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed successfully! (Demo)');
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Account Profile</h1>
        <p className="text-text-muted">Manage your personal information and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col - Avatar/Status */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl text-primary font-bold mb-4 uppercase">
                {user?.name?.charAt(0) || 'W'}
              </div>
              <h2 className="text-xl font-bold text-text mb-1">{user?.name}</h2>
              <p className="text-sm text-text-muted mb-4">{user?.role}</p>
              
              <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-success/10 text-success rounded-xl text-sm font-medium">
                <ShieldCheck size={18} /> Account Verified
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Forms */}
        <div className="md:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                <Input
                  label="Full Name"
                  icon={User}
                  {...registerProfile("name")}
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  disabled
                  className="bg-background cursor-not-allowed text-text-muted"
                  {...registerProfile("email")}
                />
                <div className="pt-2">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  icon={Lock}
                  {...registerPassword("current_password", { required: true })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    icon={Lock}
                    {...registerPassword("new_password", { required: true })}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    icon={Lock}
                    {...registerPassword("confirm_password", { required: true })}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" variant="secondary">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
