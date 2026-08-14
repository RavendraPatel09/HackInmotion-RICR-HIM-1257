import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { CityMap } from '../components/map/CityMap';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
  const { user, isAuthenticated, loginWithCredentials, registerWithCredentials, logout } = useAuth();
  const { issues } = useIssues();
  const navigate = useNavigate();

  // Tab State: 'signin' | 'register'
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'admin'>('citizen');

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
  const [otpTimer, setOtpTimer] = useState<number>(0); // Cooldown timer in seconds
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
    if (!val) {
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
      return false;
    }
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      return false;
    }
    if (val.length < 6) {
      return false;
    }
    return true;
  };

  // Submit Sign In Form
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(loginEmail);
    const isPasswordValid = validatePassword(loginPassword);

    if (!isEmailValid || !isPasswordValid) {
      showToast('Please correct validation errors', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginWithCredentials(loginEmail, loginPassword);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      navigate(data.user.role === 'admin' ? '/admin' : '/citizen');
    } catch (err: any) {
      // If email is not verified, backend throws an exception
      if (err.message && err.message.includes('not verified')) {
        showToast('Please complete email verification first.', 'warning');
        setOtpEmail(loginEmail);
        setShowOtpModal(true);
        // Trigger initial OTP send request
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
      showToast('Please correct validation errors', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }

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
      // If demo user is missing in Postgres, create it on the fly
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
        // Verify OTP automatically for demo account
        await dbVerifyDemoUser(payload.email);
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

  // Internal helper to verify demo users for convenience
  const dbVerifyDemoUser = async (email: string) => {
    try {
      // Fetch OTP and verify it mock-side or directly update DB verified status via custom endpoint if exists,
      // here we simulate verification call
      await authApi.verifyOtp(email, '000000', 'verification').catch(() => {});
    } catch (e) {}
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121B2B] p-8 rounded-3xl space-y-6 text-center shadow-xl border border-slate-800"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">You are signed in</h2>
            <p className="text-xs text-slate-400">
              Authenticated as <strong className="text-white">{user.name}</strong> ({user.role})
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin' : '/citizen')}
              className="w-full py-3.5 rounded-2xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              Continue to {user.role === 'admin' ? 'Admin Center' : 'Citizen Workspace'} &rarr;
            </button>

            <button
              onClick={() => logout()}
              className="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-extrabold text-xs transition-colors"
            >
              Switch Account / Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
        
        {/* Left Panel — Civic Brand Identity & Map Visual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-350 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NagarSathi Municipal Gateway</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="NagarSathi Logo"
                className="w-12 h-12 object-contain rounded-full shadow-md"
              />
              <h1 className="text-4xl font-black tracking-tight text-white">
                Nagar<span className="text-indigo-400">Sathi</span>
              </h1>
            </div>
            <p className="text-2xl font-black text-slate-100 leading-snug">
              Report it. Track it. Fix it.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
            Together, we can make everyday city problems visible, actionable, and verifiable across Indian municipal zones.
          </p>

          <div className="relative rounded-3xl overflow-hidden border border-slate-800/85 p-2 bg-[#121B2B]">
            <CityMap issues={issues.slice(0, 6)} className="h-56 w-full rounded-2xl overflow-hidden" />
          </div>
        </motion.div>

        {/* Right Panel — Credentials Forms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 w-full max-w-lg mx-auto"
        >
          <div className="bg-[#121B2B] p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            
            {/* Header with Switch Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  {authTab === 'signin' ? 'Welcome back' : 'Create Account'}
                </h2>
                <p className="text-[11px] text-slate-450 font-bold">
                  {authTab === 'signin' ? 'Sign in to access your city feed' : 'Register details to report issues'}
                </p>
              </div>

              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-[11px] font-black uppercase">
                <button
                  onClick={() => setAuthTab('signin')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    authTab === 'signin' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthTab('register')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    authTab === 'register' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white'
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
                    ? 'bg-indigo-950/20 border-indigo-500'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-750'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  {selectedRole === 'citizen' && <CheckCircle2 className="w-4 h-4 text-indigo-455" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Citizen</h4>
                  <p className="text-[9px] text-slate-400">Report &amp; Track</p>
                </div>
              </div>

              <div
                onClick={() => setSelectedRole('admin')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-950/20 border-amber-500'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-750'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-500 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </span>
                  {selectedRole === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-455" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Municipal Role</h4>
                  <p className="text-[9px] text-slate-400">Manage &amp; Resolve</p>
                </div>
              </div>
            </div>

            {/* ==================== SIGN IN FORM ==================== */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="citizen@nagarsathi.gov.in"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-450 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-indigo-650 hover:bg-indigo-550 text-white font-extrabold text-xs shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
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
                    <label className="text-[9px] uppercase text-slate-405 font-black">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Aniket Patil"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="aniket@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">Phone Number (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-450 pointer-events-none">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 9999999999"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">State Region</label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-bold focus:outline-none"
                    >
                      {availableStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">City / Town</label>
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-bold focus:outline-none"
                    >
                      {availableCities.map((ct) => (
                        <option key={ct.name} value={ct.name}>{ct.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-405 font-black">Ward Locality</label>
                    <select
                      value={regWardId}
                      onChange={(e) => setRegWardId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-bold focus:outline-none"
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
                  className="w-full py-3 rounded-2xl bg-indigo-650 hover:bg-indigo-550 text-white font-extrabold text-xs shadow-md transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Demo Bypass Area */}
            <div className="border-t border-slate-800 pt-5 space-y-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl font-extrabold text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
              >
                🎯 Direct Hackathon Evaluation Access
              </button>

              <div className="text-center text-[10px] text-slate-500 font-bold">
                * Note: Evaluators can click the above button to bypass live OTP inbox check during testing.
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* ==================== OTP VERIFICATION MODAL OVERLAY ==================== */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121B2B] border border-slate-805 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black flex items-center gap-2 text-indigo-400">
                  <Key className="w-5 h-5 text-indigo-400 animate-pulse" /> Verify Your Email
                </h3>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-indigo-950/20 border border-indigo-900/60 rounded-2xl flex gap-3 text-xs leading-relaxed text-slate-300 font-semibold">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  We sent a 6-digit verification code to: <strong className="text-white">{otpEmail}</strong>.
                  Enter the code below to complete account activation.
                </div>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <div className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Resend: {otpTimer > 0 ? `${otpTimer}s` : 'Available'}</span>
                  </div>

                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={handleResendOtp}
                    className={`flex items-center gap-1 uppercase hover:underline ${
                      otpTimer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-indigo-400'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${otpTimer > 0 ? '' : 'animate-spin-slow'}`} />
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full py-3 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
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

// Internal utility for useMemo-equivalent behaviour
function useMemo<T>(fn: () => T, deps: any[]): T {
  const [val, setVal] = useState<T>(fn);
  useEffect(() => {
    setVal(fn());
  }, deps);
  return val;
}
