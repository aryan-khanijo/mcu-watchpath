"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  
  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"register" | "login" | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword) return;
    setError(null);
    setLoading("register");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: registerName.trim(), 
          email: registerEmail.trim(),
          password: registerPassword
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/tracker");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) return;
    setError(null);
    setLoading("login");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: loginEmail.trim(),
          password: loginPassword 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/tracker");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-badge">
          <span className="landing-badge-dot" />
          Multiverse Saga Tracker
        </div>
        <h1 className="landing-title">
          MCU <span className="landing-title-accent">Watchpath</span>
        </h1>
        <p className="landing-subtitle">
          Track every Marvel movie and show you need before Avengers: Doomsday
          and Secret Wars. Know exactly what to watch — and what you can skip.
        </p>
      </div>

      {error && <div className="error-msg" style={{ marginBottom: 20, maxWidth: 640 }}>{error}</div>}

      <div className="landing-cards">
        {/* Register Card */}
        <div className="card landing-card">
          <div className="landing-card-icon">🎬</div>
          <h3>I&apos;m New</h3>
          <p>Create an account to start tracking.</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              className="input"
              placeholder="Your name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              maxLength={50}
              required
            />
            <input
              type="email"
              className="input"
              placeholder="Your email address"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              maxLength={100}
              required
            />
            <input
              type="password"
              className="input"
              placeholder="Create a password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading === "register" || !registerName.trim() || !registerEmail.trim() || !registerPassword}
            >
              {loading === "register" ? (
                <span className="loading-spinner" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>

        {/* Login Card */}
        <div className="card landing-card">
          <div className="landing-card-icon">🔑</div>
          <h3>Welcome Back</h3>
          <p>Log in to resume tracking.</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="input"
              placeholder="Your email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              placeholder="Your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading === "login" || !loginEmail.trim() || !loginPassword}
            >
              {loading === "login" ? (
                <span className="loading-spinner" />
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
