// src/pages/auth/LoginPage.tsx
// -----------------------------------------------------------------------------
// TypeScript version (TSX) of the unified Login page.
// Handles both email/password and Google OAuth. Redirects based on role.
// -----------------------------------------------------------------------------

import { useState, type FC } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { login, googleLogin } from '../store/authSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

// Helper to derive the role regardless of payload shape
const extractRole = (payload: unknown): 'admin' | 'user' => {
  const p: any = payload; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!p) return 'user';
  return (
    p.role ||
    p?.data?.role ||
    p?.user?.role ||
    (p.isAdmin ? 'admin' : 'user')
  );
};

const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  // --------------------- Handlers ---------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ email, password })).unwrap();
      const role = extractRole(resultAction);
      role === 'admin' ? navigate('/admin/products') : navigate(redirectTo);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse): Promise<void> => {
    try {
      const tokenId = credentialResponse.credential;
      if (!tokenId) throw new Error('No credential returned');
      const resultAction = await dispatch(googleLogin(tokenId)).unwrap();
      const role = extractRole(resultAction);
      role === 'admin' ? navigate('/admin/products') : navigate(redirectTo);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGoogleError = (): void => {
    toast.error('Google sign‑in was unsuccessful. Please try again later.');
  };

  // --------------------- UI ---------------------
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                For demo: user@example.com or admin@example.com (password: password)
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;