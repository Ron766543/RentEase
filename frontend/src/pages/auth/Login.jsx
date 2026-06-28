import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../../icons/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link to="/"><Logo markClassName="h-9 w-9" /></Link>
        </div>

        <div className="card p-7">
          <h1 className="font-display text-xl font-semibold text-ink text-center mb-1">Welcome back</h1>
          <p className="text-sm text-mist text-center mb-6">Log in to manage your rentals</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-center text-mist mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-sage-600 hover:text-sage-700">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-5 text-xs text-mist text-center space-y-0.5">
          <p>Demo accounts (after running the seed script):</p>
          <p>customer@rentease.com · vendor@rentease.com · admin@rentease.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
