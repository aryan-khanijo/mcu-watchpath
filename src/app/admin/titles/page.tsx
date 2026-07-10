"use client";

import { useState, useEffect } from "react";

type Title = {
  id: number;
  title: string;
  type: "movie" | "series";
  year: number;
  saga: string;
  phase: string | null;
  subgroup: string | null;
  sortOrder: number;
  isReleased: boolean;
};

export default function AdminTitlesPage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadTitles();
  }, []);

  async function loadTitles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/titles");
      if (res.ok) {
        const data = await res.json();
        setTitles(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/titles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        loadTitles();
      } else {
        alert("Failed to delete");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="app-container admin">
      <header className="header" style={{ marginBottom: 24 }}>
        <div className="header-logo">
          <div className="header-logo-icon">M</div>
          <div className="header-title">
            Admin <span>Titles</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/admin/titles/new" className="btn btn-small btn-primary">
            + Add Title
          </a>
          <a href="/admin" className="btn btn-small btn-secondary">
            Back to Dashboard
          </a>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>Loading...</div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "12px" }}>Sort</th>
                <th style={{ padding: "12px" }}>Title</th>
                <th style={{ padding: "12px" }}>Year</th>
                <th style={{ padding: "12px" }}>Saga</th>
                <th style={{ padding: "12px" }}>Bucket</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{t.sortOrder}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {t.title}
                    {!t.isReleased && <span style={{ marginLeft: 8, fontSize: 10, padding: "2px 6px", background: "var(--border)", borderRadius: 12 }}>Unreleased</span>}
                  </td>
                  <td style={{ padding: "12px" }}>{t.year}</td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{t.saga}</td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)", fontSize: "0.9em" }}>
                    {t.phase || t.subgroup || "—"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <a href={`/admin/titles/${t.id}/edit`} className="btn btn-small btn-secondary" style={{ marginRight: 8, display: "inline-block" }}>
                      Edit
                    </a>
                    <button
                      className="btn btn-small btn-secondary"
                      style={{ color: "var(--red-primary)", borderColor: "var(--red-primary)" }}
                      onClick={() => setDeleteId(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteId !== null && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: 400, width: "100%", margin: 16 }}>
            <h3 style={{ marginTop: 0 }}>Confirm Deletion</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
              Are you sure you want to delete this title? All associated user progress for this title will be permanently lost.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: "var(--red-primary)", borderColor: "var(--red-primary)" }} onClick={() => handleDelete(deleteId)}>
                Delete Title
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
