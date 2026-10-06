import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function SignupPage() {
  const { signup, authLoading } = useAuth();
  const { navigate } = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Password strength calculation
  function calculateStrength(pwd) {
    if (!pwd) return { score: 0, label: 'None', color: 'slate' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: 'Medium', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  }

  const strength = calculateStrength(formData.password);

  function validate() {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms of service.';
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

    const res = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(res.error || 'Failed to create account.');
    }
  }

  return (
    <div className="auth-page-container">
      {/* Left Branding Panel */}
      <div className="auth-hero-panel">
        <div className="auth-hero-brand">
          <div className="brand-logo-icon">
            <Sparkles size={24} className="text-brand-accent" />
          </div>
          <div>
            <h1 className="auth-brand-name">Gupio TaskHub</h1>
            <p className="auth-brand-subtitle">Task Management Dashboard</p>
          </div>
        </div>

        <div className="auth-hero-content">
          <span className="auth-tagline-badge">New Workspace Registration</span>
          <h2 className="auth-hero-headline">
            Start organizing your engineering milestones today.
          </h2>
          <p className="auth-hero-subtext">
            Join thousands of developers prioritizing team sprints with real-time statistics, deadline tracking, and fluid Kanban layouts.
          </p>

          <div className="auth-benefits-box">
            <div className="benefit-row">
              <Check size={16} className="text-emerald" />
              <span>Full local data ownership & zero telemetry</span>
            </div>
            <div className="benefit-row">
              <Check size={16} className="text-emerald" />
              <span>Fluid Kanban board with drag-and-drop workflow</span>
            </div>
            <div className="benefit-row">
              <Check size={16} className="text-emerald" />
              <span>Interactive calendar with deadline highlights</span>
            </div>
            <div className="benefit-row">
              <Check size={16} className="text-emerald" />
              <span>Light and Dark mode support</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          <ShieldCheck size={16} className="text-emerald" />
          <span>Demo Authentication • Local Browser Persistence</span>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Get started with Gupio TaskHub in seconds</p>
          </div>

          {generalError && (
            <div className="auth-alert-error" role="alert">
              <AlertCircle size={16} />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  className={`form-input auth-input ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g., Alex Morgan"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  autoFocus
                />
              </div>
              {errors.name && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  className={`form-input auth-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="alex@company.com"
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

            {/* Password */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="signup-password" className="form-label">
                  Password
                </label>
                {formData.password && (
                  <span
                    className="password-strength-label"
                    style={{ color: strength.color }}
                  >
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input auth-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
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

              {/* Password strength progress bar */}
              {formData.password && (
                <div className="password-strength-bar-wrap">
                  <div
                    className="password-strength-bar"
                    style={{
                      width: `${(strength.score / 3) * 100}%`,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
              )}

              {errors.password && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="signup-confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                />
              </div>
              {errors.confirmPassword && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="form-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => {
                    setFormData({ ...formData, agreeTerms: e.target.checked });
                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
                  }}
                />
                <span>I agree to the terms of service & privacy policy</span>
              </label>
              {errors.agreeTerms && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.agreeTerms}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-auth-submit"
              disabled={authLoading}
            >
              {authLoading ? (
                <span className="spinner-inline">Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="auth-link-bold"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
