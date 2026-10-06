import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function LoginPage() {
  const { login, authLoading } = useAuth();
  const { navigate } = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  function validate() {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError('');

    const validationErrs = validate();
    if (Object.keys(validationErrs).length > 0) {
      setErrors(validationErrs);
      return;
    }

    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  }

  function fillDemoCredentials() {
    setFormData({
      email: 'alex.morgan@gupio.dev',
      password: 'password123',
      rememberMe: true,
    });
    setErrors({});
    setGeneralError('');
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) return;
    setForgotSent(true);
  }

  return (
    <div className="auth-page-container">
      {/* Left Branding / Hero Panel */}
      <div className="auth-hero-panel">
        <div className="auth-hero-brand">
          <div className="brand-logo-icon">
            <Sparkles size={24} className="text-brand-accent" />
          </div>
          <div>
            <h1 className="auth-brand-name">Gupio TaskHub</h1>
            <p className="auth-brand-subtitle">Productivity & Task Management</p>
          </div>
        </div>

        <div className="auth-hero-content">
          <span className="auth-tagline-badge">Campus Placement Assignment • Option 1</span>
          <h2 className="auth-hero-headline">
            Get more done. Stay organized.
          </h2>
          <p className="auth-hero-subtext">
            A modern, unified productivity workspace built to manage sprints, track deadlines, and organize your daily workflow.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="feature-check-icon">
                <CheckCircle2 size={18} className="text-emerald" />
              </div>
              <span className="feature-text">Smart task tracking</span>
            </div>

            <div className="auth-feature-item">
              <div className="feature-check-icon">
                <CheckCircle2 size={18} className="text-emerald" />
              </div>
              <span className="feature-text">Visual productivity insights</span>
            </div>

            <div className="auth-feature-item">
              <div className="feature-check-icon">
                <CheckCircle2 size={18} className="text-emerald" />
              </div>
              <span className="feature-text">Organized daily workflow</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          <ShieldCheck size={16} className="text-emerald" />
          <span>Demo Authentication • Safe Frontend Demonstration Layer</span>
        </div>
      </div>

      {/* Right Form Card Panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="demo-credentials-banner">
            <div className="demo-credentials-text">
              <span className="demo-pill">Demo Account</span>
              <code>alex.morgan@gupio.dev</code> / <code>password123</code>
            </div>
            <button
              type="button"
              className="btn-fill-demo"
              onClick={fillDemoCredentials}
            >
              Fill Credentials
            </button>
          </div>

          {generalError && (
            <div className="auth-alert-error" role="alert">
              <AlertCircle size={16} />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className={`form-input auth-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="login-password" className="form-label">
                  Password
                </label>
                <button
                  type="button"
                  className="auth-link-sm"
                  onClick={() => setForgotModalOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input auth-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="form-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-auth-submit"
              disabled={authLoading}
            >
              {authLoading ? (
                <span className="spinner-inline">Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <span>Don't have an account yet?</span>
            <button
              type="button"
              className="auth-link-bold"
              onClick={() => navigate('/signup')}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="modal-backdrop" onClick={() => setForgotModalOpen(false)}>
          <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Reset Password</h3>
            <p className="confirm-message">
              Enter your account email to receive a password recovery link.
            </p>
            {forgotSent ? (
              <div className="auth-alert-success">
                <CheckCircle2 size={16} />
                <span>Password reset instructions simulated to {forgotEmail}. Use password: <code>password123</code></span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="task-form" style={{ padding: '12px 0' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  autoFocus
                />
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                  Send Recovery Link
                </button>
              </form>
            )}
            <div className="confirm-actions" style={{ marginTop: '14px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSent(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
