import React, { useState } from 'react';
import { Mail, Lock, User, Building2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Modal } from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState('Brand'); // 'Brand' | 'Influencer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, register } = useAuth();
  const { addToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        addToast('Welcome back to CollabSphere!', 'success');
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name or company name');
        }
        await register({ name, email, password, role });
        addToast(`Account created successfully as ${role}!`, 'success');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoFill(demoEmail, demoRole) {
    setEmail(demoEmail);
    setPassword('password123');
    setMode('login');
    setErrorMsg('');
    try {
      setIsSubmitting(true);
      await login(demoEmail, 'password123');
      addToast(`Logged in as demo ${demoRole}!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign in to CollabSphere' : 'Create your account'}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Toggle Mode Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Sign In Box */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Instant Demo Logins (No typing required)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('brand@auraglow.com', 'Brand (Aura Glow)')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-indigo-200 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50 text-left transition-colors"
            >
              🏢 Aura Glow <span className="block text-[10px] text-slate-400 font-normal">Brand Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('rhea@techverse.com', 'Creator (Rhea Sen)')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-[11px] font-semibold text-purple-700 hover:bg-purple-50 text-left transition-colors"
            >
              ✨ Rhea Sen <span className="block text-[10px] text-slate-400 font-normal">Tech Influencer</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Brand')}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'Brand'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Brand / Agency</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Influencer')}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'Influencer'
                        ? 'border-purple-600 bg-purple-50/50 text-purple-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Content Creator</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {role === 'Brand' ? 'Brand / Business Name' : 'Full Name / Creator Handle'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'Brand' ? 'e.g. Zen Organics' : 'e.g. Maya Patel'}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm shadow-indigo-100 flex items-center justify-center gap-2 disabled:bg-indigo-400 mt-2"
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : mode === 'login' ? (
              <>
                <span>Sign In to CollabSphere</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create {role} Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          By signing in, you agree to CollabSphere terms of service and influencer collaboration standards.
        </p>
      </div>
    </Modal>
  );
}

export default AuthModal;
