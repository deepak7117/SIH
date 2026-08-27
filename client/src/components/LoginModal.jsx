import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
  Lock,
  User,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  loginAdminApi,
  loginUserApi,
  registerUserApi,
  sendUserOtpApi,
  loginUserWithOtpApi
} from '../services/api';

export default function LoginModal({
  isOpen,
  onClose,
  userRole,
  setUserRole,
  onAdminLoginSuccess,
  onUserLoginSuccess
}) {
  // Modal Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  const [travelerLoginMethod, setTravelerLoginMethod] = useState('password'); // 'password' | 'otp'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpBanner, setDemoOtpBanner] = useState('');
  const [timer, setTimer] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Clear messages on mode switch
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
    setDemoOtpBanner('');
  };

  if (!isOpen) return null;

  // Handle Sending SMS OTP
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!phone || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number to receive SMS OTP.');
      return;
    }

    try {
      setIsOtpSending(true);
      const res = await sendUserOtpApi(phone.trim());
      setOtpSent(true);
      setTimer(60); // 60 seconds cooldown
      setSuccessMsg(`🚀 OTP generated and sent to Server terminal for +91 ${phone.trim()}!`);
      // Do not prefill OTP on web screen so user inputs from server
      setDemoOtpBanner('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send SMS OTP. Please try again.');
    } finally {
      setIsOtpSending(false);
    }
  };

  // Submit Handler for Admin, User Login, and User Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // --- 1. ADMIN LOGIN ---
    if (userRole === 'admin') {
      try {
        setIsLoading(true);
        const data = await loginAdminApi(email, password);
        onAdminLoginSuccess(data);
        onClose();
        resetForm();
      } catch (err) {
        setErrorMsg(err.message || 'Invalid admin credentials or unauthorized account.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // --- 2. TRAVELER SIGN UP ---
    if (authMode === 'register') {
      if (!name || !email || !password || !phone) {
        setErrorMsg('Please fill in all details (Name, Email, Phone, Password).');
        return;
      }
      if (!otp) {
        setErrorMsg('Please enter the 6-digit SMS verification OTP sent to your phone.');
        return;
      }

      try {
        setIsLoading(true);
        const user = await registerUserApi({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          otp: otp.trim(),
        });
        setSuccessMsg('Account registered & verified successfully!');
        if (onUserLoginSuccess) {
          onUserLoginSuccess(user);
        }
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1200);
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed. Please check your OTP and try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // --- 3. TRAVELER LOGIN (PASSWORD OR OTP) ---
    if (authMode === 'login') {
      try {
        setIsLoading(true);
        let user;
        if (travelerLoginMethod === 'password') {
          user = await loginUserApi(email, password);
        } else {
          if (!otp) {
            setErrorMsg('Please enter the OTP sent to your phone');
            setIsLoading(false);
            return;
          }
          user = await loginUserWithOtpApi(phone.trim(), otp.trim());
        }

        setSuccessMsg(`Welcome back, ${user.name}!`);
        if (onUserLoginSuccess) {
          onUserLoginSuccess(user);
        }
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1000);
      } catch (err) {
        setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setOtp('');
    setErrorMsg('');
    setSuccessMsg('');
    setDemoOtpBanner('');
    setOtpSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold tracking-wide">
            <Sparkles className="w-3 h-3" />
            <span>Incredible India Tourism Portal</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {userRole === 'admin'
              ? 'Administrator Login'
              : authMode === 'register'
              ? 'Create Traveler Account'
              : 'Traveler Log In'}
          </h3>
          <p className="text-xs text-slate-400">
            {userRole === 'admin'
              ? 'Enter master credentials for administrative database access'
              : authMode === 'register'
              ? 'Verify your phone via SMS OTP & save profile to MongoDB'
              : 'Log in to explore Nashik & manage your travel itinerary'}
          </p>
        </div>

        {/* Portal Role Switcher: Traveler vs Admin */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setUserRole('traveler');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              userRole === 'traveler'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Traveler Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUserRole('admin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              userRole === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Traveler Sub-Tabs: Sign In vs Sign Up */}
        {userRole === 'traveler' && (
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => switchAuthMode('login')}
              className={`flex-1 pb-2.5 text-center transition border-b-2 ${
                authMode === 'login'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode('register')}
              className={`flex-1 pb-2.5 text-center transition border-b-2 ${
                authMode === 'register'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up (SMS OTP)
            </button>
          </div>
        )}

        {/* Traveler Login Sub-option: Password vs SMS OTP */}
        {userRole === 'traveler' && authMode === 'login' && (
          <div className="flex justify-center gap-4 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setTravelerLoginMethod('password')}
              className={`hover:underline ${travelerLoginMethod === 'password' ? 'text-amber-400 font-bold' : ''}`}
            >
              • Email & Password
            </button>
            <button
              type="button"
              onClick={() => setTravelerLoginMethod('otp')}
              className={`hover:underline ${travelerLoginMethod === 'otp' ? 'text-amber-400 font-bold' : ''}`}
            >
              • SMS OTP Login
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Demo SMS OTP Banner */}
        {demoOtpBanner && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">SMS Dispatched:</span> OTP is{' '}
                <span className="font-mono font-black text-white text-sm bg-slate-950 px-2 py-0.5 rounded border border-amber-500/50">
                  {demoOtpBanner}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-amber-200/70 font-mono">10m valid</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. Name Field (Only on Traveler Registration) */}
          {userRole === 'traveler' && authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bhavin Shinde"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          )}

          {/* 2. Email Address / Phone (Admin login, Traveler Signup, Traveler Password Login) */}
          {(userRole === 'admin' ||
            (userRole === 'traveler' && (authMode === 'register' || travelerLoginMethod === 'password'))) && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {userRole === 'admin'
                  ? 'Admin Email Address'
                  : authMode === 'register'
                  ? 'Email Address'
                  : 'Email Address or Phone Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={userRole === 'admin' || authMode === 'register' ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    userRole === 'admin'
                      ? 'admin1@tourism.in'
                      : authMode === 'register'
                      ? 'traveler@example.com'
                      : 'traveler@example.com or 9876543210'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          )}

          {/* 3. Phone Number Field (Traveler Signup or OTP login) */}
          {userRole === 'traveler' && (authMode === 'register' || travelerLoginMethod === 'otp') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Phone Number (SMS)
                </label>
                <span className="text-[10px] text-amber-400 font-medium">India (+91)</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition font-mono tracking-wider"
                  />
                </div>
                <button
                  type="button"
                  disabled={isOtpSending || timer > 0 || phone.length < 10}
                  onClick={handleSendOtp}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-bold disabled:opacity-40 transition shrink-0 flex items-center gap-1.5"
                >
                  {isOtpSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : timer > 0 ? (
                    <span className="font-mono">{timer}s</span>
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 4. SMS OTP Input Field */}
          {userRole === 'traveler' && (authMode === 'register' || travelerLoginMethod === 'otp') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  6-Digit SMS OTP Verification Code
                </label>
                {otpSent && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> OTP Dispatched
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP (e.g. 842190)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition font-mono tracking-widest text-base"
                />
              </div>
            </div>
          )}

          {/* 5. Password Field (Admin login, Traveler Signup, Traveler Password Login) */}
          {(userRole === 'admin' ||
            (userRole === 'traveler' && (authMode === 'register' || travelerLoginMethod === 'password'))) && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing with MongoDB...</span>
              </>
            ) : (
              <>
                <span>
                  {userRole === 'admin'
                    ? 'Log In to Admin Panel'
                    : authMode === 'register'
                    ? 'Verify & Complete Registration'
                    : 'Log In to Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch for Traveler */}
        {userRole === 'traveler' && (
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
            {authMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthMode('register')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Sign Up with SMS OTP
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthMode('login')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Log In directly
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
