"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TitleForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "movie",
    year: initialData?.year || new Date().getFullYear(),
    saga: initialData?.saga || "The Infinity Saga",
    phase: initialData?.phase || "Phase 1",
    subgroup: initialData?.subgroup || "",
    blurb: initialData?.blurb || "",
    sortOrder: initialData?.sortOrder || "",
    essentialDoomsday: initialData?.essentialDoomsday || false,
    essentialBrandNewDay: initialData?.essentialBrandNewDay || false,
    essentialDeadpoolWolverine: initialData?.essentialDeadpoolWolverine || false,
    badgeReason: initialData?.badgeReason || "",
    episodeNote: initialData?.episodeNote || "",
    isReleased: initialData?.isReleased ?? true,
    isOptional: initialData?.isOptional ?? false,
  });

  const [existingSubgroups, setExistingSubgroups] = useState<string[]>([]);
  const [newSubgroupMode, setNewSubgroupMode] = useState(false);
  const [newSubgroupValue, setNewSubgroupValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMcu = formData.saga === "The Infinity Saga" || formData.saga === "The Multiverse Saga";
  const showSubgroup = !isMcu && formData.saga !== "X-Men Legacy";
  const showBadgeReason = formData.essentialDoomsday || formData.essentialBrandNewDay || formData.essentialDeadpoolWolverine;

  useEffect(() => {
    // Fetch titles to extract subgroups for the current saga
    if (showSubgroup) {
      fetch("/api/admin/titles")
        .then(res => res.json())
        .then(titles => {
          const subgroups = new Set<string>();
          titles.forEach((t: any) => {
            if (t.saga === formData.saga && t.subgroup) {
              subgroups.add(t.subgroup);
            }
          });
          const arr = Array.from(subgroups);
          setExistingSubgroups(arr);
          
          if (formData.subgroup && !arr.includes(formData.subgroup)) {
            setNewSubgroupMode(true);
            setNewSubgroupValue(formData.subgroup);
          } else if (!formData.subgroup && arr.length > 0) {
            setFormData(prev => ({ ...prev, subgroup: arr[0] }));
          } else if (arr.length === 0) {
            setNewSubgroupMode(true);
          }
        });
    }
  }, [formData.saga, showSubgroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { ...formData };
    if (!isMcu) payload.phase = null;
    if (showSubgroup && newSubgroupMode && newSubgroupValue.trim()) {
      payload.subgroup = newSubgroupValue.trim();
    } else if (!showSubgroup) {
      payload.subgroup = null;
    }
    
    if (!showBadgeReason) {
      payload.badgeReason = null;
    }

    const url = initialData ? `/api/admin/titles/${initialData.id}` : `/api/admin/titles`;
    const method = initialData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      router.push("/admin/titles");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <div style={{ color: "var(--red-primary)", padding: 12, background: "rgba(239, 68, 68, 0.1)", borderRadius: 8 }}>{error}</div>}
      
      <div className="input-group">
        <label className="input-label">Title</label>
        <input required type="text" name="title" className="input" value={formData.title} onChange={handleChange} />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
          <label className="input-label">Type</label>
          <select name="type" className="input" value={formData.type} onChange={handleChange}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
        </div>
        <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
          <label className="input-label">Year</label>
          <input required type="number" name="year" className="input" value={formData.year} onChange={handleChange} />
        </div>
        <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
          <label className="input-label">Sort Order (Optional)</label>
          <input type="number" name="sortOrder" className="input" placeholder="Auto" value={formData.sortOrder} onChange={handleChange} />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Saga</label>
        <select name="saga" className="input" value={formData.saga} onChange={handleChange}>
          <option value="The Infinity Saga">The Infinity Saga</option>
          <option value="The Multiverse Saga">The Multiverse Saga</option>
          <option value="Legacy Studios (Non-MCU)">Legacy Studios (Non-MCU)</option>
          <option value="X-Men Legacy">X-Men Legacy</option>
          <option value="Deep Cuts / Pre-MCU Legacy">Deep Cuts / Pre-MCU Legacy</option>
        </select>
      </div>

      {isMcu && (
        <div className="input-group">
          <label className="input-label">Phase</label>
          <select name="phase" className="input" value={formData.phase} onChange={handleChange}>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
            <option value="Phase 4">Phase 4</option>
            <option value="Phase 5">Phase 5</option>
            <option value="Phase 6">Phase 6</option>
          </select>
        </div>
      )}

      {showSubgroup && (
        <div className="input-group">
          <label className="input-label">Subgroup</label>
          {!newSubgroupMode ? (
            <select
              className="input"
              value={formData.subgroup}
              onChange={(e) => {
                if (e.target.value === "__NEW__") {
                  setNewSubgroupMode(true);
                } else {
                  handleChange(e);
                }
              }}
              name="subgroup"
            >
              {existingSubgroups.map(sg => <option key={sg} value={sg}>{sg}</option>)}
              <option value="__NEW__">+ Add new subgroup</option>
            </select>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Enter new subgroup name" 
                value={newSubgroupValue} 
                onChange={e => setNewSubgroupValue(e.target.value)} 
                required
              />
              {existingSubgroups.length > 0 && (
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setNewSubgroupMode(false);
                  setFormData(prev => ({ ...prev, subgroup: existingSubgroups[0] }));
                }}>Cancel</button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="input-group">
        <label className="input-label">Blurb (1 sentence)</label>
        <textarea required name="blurb" className="input" value={formData.blurb} onChange={handleChange} rows={2}></textarea>
      </div>
      
      <div className="input-group">
        <label className="input-label">Episode Note (Optional)</label>
        <input type="text" name="episodeNote" className="input" placeholder="e.g. Watch eps 1 & 9" value={formData.episodeNote} onChange={handleChange} />
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" name="essentialDoomsday" checked={formData.essentialDoomsday} onChange={handleChange} />
          <span>Essential Doomsday ⭐</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" name="essentialBrandNewDay" checked={formData.essentialBrandNewDay} onChange={handleChange} />
          <span>Essential Brand New Day 🕷️</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" name="essentialDeadpoolWolverine" checked={formData.essentialDeadpoolWolverine} onChange={handleChange} />
          <span>Essential Deadpool/Wolverine 🩸</span>
        </label>
      </div>

      {showBadgeReason && (
        <div className="input-group" style={{ marginTop: 12 }}>
          <label className="input-label">Badge Reason (Optional)</label>
          <input type="text" name="badgeReason" className="input" placeholder="Why is this essential?" value={formData.badgeReason} onChange={handleChange} />
        </div>
      )}
      
      <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" name="isReleased" checked={formData.isReleased} onChange={handleChange} />
          <span>Is Released (counts toward progress)</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" name="isOptional" checked={formData.isOptional} onChange={handleChange} />
          <span>Is Optional (excluded from denominator)</span>
        </label>
      </div>

      <div style={{ marginTop: 24 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : (initialData ? "Save Changes" : "Create Title")}
        </button>
      </div>
    </form>
  );
}
