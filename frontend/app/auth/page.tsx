"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Step = "identifier" | "password" | "otp" | "register" | "verify_otp";

// ─────────────────────────────────────────────────────────────────────────────
// Animated left-panel illustration (SVG)
// ─────────────────────────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="gm-brand-panel">
      <div className="gm-brand-content">
        <div className="gm-brand-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.15)" />
            <path d="M9 18 Q18 8 27 18 Q18 28 9 18Z" fill="white" opacity="0.9" />
          </svg>
          <span>GLOWMART</span>
        </div>

        <div className="gm-brand-headline">
          <h1>Login</h1>
          <p>Get access to your Orders,<br />Wishlist &amp; Recommendations</p>
        </div>

        <div className="gm-brand-illustration" aria-hidden="true">
          {/* Laptop SVG */}
          <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Laptop body */}
            <rect x="30" y="20" width="160" height="100" rx="8" fill="white" fillOpacity="0.15" />
            <rect x="38" y="28" width="144" height="84" rx="4" fill="white" fillOpacity="0.25" />
            {/* Screen glow */}
            <rect x="42" y="32" width="136" height="76" rx="3" fill="white" fillOpacity="0.1" />
            {/* User icon on screen */}
            <circle cx="110" cy="60" r="14" fill="white" fillOpacity="0.6" />
            <circle cx="110" cy="54" r="6" fill="white" fillOpacity="0.9" />
            <path d="M96 72 Q110 64 124 72" stroke="white" strokeWidth="2.5" strokeLinecap="round" fillOpacity="0.9" fill="none" />
            {/* Laptop base */}
            <rect x="10" y="120" width="200" height="10" rx="5" fill="white" fillOpacity="0.2" />
            <rect x="70" y="118" width="80" height="4" rx="2" fill="white" fillOpacity="0.3" />
            {/* Floating badges */}
            <rect x="0" y="50" width="30" height="30" rx="6" fill="#FF6B6B" />
            <path d="M15 60 L12 65 L8 61 L12 59Z" fill="white" />
            <path d="M15 60 C15 57 22 57 22 60 C22 63 15 68 15 68 C15 68 8 63 8 60" fill="white" />

            <rect x="190" y="30" width="30" height="30" rx="6" fill="#FFD93D" />
            <path d="M205 37 L207 43 L213 43 L208.5 47 L210 53 L205 49.5 L200 53 L201.5 47 L197 43 L203 43Z" fill="white" />

            <rect x="0" y="90" width="30" height="30" rx="6" fill="#6C63FF" />
            <path d="M8 105 L15 98 L22 105 M15 98 L15 118" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            <rect x="190" y="75" width="30" height="30" rx="6" fill="#FF9A3C" />
            <path d="M205 82 C201 82 198 85 198 89 C198 95 205 100 205 100 C205 100 212 95 212 89 C212 85 209 82 205 82Z" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OTP input boxes component
