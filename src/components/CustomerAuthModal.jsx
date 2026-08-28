import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { customerSignIn, customerSignUp } from "../services/authService";

export default function CustomerAuthModal({ isOpen, onClose, onSuccess, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const user = await customerSignIn(email, password);
      setIsLoading(false);
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || "Sign in failed.");
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const user = await customerSignUp({ name, email, phone, password });
      setIsLoading(false);
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || "Sign up failed.");
    }
  };

  const handleQuickDemoCustomer = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const user = await customerSignIn("rohit@example.com", "customer123");
      setIsLoading(false);
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-background-card border border-white/15 rounded-sm shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 bg-background-darker border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-coffee-400 bg-background-card flex items-center justify-center text-coffee-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-cream-100 uppercase tracking-wide">
                {mode === "signin" ? "Customer Sign In" : "Create Account"}
              </h3>
              <p className="text-[11px] text-muted font-sans">
                {mode === "signin"
                  ? "Access your bookings & faster checkout"
                  : "Join Duplex Lounge Cafe perks & rewards"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-cream-100 hover:bg-white/10 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="grid grid-cols-2 p-1.5 bg-background-darker/60 border-b border-white/5 font-sans">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg("");
            }}
            className={`py-2 text-xs uppercase tracking-widest font-bold transition-all rounded-sm ${
              mode === "signin"
                ? "bg-coffee-400 text-background-darker shadow-sm"
                : "text-muted hover:text-cream-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            className={`py-2 text-xs uppercase tracking-widest font-bold transition-all rounded-sm ${
              mode === "signup"
                ? "bg-coffee-400 text-background-darker shadow-sm"
                : "text-muted hover:text-cream-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans">
          
          {errorMsg && (
            <div className="p-3 rounded-sm bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohit@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3 py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-10 py-3 rounded-sm outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 disabled:opacity-40 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md mt-2"
              >
                <span>{isLoading ? "Signing In..." : "Sign In To Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Deshmukh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3 py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98201 45678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3 py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohit@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-3 py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-light mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background-darker border border-white/15 focus:border-coffee-400 text-cream-100 text-xs pl-10 pr-10 py-3 rounded-sm outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-coffee-400 hover:bg-coffee-500 disabled:opacity-40 text-background-darker font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all shadow-md mt-2"
              >
                <span>{isLoading ? "Creating Account..." : "Create Account & Join"}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Customer 1-Click Login */}
          <div className="pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-sm bg-white/5 hover:bg-coffee-500/20 border border-coffee-500/30 text-coffee-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-coffee-400" />
              <span>1-Click Demo Login (Rohit Deshmukh)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
