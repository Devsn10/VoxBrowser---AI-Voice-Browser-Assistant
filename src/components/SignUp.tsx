import React, { useState, useEffect } from "react";
import { Mic, Activity, Info } from "lucide-react";
import { AudioAssistant } from "../utils/audioAssistant";

interface SignUpProps {
  onSuccess: (profile: { firstName: string; lastName: string; username: string }) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUp({ onSuccess, onNavigateToSignIn }: SignUpProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Single Sign On Verification flows
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleVerifying, setGoogleVerifying] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState("");

  useEffect(() => {
    AudioAssistant.speak("Please register your Vox Browser profile to access high-speed dictation assistance.");
  }, []);

  const handleGoogleSignUp = () => {
    AudioAssistant.playBeep("click");
    AudioAssistant.speak("Opening Google single sign up verification panel.");
    setShowGoogleChooser(true);
  };

  const handleConfirmGoogleAccount = (confirmedEmail: string) => {
    setGoogleVerifying(true);
    setSelectedGoogleEmail(confirmedEmail);
    AudioAssistant.playBeep("click");
    AudioAssistant.speak(`Verifying registration credentials with Google identity service.`);
    
    setTimeout(() => {
      setGoogleVerifying(false);
      setShowGoogleChooser(false);
      AudioAssistant.speak("Account verified. Creating your profile and redirecting.");
      
      const emailPrefix = confirmedEmail.split("@")[0] || "User";
      onSuccess({
        firstName: emailPrefix,
        lastName: "Google Auth",
        username: emailPrefix
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !password || !confirm) {
      setError("Please fill in all requested fields.");
      AudioAssistant.speak("Please complete all registration fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      AudioAssistant.speak("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");
    AudioAssistant.playBeep("success");

    setTimeout(() => {
      setLoading(false);
      AudioAssistant.speak(`Welcome, ${firstName}! Your account has has been initialized.`);
      onSuccess({ firstName, lastName, username });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Top tiny logo */}
      <header className="w-full bg-white dark:bg-slate-900 shadow-sm h-16 flex items-center px-6 md:px-12 sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Mic className="w-6 h-6 text-indigo-600 fill-indigo-600 animate-pulse" />
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg tracking-tight">
            VoxBrowser
          </span>
        </div>
      </header>

      {/* Main split display */}
      <main className="flex-grow flex items-center justify-center py-12 px-6 md:px-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Registration Field Card */}
          <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
                Create a VoxBrowser Account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Experience human-centric precision in every transcription.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name / Last Name split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    required
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    required
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Username Input with Domain styling prefix */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="username">
                  Username
                </label>
                <div className="relative flex items-center">
                  <input
                    id="username"
                    required
                    type="text"
                    placeholder="yourname"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full h-11 pl-4 pr-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                  />
                  <span className="absolute right-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    @voxbrowser.ai
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none pl-1">
                  You can use letters, numbers &amp; periods
                </p>
              </div>

              {/* Password split row */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400" htmlFor="confirm_password">
                      Confirm
                    </label>
                    <input
                      id="confirm_password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-1 select-none">
                  <input
                    id="show_password"
                    type="checkbox"
                    checked={showPassword}
                    onChange={e => {
                      AudioAssistant.playBeep("click");
                      setShowPassword(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="show_password" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                    Show password
                  </label>
                </div>
              </div>

              {/* Submit / Navigation buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    AudioAssistant.playBeep("click");
                    onNavigateToSignIn();
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline active:scale-95 transition-all"
                >
                  Sign in instead
                </a>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 h-11 rounded-full shadow-lg hover:shadow-indigo-600/15 disabled:opacity-75 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Registering..." : "Next"}
                </button>
              </div>

              {/* Google alternative */}
              <div className="flex items-center my-4 gap-3 select-none">
                <div className="flex-grow h-[1px] bg-slate-200 dark:bg-slate-800" />
                <span className="text-[11px] font-bold text-slate-400">OR</span>
                <div className="flex-grow h-[1px] bg-slate-200 dark:bg-slate-800" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full h-11 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-lg text-sm font-semibold flex items-center justify-center gap-2.5 text-slate-600 dark:text-slate-300 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg height="18" viewBox="0 0 24 24" width="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>

          {/* Right: Beautiful graphic design branding */}
          <section className="hidden lg:flex flex-col items-center justify-center pr-4">
            <div className="relative w-full max-w-sm aspect-square bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl flex items-center justify-center overflow-hidden border border-indigo-100/60 dark:border-indigo-900/40 shadow-sm">
              <div
                className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, #3525cd 1.5px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="z-10 text-center p-8 flex flex-col items-center">
                <div className="mb-6 inline-flex p-5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shadow-md animate-pulse">
                  <Activity className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  Crystal Clear Voice
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto font-medium">
                  Our state-of-the-art transcription engine ensures your recordings are processed with 99.9% accuracy.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Basic Footer links */}
      <footer className="w-full p-6 flex flex-wrap justify-center gap-x-6 gap-y-2 py-6 border-t border-slate-200/40 dark:border-slate-800 text-xs">
        <a href="#" className="font-medium text-slate-400 hover:text-slate-600 transition-colors">
          Help
        </a>
        <a href="#" className="font-medium text-slate-400 hover:text-slate-600 transition-colors">
          Privacy
        </a>
        <a href="#" className="font-medium text-slate-400 hover:text-slate-600 transition-colors">
          Terms
        </a>
      </footer>

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
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Sign up with Google</h3>
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
                  Cancel Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