// ─────────────────────────────────────────────────────────────────────────────
function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = "";
        onChange(next.join("").trim());
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    }
  };

  const handleChange = (idx: number, val: string) => {
    const ch = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = ch;
    onChange(next.join("").replace(/ /g, ""));
    if (ch && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  return (
    <div className="gm-otp-boxes">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          id={`otp-box-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === " " ? "" : digits[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={(e) => e.target.select()}
          className="gm-otp-box"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="gm-spinner" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Auth Form
// ─────────────────────────────────────────────────────────────────────────────
function AuthForm() {
  const [step, setStep] = useState<Step>("identifier");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [form, setForm] = useState({
    identifier: "",
    name: "",
    password: "",
    confirmPassword: "",
    otp: "",
    dob: "",
    phoneNumber: "",
    building: "",
    landmark: "",
    location: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login } = useStore();

  // countdown for resend OTP
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, ""));

  // ── Step: identifier submitted ──────────────────────────────────────────
  const handleIdentifier = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.identifier.trim();
    if (!id) return setError("Please enter your email or mobile number.");
    if (!isEmail(id) && !isPhone(id)) return setError("Enter a valid email or 10-digit mobile number.");
    setError("");
    setStep("password");
  };

  // ── Step: password login ────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password) return setError("Password cannot be empty.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.identifier, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        login({ id: data.user?.id, name: data.user?.name || form.identifier.split("@")[0], email: form.identifier, role: data.user?.role || 'user', token: data.token });
        router.push(redirectTo);
      } else {
        if (data.requiresVerification) {
          setSuccess("OTP sent to your email. Please verify.");
          setStep("verify_otp");
          setResendCountdown(60);
        } else {
          setError(data.error || "Login failed. Please check your credentials.");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step: request OTP login ─────────────────────────────────────────────
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.identifier.trim();
    if (!id) return setError("Please enter your email or mobile number.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: id }),
      });
      const data = await res.json();
      if (res.ok) {
        // In dev mode, server returns devOtp — pre-fill boxes for easy testing
        if (data.devOtp) {
          setForm((f) => ({ ...f, otp: data.devOtp }));
          setSuccess(`✅ OTP generated (dev mode): ${data.devOtp} — boxes pre-filled!`);
        } else {
          setSuccess(`OTP sent to ${id}. Check your inbox.`);
        }
        setStep("verify_otp");
        setResendCountdown(60);
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step: verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.otp.length < 6) return setError("Please enter the complete 6-digit OTP.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.identifier, otp: form.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        // If token returned, log in directly
        if (data.token) {
          login({ id: data.user?.id, name: data.user?.name || form.identifier.split("@")[0], email: form.identifier, role: data.user?.role || 'user', token: data.token });
          router.push(redirectTo);
        } else {
          setSuccess("Verified! You can now sign in with your password.");
          setStep("password");
        }
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step: register ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!form.identifier.trim()) return setError("Please enter your email.");
    if (!isEmail(form.identifier)) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name, 
          email: form.identifier, 
          password: form.password,
          dob: form.dob,
          phoneNumber: form.phoneNumber,
          building: form.building,
          landmark: form.landmark,
          location: form.location
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created! An OTP has been sent to verify your email.");
        setStep("verify_otp");
        setResendCountdown(60);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (!data || !data.address) throw new Error("No address returned");

          const addr = data.address;
          const road = addr.road || addr.street || addr.pedestrian || addr.path || "";
          const area = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || "";
          const city = addr.city || addr.town || addr.village || addr.county || "Unknown City";
          const state = addr.state || "";
          const postcode = addr.postcode || "";
          const buildingName = addr.building || addr.house_number || addr.amenity || "";

          const landmarkText = [road, area].filter(Boolean).join(", ");
          const locationText = [city, state, postcode].filter(Boolean).join(", ");

          setForm((prev) => ({
            ...prev,
            building: buildingName || prev.building,
            landmark: landmarkText || prev.landmark,
            location: locationText,
          }));
        } catch {
          setError("Failed to auto-detect location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve location");
        setLoading(false);
      }
    );
  };

  const goBack = () => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, password: "", otp: "", confirmPassword: "" }));
    if (step === "password" || step === "otp" || step === "register") setStep("identifier");
    else if (step === "verify_otp") setStep("identifier");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────
  const renderIdentifierStep = () => (
    <form onSubmit={handleIdentifier} className="gm-form" noValidate>
      <div className="gm-field">
        <input
          id="auth-identifier"
          type="text"
          className="gm-input"
          placeholder=" "
          value={form.identifier}
          onChange={set("identifier")}
          autoFocus
          autoComplete="username"
        />
        <label htmlFor="auth-identifier" className="gm-label">Enter Email / Mobile number</label>
        <span className="gm-underline" />
      </div>

      <p className="gm-legal">
        By continuing, you agree to GLOWMART's{" "}
        <Link href="/info/terms" className="gm-link">Terms of Use</Link> and{" "}
        <Link href="/info/privacy" className="gm-link">Privacy Policy</Link>.
      </p>

      {error && <div className="gm-error" role="alert">{error}</div>}

      <button id="btn-continue" type="submit" className="gm-btn-primary" disabled={loading}>
        {loading ? <Spinner /> : "Continue"}
      </button>

      <button
        type="button"
        className="gm-btn-secondary"
        onClick={() => { setError(""); setForm((f) => ({ ...f, identifier: "" })); setStep("otp"); }}
      >
        Request OTP
      </button>

      <div className="gm-divider"><span>OR</span></div>

      <button
        type="button"
        id="btn-create-account"
        className="gm-btn-ghost"
        onClick={() => { setError(""); setStep("register"); }}
      >
        New to GLOWMART? <strong>Create an account</strong>
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordLogin} className="gm-form" noValidate>
      <p className="gm-identifier-chip">
        <span>{form.identifier}</span>
        <button type="button" onClick={goBack} className="gm-chip-change">Change</button>
      </p>

      <div className="gm-field">
        <input
          id="auth-password"
          type={showPassword ? "text" : "password"}
          className="gm-input"
          placeholder=" "
          value={form.password}
          onChange={set("password")}
          autoFocus
          autoComplete="current-password"
        />
        <label htmlFor="auth-password" className="gm-label">Enter Password</label>
        <span className="gm-underline" />
        <button
          type="button"
          className="gm-eye-btn"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>

      {error && <div className="gm-error" role="alert">{error}</div>}
      {success && <div className="gm-success" role="status">{success}</div>}

      <button id="btn-login" type="submit" className="gm-btn-primary" disabled={loading}>
        {loading ? <Spinner /> : "Login"}
      </button>

      <button
        type="button"
        className="gm-btn-ghost gm-mt-sm"
        onClick={() => { setError(""); setStep("otp"); }}
      >
        Login with OTP instead
      </button>

      <p className="gm-forgot">
        <Link href="/auth/forgot" className="gm-link">Forgot Password?</Link>
      </p>
    </form>
  );

  const renderOtpRequestStep = () => (
    <form onSubmit={handleRequestOtp} className="gm-form" noValidate>
      <p className="gm-step-subtitle">We will send an OTP to your email or mobile number</p>

      <div className="gm-field">
        <input
          id="auth-otp-identifier"
          type="text"
          className="gm-input"
          placeholder=" "
          value={form.identifier}
          onChange={set("identifier")}
          autoFocus
          autoComplete="username"
        />
        <label htmlFor="auth-otp-identifier" className="gm-label">Enter Email / Mobile number</label>
        <span className="gm-underline" />
      </div>

      {error && <div className="gm-error" role="alert">{error}</div>}

      <button id="btn-request-otp" type="submit" className="gm-btn-primary" disabled={loading}>
        {loading ? <Spinner /> : "Request OTP"}
      </button>

      <button type="button" className="gm-btn-ghost gm-mt-sm" onClick={goBack}>
        ← Have a password? Sign in
      </button>
    </form>
  );

  const renderVerifyOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="gm-form" noValidate>
      <p className="gm-identifier-chip">
        <span>{form.identifier}</span>
        <button type="button" onClick={goBack} className="gm-chip-change">Change</button>
      </p>

      {success && <div className="gm-success" role="status">{success}</div>}

      <p className="gm-step-subtitle">Enter the 6-digit OTP sent to your registered contact</p>

      <OtpBoxes value={form.otp} onChange={(v) => { setForm((f) => ({ ...f, otp: v })); setError(""); }} />

      {error && <div className="gm-error" role="alert">{error}</div>}

      {resendCountdown > 0 ? (
        <p className="gm-resend-info">Resend OTP in <strong>{resendCountdown}s</strong></p>
      ) : (
        <button
          type="button"
          className="gm-btn-ghost gm-mt-sm"
          onClick={async () => {
            setResendCountdown(60);
            await handleRequestOtp({ preventDefault: () => {} } as any);
          }}
        >
          Resend OTP
        </button>
      )}

      <button id="btn-verify-otp" type="submit" className="gm-btn-primary" disabled={loading || form.otp.length < 6}>
        {loading ? <Spinner /> : "Verify & Login"}
      </button>
    </form>
  );

  const renderRegisterStep = () => (
    <form onSubmit={handleRegister} className="gm-form" noValidate>
      <div className="gm-field">
        <input
          id="reg-name"
          type="text"
          className="gm-input"
          placeholder=" "
          value={form.name}
          onChange={set("name")}
          autoFocus
          autoComplete="name"
        />
        <label htmlFor="reg-name" className="gm-label">Full Name</label>
        <span className="gm-underline" />
      </div>

      <div className="gm-field">
        <input
          id="reg-dob"
          type="date"
          className="gm-input"
          placeholder=" "
          value={form.dob}
          onChange={set("dob")}
        />
        <label htmlFor="reg-dob" className="gm-label">Date of Birth</label>
        <span className="gm-underline" />
      </div>

      <div className="gm-field">
        <input
          id="reg-phone"
          type="tel"
          className="gm-input"
          placeholder=" "
          value={form.phoneNumber}
          onChange={set("phoneNumber")}
        />
        <label htmlFor="reg-phone" className="gm-label">Phone Number</label>
        <span className="gm-underline" />
      </div>

      <div className="gm-field">
        <input
          id="reg-building"
          type="text"
          className="gm-input"
          placeholder=" "
          value={form.building}
          onChange={set("building")}
        />
        <label htmlFor="reg-building" className="gm-label">House No. / Building Name</label>
        <span className="gm-underline" />
      </div>

      <div className="gm-field">
        <input
          id="reg-landmark"
          type="text"
          className="gm-input"
          placeholder=" "
          value={form.landmark}
          onChange={set("landmark")}
        />
        <label htmlFor="reg-landmark" className="gm-label">Road Name, Area, Colony / Landmark</label>
        <span className="gm-underline" />
      </div>

      <div className="gm-field" style={{ position: "relative" }}>
        <input
          id="reg-location"
          type="text"
          className="gm-input"
          placeholder=" "
          value={form.location}
          onChange={set("location")}
        />
        <label htmlFor="reg-location" className="gm-label">Location</label>
        <span className="gm-underline" />
        <button 
          type="button" 
          onClick={detectLocation}
          style={{ position: "absolute", right: 0, top: "20px", background: "none", border: "none", color: "#2874f0", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
        >
          {loading ? "..." : "Auto Detect"}
        </button>
      </div>

      <div className="gm-field">
        <input
          id="reg-email"
          type="email"
          className="gm-input"
          placeholder=" "
          value={form.identifier}
          onChange={set("identifier")}
          autoComplete="email"
        />
        <label htmlFor="reg-email" className="gm-label">Email Address</label>
        <span className="gm-underline" />
      </div>

      <div className="gm-field">
        <input
          id="reg-password"
          type={showPassword ? "text" : "password"}
          className="gm-input"
          placeholder=" "
          value={form.password}
          onChange={set("password")}
          autoComplete="new-password"
        />
        <label htmlFor="reg-password" className="gm-label">Password (min 6 chars)</label>
        <span className="gm-underline" />
        <button
          type="button"
          className="gm-eye-btn"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>

      <div className="gm-field">
        <input
          id="reg-confirm-password"
          type="password"
          className="gm-input"
          placeholder=" "
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          autoComplete="new-password"
        />
        <label htmlFor="reg-confirm-password" className="gm-label">Confirm Password</label>
        <span className="gm-underline" />
      </div>

      {error && <div className="gm-error" role="alert">{error}</div>}

      <p className="gm-legal">
        By creating an account, you agree to GLOWMART's{" "}
        <Link href="/info/terms" className="gm-link">Terms of Use</Link> and{" "}
        <Link href="/info/privacy" className="gm-link">Privacy Policy</Link>.
      </p>

      <button id="btn-register" type="submit" className="gm-btn-primary" disabled={loading}>
        {loading ? <Spinner /> : "Create Account"}
      </button>

      <button type="button" className="gm-btn-ghost gm-mt-sm" onClick={goBack}>
        Already have an account? <strong>Login</strong>
      </button>
    </form>
  );

  const stepTitles: Record<Step, string> = {
    identifier: "Login or Create Account",
    password: "Enter Password",
    otp: "Login with OTP",
    register: "Create Account",
    verify_otp: "Verify OTP",
  };

  return (
    <div className="gm-form-panel">
      <div className="gm-form-header">
        <h2 className="gm-form-title">{stepTitles[step]}</h2>
      </div>

      <div className="gm-form-body">
        {step === "identifier" && renderIdentifierStep()}
        {step === "password" && renderPasswordStep()}
        {step === "otp" && renderOtpRequestStep()}
        {step === "verify_otp" && renderVerifyOtpStep()}
        {step === "register" && renderRegisterStep()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  return (
    <>
      <style>{`
        /* ── Google Font ── */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        /* ── Reset & base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .gm-auth-page {
          min-height: 100vh;
          background: #f1f3f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 24px 16px;
        }

        /* ── Nav bar ── */
        .gm-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          background: #2874f0;
          display: flex;
          align-items: center;
          padding: 0 32px;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }
        .gm-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .gm-nav-logo svg { flex-shrink: 0; }
        .gm-nav-tagline {
          margin-left: 6px;
          color: rgba(255,255,255,0.8);
          font-size: 11px;
          font-style: italic;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.05em;
        }
        .gm-nav-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .gm-nav-link {
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          opacity: 0.85;
          transition: opacity 0.15s;
        }
        .gm-nav-link:hover { opacity: 1; }

        /* ── Card wrapper ── */
        .gm-card {
          display: flex;
          width: 100%;
          max-width: 780px;
          min-height: 520px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          overflow: hidden;
          animation: gm-slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
          margin-top: 56px;
        }
        @keyframes gm-slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Brand panel (left) ── */
        .gm-brand-panel {
          flex: 0 0 40%;
          background: linear-gradient(160deg, #1a56d6 0%, #2874f0 40%, #1a56d6 100%);
          display: flex;
          align-items: flex-start;
          padding: 40px 28px;
          position: relative;
          overflow: hidden;
        }
        .gm-brand-panel::after {
          content: '';
          position: absolute;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          bottom: -60px; right: -60px;
        }
        .gm-brand-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: relative;
          z-index: 1;
          width: 100%;
        }
        .gm-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .gm-brand-headline h1 {
          font-size: 30px;
          font-weight: 700;
          color: white;
          line-height: 1.15;
          margin-bottom: 10px;
          font-family: 'Inter', sans-serif;
        }
        .gm-brand-headline p {
          font-size: 14px;
          color: rgba(255,255,255,0.82);
          line-height: 1.6;
        }
        .gm-brand-illustration {
          margin-top: auto;
          display: flex;
          justify-content: center;
          animation: gm-float 3.5s ease-in-out infinite;
        }
        @keyframes gm-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        /* ── Form panel (right) ── */
        .gm-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 40px 36px;
          overflow-y: auto;
        }
        .gm-form-header { margin-bottom: 24px; }
        .gm-form-title {
          font-size: 22px;
          font-weight: 700;
          color: #212121;
          letter-spacing: -0.01em;
        }
        .gm-form-body { flex: 1; }

        /* ── Form ── */
        .gm-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Material-style floating label field */
        .gm-field {
          position: relative;
          margin-bottom: 8px;
        }
        .gm-input {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid #c2c2c2;
          background: transparent;
          font-size: 14px;
          color: #212121;
          padding: 20px 36px 6px 0;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .gm-input:focus { border-color: #2874f0; }
        .gm-input:focus ~ .gm-underline { transform: scaleX(1); }

        .gm-label {
          position: absolute;
          left: 0;
          top: 20px;
          font-size: 14px;
          color: #9e9e9e;
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          font-family: 'Inter', sans-serif;
          transform-origin: left;
        }
        .gm-input:focus ~ .gm-label,
        .gm-input:not(:placeholder-shown) ~ .gm-label {
          top: 2px;
          font-size: 11px;
          color: #2874f0;
          font-weight: 500;
        }
        .gm-underline {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 2px;
          background: #2874f0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          border-radius: 1px;
        }

        .gm-eye-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #757575;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.15s;
        }
        .gm-eye-btn:hover { color: #2874f0; }

        /* ── Buttons ── */
        .gm-btn-primary {
          width: 100%;
          padding: 14px;
          background: #fb641b;
          color: white;
          border: none;
          border-radius: 2px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(251,100,27,0.30);
        }
        .gm-btn-primary:hover:not(:disabled) {
          background: #f05c14;
          box-shadow: 0 4px 16px rgba(251,100,27,0.40);
          transform: translateY(-1px);
        }
        .gm-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .gm-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .gm-btn-secondary {
          width: 100%;
          padding: 13px;
          background: white;
          color: #2874f0;
          border: 1.5px solid #2874f0;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          transition: background 0.18s, color 0.18s, transform 0.1s;
        }
        .gm-btn-secondary:hover {
          background: #2874f0;
          color: white;
          transform: translateY(-1px);
        }

        .gm-btn-ghost {
          background: none;
          border: none;
          color: #2874f0;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 4px 0;
          text-align: center;
          transition: color 0.15s;
          text-decoration: none;
          display: block;
          width: 100%;
        }
        .gm-btn-ghost:hover { color: #1a56d6; text-decoration: underline; }
        .gm-mt-sm { margin-top: -6px; }

        /* ── Divider ── */
        .gm-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #bdbdbd;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .gm-divider::before, .gm-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e0e0e0;
        }

        /* ── Legal ── */
        .gm-legal {
          font-size: 12px;
          color: #878787;
          line-height: 1.6;
          margin-top: -6px;
        }
        .gm-link {
          color: #2874f0;
          text-decoration: none;
          font-weight: 500;
        }
        .gm-link:hover { text-decoration: underline; }

        /* ── Identifier chip ── */
        .gm-identifier-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f5f5f5;
          border-radius: 4px;
          padding: 10px 14px;
          font-size: 14px;
          color: #424242;
          font-weight: 500;
        }
        .gm-chip-change {
          background: none;
          border: none;
          color: #2874f0;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          padding: 0;
        }
        .gm-chip-change:hover { text-decoration: underline; }

        /* ── Step subtitle ── */
        .gm-step-subtitle {
          font-size: 13px;
          color: #757575;
          line-height: 1.5;
          margin-top: -8px;
        }

        /* ── OTP boxes ── */
        .gm-otp-boxes {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 8px 0;
        }
        .gm-otp-box {
          width: 44px;
          height: 52px;
          border: none;
          border-bottom: 2px solid #bdbdbd;
          background: #fafafa;
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          color: #212121;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'Inter', sans-serif;
          border-radius: 4px 4px 0 0;
          caret-color: #2874f0;
        }
        .gm-otp-box:focus {
          border-color: #2874f0;
          background: #e8f0fe;
        }

        /* ── Resend info ── */
        .gm-resend-info {
          font-size: 12px;
          color: #757575;
          text-align: center;
        }
        .gm-resend-info strong { color: #212121; }

        /* ── Alerts ── */
        .gm-error {
          background: #fff3f0;
          border-left: 3px solid #ee4d37;
          color: #c0392b;
          font-size: 12.5px;
          padding: 10px 14px;
          border-radius: 0 3px 3px 0;
          line-height: 1.5;
          animation: gm-shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
        }
        @keyframes gm-shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .gm-success {
          background: #e8f5e9;
          border-left: 3px solid #43a047;
          color: #2e7d32;
          font-size: 12.5px;
          padding: 10px 14px;
          border-radius: 0 3px 3px 0;
          line-height: 1.5;
        }

        /* ── Forgot password ── */
        .gm-forgot {
          text-align: center;
          font-size: 12.5px;
          margin-top: -8px;
        }

        /* ── Spinner ── */
        .gm-spinner {
          width: 20px;
          height: 20px;
          animation: gm-spin 0.8s linear infinite;
          flex-shrink: 0;
        }
        @keyframes gm-spin {
          to { transform: rotate(360deg); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .gm-card { flex-direction: column; margin-top: 56px; }
          .gm-brand-panel { flex: none; padding: 28px 24px 20px; }
          .gm-brand-illustration { display: none; }
          .gm-form-panel { padding: 28px 24px; }
          .gm-brand-headline h1 { font-size: 24px; }
          .gm-nav-tagline { display: none; }
        }
      `}</style>

      {/* Top Nav */}
      <nav className="gm-nav">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Home</span>
          </Link>
          <div className="w-[1px] h-4 bg-white/20" />
          <Link href="/" className="gm-nav-logo">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.25)" />
              <path d="M9 18 Q18 8 27 18 Q18 28 9 18Z" fill="white" />
            </svg>
            GLOWMART
            <span className="gm-nav-tagline">India&apos;s Premium Beauty Store</span>
          </Link>
        </div>
        <div className="gm-nav-actions">
          <Link href="/collection" className="gm-nav-link">Shop</Link>
          <Link href="/about" className="gm-nav-link">About</Link>
        </div>
      </nav>

      {/* Auth Card */}
      <main className="gm-auth-page">
        <div className="gm-card" role="main">
          <BrandPanel />
          <Suspense fallback={
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg className="gm-spinner" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#2874f0" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
              </svg>
            </div>
          }>
            <AuthForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
