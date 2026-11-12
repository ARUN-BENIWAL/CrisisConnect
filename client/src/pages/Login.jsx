import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  LogIn, 
  AlertCircle, 
  ShieldCheck
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Both Staff ID/Username and Password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authData = await login(username.trim(), password);
      // Directly direct user to their authorized dashboard
      if (authData.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/responder', { replace: true });
      }
    } catch (err) {
      console.error('Authentication error', err);
      const msg = err.response?.data?.message || 'Invalid username or password. Check credentials and retry.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded bg-[#18392b] text-white flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[#0f172a]">
          Authorized Staff Sign-In
        </h1>
        <p className="text-xs text-slate-500">
          SRM KTR Campus Public Safety, SRM Hospital EMTs &amp; Incident Responders
        </p>
      </div>

      {/* Demo / Evaluator Profiles notice */}
      <div className="p-4 rounded border border-amber-300 bg-amber-50/70 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-950 uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4 text-amber-800" aria-hidden="true" />
          <span>SRM KTR Duty Profiles (Click to Auto-Fill)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin', 'admin123')}
            className="p-2 rounded bg-white hover:bg-amber-100/60 border border-amber-200 text-left transition-colors"
          >
            <div className="font-bold text-slate-900 text-xs">SRM Security Control</div>
            <div className="text-[10px] text-slate-500 font-mono">admin / admin123</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('medic', 'medic123')}
            className="p-2 rounded bg-white hover:bg-amber-100/60 border border-amber-200 text-left transition-colors"
          >
            <div className="font-bold text-slate-900 text-xs">SRM Hospital EMT</div>
            <div className="text-[10px] text-slate-500 font-mono">medic / medic123</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('police', 'police123')}
            className="p-2 rounded bg-white hover:bg-amber-100/60 border border-amber-200 text-left transition-colors"
          >
            <div className="font-bold text-slate-900 text-xs">Campus Patrol: Kiran Das</div>
            <div className="text-[10px] text-slate-500 font-mono">police / police123</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('counselor', 'counselor123')}
            className="p-2 rounded bg-white hover:bg-amber-100/60 border border-amber-200 text-left transition-colors"
          >
            <div className="font-bold text-slate-900 text-xs">SRM Counselor (Tele-MANAS)</div>
            <div className="text-[10px] text-slate-500 font-mono">counselor / counselor123</div>
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="inst-card p-6 space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="staff-username" className="block text-xs font-semibold text-slate-700 mb-1">
              Staff ID or Username
            </label>
            <div className="relative">
              <input
                id="staff-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or medic"
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="staff-password" className="block text-xs font-semibold text-slate-700 mb-1">
              Security Password
            </label>
            <div className="relative">
              <input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-forest w-full py-2.5 text-xs font-bold shadow-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Sign In to Incident Console</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          Student or visitor reporting an emergency?{' '}
          <Link to="/report" className="text-[#18392b] font-semibold hover:underline">
            File Public Report
          </Link>
        </div>
      </div>

    </div>
  );
};
