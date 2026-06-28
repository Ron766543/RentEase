import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Logo } from '../../icons/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: searchParams.get('role') === 'vendor' ? 'vendor' : 'customer',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.role === 'vendor' && !form.businessName) {
      setError('Please provide your business name.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(user.role === 'vendor' ? '/vendor' : '/');
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
          <h1 className="font-display text-xl font-semibold text-ink text-center mb-1">Create your account</h1>
          <p className="text-sm text-mist text-center mb-6">Start renting in minutes</p>

          <div className="flex rounded bg-sage-50 p-1 mb-5">
            <button
              type="button"
              onClick={() => set({ role: 'customer' })}
              className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${
                form.role === 'customer' ? 'bg-paper shadow-card text-ink' : 'text-mist'
              }`}
            >
              I want to rent
            </button>
            <button
              type="button"
              onClick={() => set({ role: 'vendor' })}
              className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${
                form.role === 'vendor' ? 'bg-paper shadow-card text-ink' : 'text-mist'
              }`}
            >
              I list inventory
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} required />
            </div>
            {form.role === 'vendor' && (
              <div>
                <label className="label">Business name</label>
                <input className="input" value={form.businessName} onChange={(e) => set({ businessName: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => set({ email: e.target.value })} required autoComplete="email" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => set({ password: e.target.value })}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {form.role === 'vendor' && (
            <p className="text-xs text-mist mt-4 text-center">
              Vendor accounts are reviewed before products go live.
            </p>
          )}

          <p className="text-sm text-center text-mist mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-sage-600 hover:text-sage-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
