"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  lastActiveAt: string;
  watched: number;
  totalTitles: number;
  percentWatched: number;
}

interface Stats {
  totalUsers: number;
  totalTitles: number;
  mostWatched: { title: string; count: number } | null;
  leastWatched: { title: string; count: number } | null;
  avgCompletion: number;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserCode, setNewUserCode] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Reset idle timer on any activity
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setAuthed(false);
      setPassword("");
      showToast("Session expired — please log in again", "error");
    }, IDLE_TIMEOUT);
  }, [IDLE_TIMEOUT, showToast]);

  // Check for existing admin session cookie
  useEffect(() => {
    const hasSession = document.cookie
      .split("; ")
      .some((c) => c.startsWith("admin-session="));
    if (hasSession) {
      setAuthed(true);
    }
  }, []);

  // Set up idle timer and activity listeners
  useEffect(() => {
    if (!authed) return;

    resetIdleTimer();
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, [authed, resetIdleTimer]);

  // Load data when authed
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/stats"),
      ]);

      if (usersRes.status === 401 || statsRes.status === 401) {
        setAuthed(false);
        return;
      }

      setUsers(await usersRes.json());
      setStats(await statsRes.json());
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuthed(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    setCreateLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUserName.trim(), email: newUserEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewUserCode(data.code);
      setNewUserName("");
      setNewUserEmail("");
      showToast(`User created — temporary password: ${data.code}`);
      loadData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create user", "error");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDeleteUser(userId: number) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to revoke");
      showToast("User revoked successfully");
      setConfirmDelete(null);
      loadData();
    } catch {
      showToast("Failed to revoke user", "error");
    }
  }

  async function handleRegenerate(userId: number) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/regenerate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`New temporary password: ${data.code}`);
      loadData();
    } catch {
      showToast("Failed to reset password", "error");
    }
  }

  // ── Auth Gate ──
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="card admin-login-card">
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
          <h2>Admin Portal</h2>
          <p>Enter the admin password to continue.</p>
          {authError && <div className="error-msg">{authError}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="input"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              id="admin-password"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={authLoading || !password}
              id="admin-login-submit"
            >
              {authLoading ? <span className="loading-spinner" /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="app-container admin">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">M</div>
          <div className="header-title">
            MCU <span>Watchpath</span> — Admin
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/admin/titles" className="btn btn-small btn-primary">
            Manage Titles
          </a>
          <button
            className="btn btn-small btn-secondary"
            onClick={() => {
              setAuthed(false);
              document.cookie = "admin-session=; max-age=0; path=/";
            }}
            id="admin-logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-card-label">Total Users</div>
            <div className="stat-card-value accent">{stats.totalUsers}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-label">Total Titles</div>
            <div className="stat-card-value">{stats.totalTitles}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-label">Avg Completion</div>
            <div className="stat-card-value accent">{stats.avgCompletion}%</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card-label">Most Watched</div>
            <div className="stat-card-value" style={{ fontSize: 16 }}>
              {stats.mostWatched?.title || "—"}
            </div>
            {stats.mostWatched && (
              <div className="stat-card-detail">
                {stats.mostWatched.count} user{stats.mostWatched.count !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create User */}
      <div className="admin-section-header">
        <h2>Create User</h2>
      </div>
      <div className="card" style={{ marginBottom: 32 }}>
        <form
          onSubmit={handleCreateUser}
          style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}
        >
          <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
            <label className="input-label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter user name"
              value={newUserName}
              onChange={(e) => {
                setNewUserName(e.target.value);
                setNewUserCode(null);
              }}
              id="admin-new-user-name"
            />
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="Enter user email"
              value={newUserEmail}
              onChange={(e) => {
                setNewUserEmail(e.target.value);
                setNewUserCode(null);
              }}
              id="admin-new-user-email"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createLoading || !newUserName.trim() || !newUserEmail.trim()}
            id="admin-create-user"
          >
            {createLoading ? <span className="loading-spinner" /> : "Create"}
          </button>
        </form>
        {newUserCode && (
          <div className="code-display" style={{ marginTop: 16, maxWidth: 260 }}>
            <div className="code-display-label">Temporary Password</div>
            <div className="code-display-value">{newUserCode}</div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="admin-section-header">
        <h2>Users ({users.length})</h2>
        <button
          className="btn btn-small btn-secondary"
          onClick={loadData}
          disabled={loading}
          id="admin-refresh"
        >
          {loading ? <span className="loading-spinner" /> : "↻ Refresh"}
        </button>
      </div>

      <div className="admin-table-wrapper" style={{ marginBottom: 40 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Last Active</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  No users yet
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {u.name}
                  </td>
                  <td className="code-cell" style={{ fontSize: 13, textTransform: "none", letterSpacing: "normal" }}>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(u.lastActiveAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        className="progress-bar-track"
                        style={{ width: 60, height: 4 }}
                      >
                        <div
                          className={`progress-bar-fill${u.percentWatched === 100 ? " complete" : ""}`}
                          style={{ width: `${u.percentWatched}%` }}
                        />
                      </div>
                      <span style={{ fontSize: 12 }}>{u.percentWatched}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={() => handleRegenerate(u.id)}
                        title="Reset password"
                      >
                        ↻
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => setConfirmDelete(u)}
                        title="Revoke user"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <h3>Revoke User</h3>
            <p>
              Are you sure you want to revoke <strong>{confirmDelete.name}</strong> (
              {confirmDelete.email})? This will delete all their progress data.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteUser(confirmDelete.id)}
                id="confirm-delete-btn"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
