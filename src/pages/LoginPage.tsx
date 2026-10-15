import { useState } from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <div className="rounded-2xl bg-white p-8 ring-1 ring-forest-100">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600 text-white">
            <Leaf size={24} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-forest-500">Sign in to your GreenNest account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="input"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-forest-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-forest-600 hover:text-forest-800">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
