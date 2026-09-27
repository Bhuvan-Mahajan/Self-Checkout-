import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) return;

    const success = await login(phone, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] m-auto bg-white rounded-[16px] p-8 border border-brand-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-2xl mb-3 shrink-0">
            🛒
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            SmartCart Admin
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Store management portal
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary block">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => {
                clearError();
                setPhone(e.target.value);
              }}
              required
              autoFocus
              className="border-brand-200 focus-visible:ring-brand-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary block">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                clearError();
                setPassword(e.target.value);
              }}
              required
              className="border-brand-200 focus-visible:ring-brand-accent"
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-accent hover:bg-[#b8a287] text-white font-semibold h-10 rounded-lg mt-2 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer Notice */}
        <p className="text-xs text-text-muted text-center mt-6">
          Access restricted to store staff and admins
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
