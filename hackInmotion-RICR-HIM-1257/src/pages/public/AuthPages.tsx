import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore, Role } from '../../store/useStore';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthPages({ type }: { type: 'login' | 'register' }) {
  const navigate = useNavigate();
  const setRole = useStore(state => state.setRole);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<Role>('Citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      
      // Mock Authentication Success
      setRole(roleSelection);
      if (roleSelection === 'Administrator') {
        navigate('/admin');
      } else {
        navigate('/citizen');
      }
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="bg-surface-container-lowest w-full max-w-[420px] p-8 rounded-2xl shadow-elevation-2 border border-outline-variant page-enter">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-navy/10 text-brand-navy mb-4">
            {type === 'login' ? <LogIn size={32} /> : <UserPlus size={32} />}
          </div>
          <h1 className="headline-md text-brand-navy mb-2">
            {type === 'login' ? 'Welcome Back' : 'Join Smart Bhopal'}
          </h1>
          <p className="text-outline body-md">
            {type === 'login' 
              ? 'Enter your credentials to access your account.' 
              : 'Create an account to start reporting civic issues.'}
          </p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2 border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block label-md text-on-surface-variant mb-1 font-semibold">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-surface-base" 
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label-md text-on-surface-variant font-semibold">Password</label>
              {type === 'login' && <Link to="/" className="caption text-brand-green hover:underline">Forgot password?</Link>}
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-surface-base" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <label className="block label-md text-on-surface-variant mb-2 font-semibold">Simulate Login As</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setRoleSelection('Citizen')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${roleSelection === 'Citizen' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-surface-base text-outline border-outline-variant hover:border-brand-navy'}`}
              >
                Citizen
              </button>
              <button 
                type="button"
                onClick={() => setRoleSelection('Administrator')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${roleSelection === 'Administrator' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-surface-base text-outline border-outline-variant hover:border-brand-navy'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-elevation-1 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-outline">
          {type === 'login' ? (
            <>Don't have an account? <Link to="/register" className="font-semibold text-brand-green hover:underline">Sign up</Link></>
          ) : (
            <>Already have an account? <Link to="/login" className="font-semibold text-brand-green hover:underline">Sign in</Link></>
          )}
        </div>
      </div>
    </div>
  );
}
