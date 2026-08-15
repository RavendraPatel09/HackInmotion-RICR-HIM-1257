import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/ui/Toast';
import { authApi } from '../services/api';
import { INDIAN_LOCATIONS } from '../data/locations';
import logoImg from '../assets/logo.png';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
<<<<<<< HEAD
  Sparkles, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  X,
  Phone,
  Key,
  Timer,
  RefreshCw,
  Info
=======
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
<<<<<<< HEAD
  const { user, isAuthenticated, loginWithCredentials, registerWithCredentials, logout } = useAuth();
  const { issues } = useIssues();
=======
  const { user, isAuthenticated, loginCustom, logout } = useAuth();
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
  const navigate = useNavigate();

  // Tab State: 'signin' | 'register'
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'admin'>('citizen');
<<<<<<< HEAD

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Register Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  
  // Cascading Location Selectors for Register
  const [regState, setRegState] = useState<string>('Maharashtra');
  const [regCity, setRegCity] = useState<string>('Pune');
  const [regWardId, setRegWardId] = useState<string>('pne-ward-01');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // OTP Verification Modal States
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);

  // Derived location lists
  const availableStates = useMemo(() => {
    return Array.from(new Set(INDIAN_LOCATIONS.map((c) => c.state)));
  }, []);

  const availableCities = useMemo(() => {
    return INDIAN_LOCATIONS.filter((c) => c.state === regState);
  }, [regState]);

  const availableWards = useMemo(() => {
    const matchedCity = INDIAN_LOCATIONS.find(
      (c) => c.state === regState && c.name.toLowerCase() === regCity.toLowerCase()
    );
    return matchedCity ? matchedCity.wards : [];
  }, [regState, regCity]);

  // Sync cities and wards on state change
  useEffect(() => {
    if (availableCities.length > 0) {
      setRegCity(availableCities[0].name);
    }
  }, [regState, availableCities]);

  useEffect(() => {
    if (availableWards.length > 0) {
      setRegWardId(availableWards[0].id);
    }
  }, [regCity, availableWards]);

  // Resend OTP Cooldown Timer Hook
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateEmail = (val: string): boolean => {
    if (!val) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const validatePassword = (val: string): boolean => {
    if (!val) return false;
    return val.length >= 6;
  };

  // Submit Sign In Form
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(loginEmail);
    const isPasswordValid = validatePassword(loginPassword);

    if (!isEmailValid || !isPasswordValid) {
      showToast('Please enter a valid email and minimum 6-character password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginWithCredentials(loginEmail, loginPassword);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      navigate(data.user.role === 'admin' ? '/admin' : '/citizen');
    } catch (err: any) {
      if (err.message && err.message.includes('not verified')) {
        showToast('Please complete email verification first.', 'warning');
        setOtpEmail(loginEmail);
        setShowOtpModal(true);
        try {
          await authApi.sendOtp(loginEmail, 'verification');
          setOtpTimer(60);
        } catch (sendErr: any) {
          console.error(sendErr);
        }
      } else {
        showToast(err.message || 'Incorrect credentials', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Register Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    const isEmailValid = validateEmail(regEmail);
    const isPasswordValid = validatePassword(regPassword);
    if (!isEmailValid || !isPasswordValid) {
      showToast('Please enter a valid email and 6+ character password', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }

=======
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDemoLogin = () => {
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
    setIsLoading(true);
    try {
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: selectedRole,
        phone: regPhone || undefined,
        ward_id: regWardId,
        avatar: selectedRole === 'citizen'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      };

      await registerWithCredentials(payload);
      showToast('Registration successful! Verification code sent to your email.', 'success');
      setOtpEmail(regEmail);
      setShowOtpModal(true);
      setOtpTimer(60);
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Action
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanOtp = otpCode.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      showToast('Please enter a valid 6-digit verification code.', 'warning');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await authApi.verifyOtp(otpEmail, cleanOtp, 'verification');
      showToast('Email verified successfully! You can now log in.', 'success');
      setShowOtpModal(false);
      setAuthTab('signin');
      setLoginEmail(otpEmail);
      setLoginPassword('');
    } catch (err: any) {
      showToast(err.message || 'Invalid OTP code. Please verify and try again.', 'error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    try {
      await authApi.resendOtp(otpEmail);
      showToast('Verification code resent to your email address.', 'success');
      setOtpTimer(60);
    } catch (err: any) {
      showToast(err.message || 'Failed to resend code.', 'error');
    }
  };

  // Quick Switch demo login bypass for fast hackathon judging evaluation
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const demoEmail = selectedRole === 'citizen' ? 'citizen@nagarsathi.demo' : 'admin@nagarsathi.demo';
      const data = await loginWithCredentials(demoEmail, 'password123');
      showToast(`Logged in as demo ${selectedRole}!`, 'success');
      navigate(data.user.role === 'admin' ? '/admin' : '/citizen');
    } catch (err: any) {
      try {
        const payload = {
          name: selectedRole === 'citizen' ? 'Citizen Demo' : 'Admin Demo',
          email: selectedRole === 'citizen' ? 'citizen@nagarsathi.demo' : 'admin@nagarsathi.demo',
          password: 'password123',
          role: selectedRole,
          ward_id: 'pne-ward-01',
          is_verified: true
        };
        await authApi.register(payload);
        await authApi.verifyOtp(payload.email, '000000', 'verification').catch(() => {});
        const data = await loginWithCredentials(payload.email, 'password123');
        showToast(`Demo account auto-provisioned!`, 'success');
        navigate(data.user.role === 'admin' ? '/admin' : '/citizen');
      } catch (innerErr: any) {
        showToast(innerErr.message || 'Demo credentials failed.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen w-full grid place-items-center bg-cf-bg px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
          className="bg-white dark:bg-[#0e1714] p-8 rounded-3xl space-y-6 text-center shadow-xl border border-[#D6E2DE] dark:border-[#1e332f]"
=======
          className="glass-card p-10 rounded-2xl max-w-md w-full space-y-8 text-center"
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
        >
          <div className="w-16 h-16 rounded-full bg-cf-success-light text-cf-success mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

<<<<<<< HEAD
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#10201C] dark:text-[#f2f7f5]">You are signed in</h2>
            <p className="text-xs text-[#73827D] dark:text-[#a3c4b9]">
              Authenticated as <strong className="text-[#10201C] dark:text-[#f2f7f5]">{user.name}</strong> ({user.role})
=======
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">You are signed in</h2>
            <p className="text-sm text-slate-500 font-medium">
              Authenticated as <strong className="text-slate-900">{user.name}</strong> ({user.role})
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin' : '/citizen')}
<<<<<<< HEAD
              className="w-full py-3.5 rounded-2xl bg-[#053229] hover:bg-[#07483A] text-white font-extrabold text-xs shadow-lg shadow-[#053229]/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
=======
              className="w-full py-3.5 rounded-xl bg-cf-primary-500 hover:bg-cf-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            >
              Continue to {user.role === 'admin' ? 'Admin Center' : 'Citizen Workspace'} <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => logout()}
<<<<<<< HEAD
              className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] hover:bg-slate-200 text-[#10201C] dark:text-[#f2f7f5] font-extrabold text-xs transition-colors"
=======
              className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            >
              Switch Account / Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
        
        {/* Left Panel — Civic Brand Identity & Map Visual */}
=======
    <div className="min-h-screen w-full grid place-items-center px-4 bg-cf-bg">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Side: Branding */}
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 hidden lg:block"
        >
<<<<<<< HEAD
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F1EE] dark:bg-[#152420] border border-[#BFD5CE] dark:border-[#1e332f] text-[#053229] dark:text-[#0ca688] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>NagarSathi Municipal Gateway</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
=======
          <div className="space-y-6">
            <div className="flex items-center gap-4">
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
              <img
                src={logoImg}
                alt="NagarSathi Logo"
                className="w-16 h-16 object-contain rounded-full shadow-sm"
              />
<<<<<<< HEAD
              <h1 className="text-4xl font-black tracking-tight text-[#10201C] dark:text-[#f2f7f5]">
                Nagar<span className="text-[#053229] dark:text-[#0ca688]">Sathi</span>
              </h1>
            </div>
            <p className="text-2xl font-black text-[#10201C] dark:text-[#f2f7f5] leading-snug">
              Report it. Track it. Fix it.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#536761] dark:text-[#a3c4b9] leading-relaxed font-semibold">
            Together, we can make everyday city problems visible, actionable, and verifiable across Indian municipal zones.
          </p>

          <div className="relative rounded-3xl overflow-hidden border border-[#D6E2DE] dark:border-[#1e332f] p-2 bg-white dark:bg-[#0e1714] shadow-md">
            <CityMap issues={issues.slice(0, 6)} className="h-56 w-full rounded-2xl overflow-hidden" />
          </div>
        </motion.div>

        {/* Right Panel — Credentials Forms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 w-full max-w-lg mx-auto"
        >
          <div className="bg-white dark:bg-[#0e1714] p-5 sm:p-8 rounded-3xl border border-[#D6E2DE] dark:border-[#1e332f] shadow-xl space-y-6">
            
            {/* Header with Switch Tabs */}
            <div className="flex items-center justify-between border-b border-[#D6E2DE] dark:border-[#1e332f] pb-4">
              <div>
                <h2 className="text-xl font-black text-[#10201C] dark:text-[#f2f7f5]">
                  {authTab === 'signin' ? 'Welcome back' : 'Create Account'}
                </h2>
                <p className="text-[11px] text-[#73827D] dark:text-[#a3c4b9] font-bold">
                  {authTab === 'signin' ? 'Sign in to access your city feed' : 'Register details to report issues'}
                </p>
              </div>

              <div className="flex bg-[#F1F7F5] dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] rounded-xl p-1 text-[11px] font-black uppercase">
                <button
                  onClick={() => setAuthTab('signin')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    authTab === 'signin' ? 'bg-[#053229] text-white shadow-xs' : 'text-[#536761] dark:text-[#a3c4b9] hover:text-[#10201C]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthTab('register')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    authTab === 'register' ? 'bg-[#053229] text-white shadow-xs' : 'text-[#536761] dark:text-[#a3c4b9] hover:text-[#10201C]'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Role Preset Selector Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedRole('citizen')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                  selectedRole === 'citizen'
                    ? 'bg-[#E6F1EE] dark:bg-[#142e2a] border-[#07483A] dark:border-[#0ca688]'
                    : 'bg-slate-50 dark:bg-[#152420] border-[#D6E2DE] dark:border-[#1e332f] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#053229]/10 text-[#053229] dark:text-[#0ca688] flex items-center justify-center font-bold">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  {selectedRole === 'citizen' && <CheckCircle2 className="w-4 h-4 text-[#053229] dark:text-[#0ca688]" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#10201C] dark:text-[#f2f7f5]">Citizen</h4>
                  <p className="text-[9px] text-[#73827D] dark:text-[#a3c4b9]">Report &amp; Track</p>
                </div>
              </div>
=======
              <h1 className="text-5xl font-black tracking-tight text-slate-900">
                Nagar<span className="text-cf-primary-500">Sathi</span>
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 leading-snug">
              Your City. Your Voice. Your Change.
            </h2>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-md">
            Report civic issues, track resolutions, and stay connected with the people and services shaping your city.
          </p>
        </motion.div>

        {/* Right Side: Login Box */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass-card p-8 sm:p-10 space-y-8">
            
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="block lg:hidden text-center space-y-4 mb-6">
              <img
                src={logoImg}
                alt="NagarSathi Logo"
                className="w-12 h-12 object-contain rounded-full shadow-sm mx-auto"
              />
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Nagar<span className="text-cf-primary-500">Sathi</span>
              </h1>
            </div>

            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900">Welcome to Nagar Sathi</h2>
              <p className="text-sm text-slate-500 font-medium">
                Select how you want to continue
              </p>
            </div>

            {/* Persona Selection */}
            <div className="space-y-4">
              {/* Citizen Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('citizen')}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  selectedRole === 'citizen'
                    ? 'border-cf-primary-500 bg-cf-primary-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedRole === 'citizen' ? 'bg-cf-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold ${selectedRole === 'citizen' ? 'text-cf-primary-600' : 'text-slate-900'}`}>
                      Citizen
                    </h3>
                    {selectedRole === 'citizen' && <CheckCircle2 className="w-5 h-5 text-cf-primary-500" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Report local issues, track complaints, and stay informed about your neighbourhood.
                  </p>
                </div>
              </button>
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)

              {/* Administrator Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
<<<<<<< HEAD
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500'
                    : 'bg-slate-50 dark:bg-[#152420] border-[#D6E2DE] dark:border-[#1e332f] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </span>
                  {selectedRole === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#10201C] dark:text-[#f2f7f5]">Municipal Admin</h4>
                  <p className="text-[9px] text-[#73827D] dark:text-[#a3c4b9]">Manage &amp; Resolve</p>
                </div>
              </div>
            </div>

            {/* ==================== SIGN IN FORM ==================== */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="citizen@nagarsathi.gov.in"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-[#053229] hover:bg-[#07483A] text-white font-extrabold text-xs shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ==================== REGISTER FORM ==================== */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Aniket Patil"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="aniket@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">Phone Number (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 9999999999"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-semibold focus:outline-none focus:border-[#053229]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">State Region</label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-bold focus:outline-none"
                    >
                      {availableStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">City / Town</label>
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-bold focus:outline-none"
                    >
                      {availableCities.map((ct) => (
                        <option key={ct.name} value={ct.name}>{ct.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-600 dark:text-slate-400 font-black">Ward Locality</label>
                    <select
                      value={regWardId}
                      onChange={(e) => setRegWardId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] text-xs font-bold focus:outline-none"
                    >
                      {availableWards.map((wd) => (
                        <option key={wd.id} value={wd.id}>{wd.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-[#053229] hover:bg-[#07483A] text-white font-extrabold text-xs shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Demo Bypass Area */}
            <div className="border-t border-[#D6E2DE] dark:border-[#1e332f] pt-5 space-y-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl font-extrabold text-xs bg-[#F1F7F5] dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] hover:bg-slate-200 text-[#10201C] dark:text-[#f2f7f5] flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
              >
                🎯 Direct Hackathon Evaluation Access
              </button>

              <div className="text-center text-[10px] text-[#73827D] dark:text-[#a3c4b9] font-bold">
                * Note: Evaluators can click the above button to bypass live OTP inbox check during testing.
              </div>
=======
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  selectedRole === 'admin'
                    ? 'border-cf-primary-500 bg-cf-primary-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedRole === 'admin' ? 'bg-cf-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold ${selectedRole === 'admin' ? 'text-cf-primary-600' : 'text-slate-900'}`}>
                      Municipal Administrator
                    </h3>
                    {selectedRole === 'admin' && <CheckCircle2 className="w-5 h-5 text-cf-primary-500" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Manage civic issues, monitor service performance, and coordinate resolutions.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-sm bg-cf-primary-500 hover:bg-cf-primary-600 text-white shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Continue as {selectedRole === 'citizen' ? 'Citizen' : 'Administrator'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
            </div>

          </div>
        </motion.div>
      </div>

      {/* ==================== OTP VERIFICATION MODAL OVERLAY ==================== */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-[#10201C] dark:text-[#f2f7f5]"
            >
              <div className="flex items-center justify-between border-b border-[#D6E2DE] dark:border-[#1e332f] pb-3">
                <h3 className="text-base font-black flex items-center gap-2 text-[#053229] dark:text-[#0ca688]">
                  <Key className="w-5 h-5 text-[#053229] dark:text-[#0ca688] animate-pulse" /> Verify Your Email
                </h3>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#152420] text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-[#E6F1EE] dark:bg-[#142e2a] border border-[#BFD5CE] dark:border-[#1e332f] rounded-2xl flex gap-3 text-xs leading-relaxed text-[#053229] dark:text-[#0ca688] font-semibold">
                <Info className="w-5 h-5 text-[#053229] dark:text-[#0ca688] shrink-0 mt-0.5" />
                <div>
                  We sent a 6-digit verification code to: <strong className="text-[#10201C] dark:text-white">{otpEmail}</strong>.
                  Enter the code below to complete account activation.
                </div>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl border border-[#D6E2DE] dark:border-[#1e332f] bg-slate-50 dark:bg-[#152420] text-[#10201C] dark:text-[#f2f7f5] focus:outline-none focus:border-[#053229]"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-[#053229] dark:text-[#0ca688]" />
                    <span>Resend: {otpTimer > 0 ? `${otpTimer}s` : 'Available'}</span>
                  </div>

                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={handleResendOtp}
                    className={`flex items-center gap-1 uppercase hover:underline ${
                      otpTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-[#053229] dark:text-[#0ca688]'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${otpTimer > 0 ? '' : 'animate-spin-slow'}`} />
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full py-3 rounded-xl bg-[#053229] hover:bg-[#07483A] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Verification Code'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
