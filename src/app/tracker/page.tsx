"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Title {
  id: number;
  title: string;
  type: "movie" | "series";
  year: number;
  saga: string;
  phase: string | null;
  blurb: string;
  sortOrder: number;
  essentialDoomsday: boolean;
  essentialBrandNewDay: boolean;
  essentialDeadpoolWolverine: boolean;
  episodeNote: string | null;
  subgroup: string | null;
  isReleased: boolean;
  isOptional: boolean;
}

interface ProgressItem {
  titleId: number;
  watched: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const SAGA_ORDER = [
  "The Infinity Saga",
  "The Multiverse Saga",
  "Sony Spider-Man Universe",
  "X-Men Legacy",
];

const PHASE_ORDER = [
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Phase 4",
  "Phase 5",
  "Phase 6",
];

export default function TrackerPage() {
  const router = useRouter();
  const [titles, setTitles] = useState<Title[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Toggles
  const [doomsdayOnly, setDoomsdayOnly] = useState(false);
  const [brandNewDayOnly, setBrandNewDayOnly] = useState(false);
  const [deadpoolWolverineOnly, setDeadpoolWolverineOnly] = useState(false);
  const [includeNonMcu, setIncludeNonMcu] = useState(true);
  
  // Collapsible state
  const [openSagas, setOpenSagas] = useState<Set<string>>(new Set(SAGA_ORDER));
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set(PHASE_ORDER));
  
  const [toast, setToast] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load data from cookie-based session
  useEffect(() => {
    async function loadData() {
      try {
        const [sessionRes, titlesRes] = await Promise.all([
          fetch("/api/session"),
          fetch("/api/titles"),
        ]);

        if (!sessionRes.ok) {
          router.push("/");
          return;
        }

        const sessionData = await sessionRes.json();
        const titlesData = await titlesRes.json();

        setTitles(titlesData);

        // Populate progress
        const map: Record<number, boolean> = {};
        sessionData.progress.forEach((p: ProgressItem) => {
          map[p.titleId] = p.watched;
        });

        setUser(sessionData.user);
        setProgressMap(map);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleToggleWatch = useCallback(
    async (titleId: number, watched: boolean) => {
      if (!user) return;

      // Optimistic update
      setProgressMap((prev) => ({ ...prev, [titleId]: watched }));

      try {
        const res = await fetch("/api/progress", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleId,
            watched,
          }),
        });
        if (!res.ok) throw new Error("Failed to update");
      } catch {
        setProgressMap((prev) => ({ ...prev, [titleId]: !watched }));
        setToast("Failed to save — try again");
        setTimeout(() => setToast(null), 3000);
      }
    },
    [user]
  );

  const handleTogglePhaseWatch = useCallback(
    async (titleIds: number[], watched: boolean) => {
      if (!user) return;

      // Optimistic update
      setProgressMap((prev) => {
        const next = { ...prev };
        titleIds.forEach(id => next[id] = watched);
        return next;
      });

      try {
        const res = await fetch("/api/progress", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleIds,
            watched,
          }),
        });
        if (!res.ok) throw new Error("Failed to update");
      } catch {
        setProgressMap((prev) => {
          const next = { ...prev };
          titleIds.forEach(id => next[id] = !watched); 
          return next;
        });
        setToast("Failed to save — try again");
        setTimeout(() => setToast(null), 3000);
      }
    },
    [user]
  );

  const toggleSaga = (saga: string) => {
    setOpenSagas((prev) => {
      const next = new Set(prev);
      if (next.has(saga)) next.delete(saga);
      else next.add(saga);
      return next;
    });
  };

  const togglePhase = (phase: string) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };



  const handleLogout = () => {
    // Clear the JWT cookie (technically we should call an API, but since it's HttpOnly, 
    // we can't easily clear it from the client directly, wait!
    // We should call a logout endpoint. I will just rely on the API for now, 
    // or we can just redirect to "/" and force re-auth, but wait, the cookie won't clear.
    // Let's call a quick fetch to an /api/logout route or just set a max-age=0 using fetch?)
    fetch('/api/logout', { method: 'POST' }).finally(() => router.push("/"));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="loading-center" style={{ minHeight: "100vh" }}>
        <span className="loading-spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  // Filter titles based on toggles
  const filteredTitles = titles.filter((t) => {
    // If multiple essential filters are active, treat as OR
    const activeFilters = [];
    if (doomsdayOnly) activeFilters.push(t.essentialDoomsday);
    if (brandNewDayOnly) activeFilters.push(t.essentialBrandNewDay);
    if (deadpoolWolverineOnly) activeFilters.push(t.essentialDeadpoolWolverine);

    if (activeFilters.length > 0) {
      if (!activeFilters.some(Boolean)) return false;
    }

    if (!includeNonMcu && (t.saga === "Legacy Studios (Non-MCU)" || t.saga === "X-Men Legacy")) return false;
    return true;
  }).sort((a, b) => a.sortOrder - b.sortOrder);

  // Grouping logic
  const sagas = SAGA_ORDER.map((sagaName) => {
    const sagaTitles = filteredTitles.filter((t) => t.saga === sagaName);
    
    // Group MCU sagas by phase
    const isMcu = sagaName === "The Infinity Saga" || sagaName === "The Multiverse Saga";
    let phases: { name: string; titles: Title[] }[] = [];
    
    if (isMcu) {
      phases = PHASE_ORDER.map(phaseName => ({
        name: phaseName,
        titles: sagaTitles.filter(t => t.phase === phaseName)
      })).filter(p => p.titles.length > 0);
    }

    return {
      name: sagaName,
      titles: sagaTitles,
      phases,
      isMcu
    };
  }).filter(s => s.titles.length > 0);

  // Compute overall stats
  const totalTitles = filteredTitles.filter(t => t.isReleased && !t.isOptional).length;
  const watchedCount = filteredTitles.filter((t) => t.isReleased && !t.isOptional && progressMap[t.id]).length;
  const percentage = totalTitles > 0 ? Math.round((watchedCount / totalTitles) * 100) : 0;

  const doomsdayTitles = titles.filter(t => t.essentialDoomsday && t.isReleased);
  const doomsdayWatched = doomsdayTitles.filter(t => progressMap[t.id]).length;
  
  const bndTitles = titles.filter(t => t.essentialBrandNewDay && t.isReleased);
  const bndWatched = bndTitles.filter(t => progressMap[t.id]).length;

  const dwTitles = titles.filter(t => t.essentialDeadpoolWolverine && t.isReleased);
  const dwWatched = dwTitles.filter(t => progressMap[t.id]).length;

  const readinessLabel =
    percentage === 100
      ? "You're fully prepped for Doomsday! 🔥"
      : percentage >= 75
      ? "Almost there — the multiverse awaits!"
      : percentage >= 50
      ? "Halfway through the saga!"
      : percentage >= 25
      ? "Getting started — keep going!"
      : "Begin your Marvel journey";

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">M</div>
          <div className="header-title">
            MCU <span>Watchpath</span>
          </div>
        </div>
        <div className="header-user">
          <span>{user?.name}</span>
          <span className="header-email" style={{ fontSize: 12, opacity: 0.7, marginRight: 16 }}>{user?.email}</span>
          <button className="btn btn-small btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Overall Progress Hero */}
      <div className="card card-glow progress-hero">
        <div className="progress-hero-title">
          {watchedCount}/{totalTitles} watched — {percentage}%
        </div>
        <div className="progress-hero-subtitle">{readinessLabel}</div>
        <div className="progress-bar-track" style={{ height: 10 }}>
          <div
            className={`progress-bar-fill${percentage === 100 ? " complete" : ""}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: '13px', color: 'var(--text-secondary)' }}>
          <div>Doomsday readiness: {doomsdayWatched}/{doomsdayTitles.length} ⭐</div>
          <div>Brand New Day readiness: {bndWatched}/{bndTitles.length} 🕷️</div>
          <div>Deadpool/Wolverine readiness: {dwWatched}/{dwTitles.length} 🩸</div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="controls-group">
          <label className="toggle">
            <div
              className={`toggle-track${doomsdayOnly ? " active" : ""}`}
              onClick={() => setDoomsdayOnly(!doomsdayOnly)}
            >
              <div className="toggle-thumb" />
            </div>
            <span>Doomsday essential</span>
          </label>
        </div>
        <div className="controls-group">
          <label className="toggle">
            <div
              className={`toggle-track${brandNewDayOnly ? " active" : ""}`}
              onClick={() => setBrandNewDayOnly(!brandNewDayOnly)}
            >
              <div className="toggle-thumb" />
            </div>
            <span>Brand New Day essential</span>
          </label>
        </div>
        <div className="controls-group">
          <label className="toggle">
            <div
              className={`toggle-track${deadpoolWolverineOnly ? " active" : ""}`}
              onClick={() => setDeadpoolWolverineOnly(!deadpoolWolverineOnly)}
            >
              <div className="toggle-thumb" />
            </div>
            <span>Deadpool/Wolverine context</span>
          </label>
        </div>
        <div className="controls-group">
          <label className="toggle">
            <div
              className={`toggle-track${includeNonMcu ? " active" : ""}`}
              onClick={() => setIncludeNonMcu(!includeNonMcu)}
            >
              <div className="toggle-thumb" />
            </div>
            <span>Include Legacy Studios/X-Men</span>
          </label>
        </div>
      </div>

      {/* Saga Sections */}
      <div className="saga-list">
        {sagas.map((saga) => {
          const releasedSagaTitles = saga.titles.filter(t => t.isReleased && !t.isOptional);
          const sagaWatched = releasedSagaTitles.filter((t) => progressMap[t.id]).length;
          const sagaTotal = releasedSagaTitles.length;
          const sagaPct = sagaTotal > 0 ? Math.round((sagaWatched / sagaTotal) * 100) : 0;
          const isSagaOpen = openSagas.has(saga.name);

          return (
            <div className="saga-section" key={saga.name}>
              <div
                className="saga-header sticky-header"
                onClick={() => toggleSaga(saga.name)}
              >
                <div className="saga-header-left">
                  <span className="saga-title">{saga.name}</span>
                  {saga.name === "Legacy Studios (Non-MCU)" && (
                    <span className="title-type-badge movie" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red-primary)', marginLeft: 8, border: '1px solid var(--red-primary)' }}>Not MCU canon</span>
                  )}
                </div>
                <div className="saga-header-right">
                  <span className="saga-count">
                    {sagaWatched}/{sagaTotal}
                  </span>
                  <div className="progress-bar-track" style={{ width: 60, height: 4 }}>
                    <div
                      className={`progress-bar-fill${sagaPct === 100 ? " complete" : ""}`}
                      style={{ width: `${sagaPct}%` }}
                    />
                  </div>
                  <span className={`tier-chevron${isSagaOpen ? " open" : ""}`}>▾</span>
                </div>
              </div>

              {isSagaOpen && (
                <div className="saga-content">
                  {saga.isMcu ? (
                    // MCU Sagas with Phases
                    saga.phases.map((phase) => {
                      const releasedPhaseTitles = phase.titles.filter(t => t.isReleased && !t.isOptional);
                      const phaseWatched = releasedPhaseTitles.filter((t) => progressMap[t.id]).length;
                      const phaseTotal = releasedPhaseTitles.length;
                      const isPhaseOpen = openPhases.has(phase.name);

                      return (
                        <div className="phase-section" key={phase.name}>
                          <div className="phase-header" onClick={() => togglePhase(phase.name)}>
                            <div className="phase-title">{phase.name}</div>
                            <div className="phase-header-right">
                              <button 
                                className="btn btn-small btn-secondary" 
                                style={{ padding: '2px 8px', fontSize: '11px', marginRight: '8px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextWatched = phaseWatched !== phaseTotal;
                                  handleTogglePhaseWatch(phase.titles.map(t => t.id), nextWatched);
                                }}
                              >
                                {phaseWatched === phaseTotal ? "Unmark All" : "Mark All"}
                              </button>
                              <span className="phase-count">{phaseWatched}/{phaseTotal}</span>
                              <span className={`tier-chevron${isPhaseOpen ? " open" : ""}`}>▾</span>
                            </div>
                          </div>
                          {isPhaseOpen && (
                            <div className="tier-list">
                              {phase.titles.map((title) => (
                                <TitleCard 
                                  key={title.id} 
                                  title={title} 
                                  isWatched={progressMap[title.id] || false} 
                                  onToggle={(w) => handleToggleWatch(title.id, w)} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    // Non-MCU Sagas (No phases)
                    (() => {
                      const subgroupsMap = new Map<string | null, Title[]>();
                      saga.titles.forEach(t => {
                        const grp = t.subgroup;
                        if (!subgroupsMap.has(grp)) subgroupsMap.set(grp, []);
                        subgroupsMap.get(grp)!.push(t);
                      });
                      const subgroups = Array.from(subgroupsMap.entries());

                      return subgroups.map(([subgroupName, subgroupTitles], idx) => {
                        const subgroupTotal = subgroupTitles.filter(t => t.isReleased && !t.isOptional).length;
                        const subgroupWatched = subgroupTitles.filter(t => t.isReleased && !t.isOptional && progressMap[t.id]).length;
                        const isSubgroupOpen = openPhases.has(subgroupName || `subgroup-${idx}`);

                        return (
                          <div className="phase-section" key={subgroupName || `subgroup-${idx}`}>
                            {subgroupName && (
                              <div className="phase-header" onClick={() => togglePhase(subgroupName)}>
                                <div className="phase-title">{subgroupName}</div>
                                <div className="phase-header-right">
                                  <button 
                                    className="btn btn-small btn-secondary" 
                                    style={{ padding: '2px 8px', fontSize: '11px', marginRight: '8px' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const nextWatched = subgroupWatched !== subgroupTotal;
                                      handleTogglePhaseWatch(subgroupTitles.filter(t => t.isReleased && !t.isOptional).map(t => t.id), nextWatched);
                                    }}
                                  >
                                    {subgroupWatched === subgroupTotal ? "Unmark All" : "Mark All"}
                                  </button>
                                  <span className="phase-count">{subgroupWatched}/{subgroupTotal}</span>
                                  <span className={`tier-chevron${isSubgroupOpen ? " open" : ""}`}>▾</span>
                                </div>
                              </div>
                            )}
                            {(!subgroupName || isSubgroupOpen) && (
                              <div className="tier-list" style={{ paddingTop: subgroupName ? 0 : 16 }}>
                                {subgroupTitles.map((title) => (
                                  <TitleCard 
                                    key={title.id} 
                                    title={title} 
                                    isWatched={progressMap[title.id] || false} 
                                    onToggle={(w) => handleToggleWatch(title.id, w)} 
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ height: 60 }} />
      {toast && <div className="toast error">{toast}</div>}
    </div>
  );
}

function TitleCard({ title, isWatched, onToggle }: { title: Title; isWatched: boolean; onToggle: (val: boolean) => void }) {
  return (
    <div className={`title-card${isWatched ? " watched" : ""}`}>
      <label className="title-checkbox" style={{ opacity: title.isReleased ? 1 : 0.4, cursor: title.isReleased ? 'pointer' : 'not-allowed' }}>
        <input
          type="checkbox"
          checked={isWatched}
          disabled={!title.isReleased}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div className="title-checkbox-visual" />
      </label>
      <div className="title-info">
        <div className="title-name">
          <span className={isWatched ? "watched-text" : ""}>
            {title.title}
          </span>
          {title.essentialDoomsday && (
            <span className="essential-star" title="Essential for Doomsday">⭐</span>
          )}
          {title.essentialBrandNewDay && (
            <span className="essential-spider" title="Essential for Brand New Day">🕷️</span>
          )}
          {title.essentialDeadpoolWolverine && (
            <span className="essential-dw" title="Essential for Deadpool & Wolverine context">🩸</span>
          )}
          <span className={`title-type-badge ${title.type}`}>
            {title.type}
          </span>
        </div>
        <div className="title-meta">
          {!title.isReleased ? (
             <span className="title-type-badge movie" style={{ background: 'var(--border-color)', color: 'var(--text-muted)', marginRight: 6 }}>Unreleased</span>
          ) : (
             <span>{title.year}</span>
          )}
          {title.blurb && <span>·</span>}
          {title.blurb && (
            <span style={{ opacity: 0.7 }}>
              {title.blurb.length > 80
                ? title.blurb.slice(0, 80) + "…"
                : title.blurb}
            </span>
          )}
          {title.episodeNote && (
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
              {title.episodeNote}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
