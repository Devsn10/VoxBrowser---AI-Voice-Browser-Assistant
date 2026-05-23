import React, { useState, useEffect } from "react";
import { Mic, Eye, EyeOff, ArrowRight, Info } from "lucide-react";
import { AudioAssistant } from "../utils/audioAssistant";

interface SignInProps {
  onSuccess: (email: string) => void;
  onNavigateToSignUp: () => void;
}

export default function SignIn({ onSuccess, onNavigateToSignUp }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Single Sign On Verification flows
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleVerifying, setGoogleVerifying] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState("");

  useEffect(() => {
    // Say a quick welcoming subtitle if spoken feedback is enabled
    AudioAssistant.speak("Welcome to VoxBrowser. Please sign in to resume your session.");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      AudioAssistant.speak("Please enter your email and password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      AudioAssistant.speak("Password is too short.");
      return;
    }

    setLoading(true);
    setError("");
    AudioAssistant.playBeep("success");

    setTimeout(() => {
      setLoading(false);
      // Success acknowledgement
      AudioAssistant.speak(`Successfully signed in as ${email.split("@")[0]}. Initializing dashboard.`);
      onSuccess(email);
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    AudioAssistant.playBeep("click");
    AudioAssistant.speak("Opening Google single sign on verification panel.");
    setShowGoogleChooser(true);
  };

  const handleConfirmGoogleAccount = (confirmedEmail: string) => {
    setGoogleVerifying(true);
    setSelectedGoogleEmail(confirmedEmail);
    AudioAssistant.playBeep("click");
    AudioAssistant.speak(`Verifying credentials with Google identity service.`);
    
    setTimeout(() => {
      setGoogleVerifying(false);
      setShowGoogleChooser(false);
      AudioAssistant.speak("Identity checked. Redirecting to application dashboard.");
      onSuccess(confirmedEmail);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center relative overflow-x-hidden p-6">
      {/* Decorative gradients */}
      <div className="fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[45rem] h-[45rem] bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md">
        {/* Brand Banner */}
        <header className="w-full mb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30 animate-pulse">
            <Mic className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            VoxBrowser
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Human-Centric Precision Transcription
          </p>
        </header>

        {/* glass-card Sign In container */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            Welcome back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="password">
                  Password
                </label>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    AudioAssistant.speak("Please reset your password via the mail support link.");
                    alert("A demo password reset link is simulate on the console.");
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs tracking-tight"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-4 pr-10 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 leading-snug">
                <Info className="w-3.5 h-3.5" />
                Minimum 8 characters with one special symbol
              </p>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg font-semibold text-sm mt-2 shadow-md hover:shadow-indigo-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 gap-3">
            <div className="flex-grow h-[1px] bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-bold text-slate-400">OR</span>
            <div className="flex-grow h-[1px] bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Social Google log-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-11 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-lg text-sm font-semibold flex items-center justify-center gap-2.5 text-slate-600 dark:text-slate-300 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <svg height="18" viewBox="0 0 24 24" width="18">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer Navigation link */}
        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500 dark:text-slate-400">
            New to VoxBrowser?{" "}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                AudioAssistant.playBeep("click");
                onNavigateToSignUp();
              }}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>

      {showGoogleChooser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
            {/* Google "G" Logo */}
            <div className="flex flex-col items-center text-center mb-5 select-none">
              <svg height="24" viewBox="0 0 24 24" width="24" className="mb-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Sign in with Google</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">Choose an account to continue to VoxBrowser</p>
            </div>

            {googleVerifying ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse text-center leading-relaxed">
                  Verifying credential checks with Google keyring...<br />
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{selectedGoogleEmail}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 mb-5">
                {/* Main Account 1 (matches user's real email) */}
                <button
                  type="button"
                  onClick={() => handleConfirmGoogleAccount("22co73@aitdgoa.edu.in")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-indigo-100 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-600 select-none">
                      U
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">22co73 (Active Profile)</span>
                      <span className="text-[10px] text-slate-400 font-bold">22co73@aitdgoa.edu.in</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-extrabold uppercase px-2 py-0.5 rounded-full group-hover:bg-indigo-100 transition-colors">
                    Active
                  </span>
                </button>

                {/* Account 2 */}
                <button
                  type="button"
                  onClick={() => handleConfirmGoogleAccount("guest.vox@gmail.com")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-indigo-100 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-600 select-none">
                      G
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Guest Persona</span>
                      <span className="text-[10px] text-slate-400 font-bold">guest.vox@gmail.com</span>
                    </div>
                  </div>
                </button>

                {/* Add account option */}
                <button
                  type="button"
                  onClick={() => {
                    AudioAssistant.playBeep("click");
                    const customEmail = prompt("Enter another Google Account Email:") || "";
                    if (customEmail.trim() && customEmail.includes("@")) {
                      handleConfirmGoogleAccount(customEmail.trim());
                    }
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all cursor-pointer"
                >
                  + Use another Google account
                </button>
              </div>
            )}

            {/* Disclaimers & Cancel button */}
            <div className="mt-4 border-t border-slate-100 dark:border-slate-805 pt-4 flex flex-col gap-3">
              <p className="text-[10px] leading-relaxed text-slate-450 dark:text-slate-500 font-semibold select-none">
                To continue, Google will share your name, email address, language preference, and profile picture with <strong>VoxBrowser</strong>. Please check our Identity verification rules.
              </p>
              {!googleVerifying && (
                <button
                  type="button"
                  onClick={() => {
                    AudioAssistant.playBeep("click");
                    setShowGoogleChooser(false);
                  }}
                  className="w-full text-center py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-305 transition-all cursor-pointer"
                >
                  Cancel Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
