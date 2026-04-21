/* Resource Library — Live roadmap topics from roadmap.sh + YouTube links */
import { useState, useEffect } from 'react';

const ROADMAP_BASE =
  'https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps';

/* ── SKILL → ROADMAP MAPPING ────────────────────────────────── */
const SKILL_MAP = {
  'python':         { id: 'python',       label: 'Python',        g: 'linear-gradient(135deg,#3776ab,#1e3a8a)' },
  'javascript':     { id: 'javascript',   label: 'JavaScript',    g: 'linear-gradient(135deg,#d97706,#92400e)' },
  'typescript':     { id: 'typescript',   label: 'TypeScript',    g: 'linear-gradient(135deg,#3178c6,#1e3a8a)' },
  'react':          { id: 'react',        label: 'React',         g: 'linear-gradient(135deg,#0891b2,#1e3a8a)' },
  'node.js':        { id: 'nodejs',       label: 'Node.js',       g: 'linear-gradient(135deg,#065f46,#059669)' },
  'nodejs':         { id: 'nodejs',       label: 'Node.js',       g: 'linear-gradient(135deg,#065f46,#059669)' },
  'docker':         { id: 'docker',       label: 'Docker',        g: 'linear-gradient(135deg,#1e3a8a,#0891b2)' },
  'kubernetes':     { id: 'kubernetes',   label: 'Kubernetes',    g: 'linear-gradient(135deg,#326ce5,#1e3a8a)' },
  'aws':            { id: 'aws',          label: 'AWS',           g: 'linear-gradient(135deg,#d97706,#92400e)' },
  'mongodb':        { id: 'mongodb',      label: 'MongoDB',       g: 'linear-gradient(135deg,#059669,#065f46)' },
  'postgresql':     { id: 'postgresql',   label: 'PostgreSQL',    g: 'linear-gradient(135deg,#336791,#1e3a8a)' },
  'sql':            { id: 'postgresql',   label: 'SQL / PostgreSQL', g: 'linear-gradient(135deg,#1e3a8a,#336791)' },
  'devops':         { id: 'devops',       label: 'DevOps',        g: 'linear-gradient(135deg,#37007e,#1e3a8a)' },
  'ci/cd':          { id: 'devops',       label: 'DevOps / CI-CD', g: 'linear-gradient(135deg,#37007e,#1e3a8a)' },
  'linux':          { id: 'linux',        label: 'Linux',         g: 'linear-gradient(135deg,#f59e0b,#92400e)' },
  'git':            { id: 'git',          label: 'Git',           g: 'linear-gradient(135deg,#dc2626,#92400e)' },
  'java':           { id: 'java',         label: 'Java',          g: 'linear-gradient(135deg,#f59e0b,#dc2626)' },
  'go':             { id: 'golang',       label: 'Go',            g: 'linear-gradient(135deg,#0891b2,#00236f)' },
  'golang':         { id: 'golang',       label: 'Go',            g: 'linear-gradient(135deg,#0891b2,#00236f)' },
  'angular':        { id: 'angular',      label: 'Angular',       g: 'linear-gradient(135deg,#dc2626,#7c3aed)' },
  'vue':            { id: 'vue',          label: 'Vue.js',        g: 'linear-gradient(135deg,#059669,#0891b2)' },
  'graphql':        { id: 'graphql',      label: 'GraphQL',       g: 'linear-gradient(135deg,#7c3aed,#37007e)' },
  'flutter':        { id: 'flutter',      label: 'Flutter',       g: 'linear-gradient(135deg,#0891b2,#326ce5)' },
  'android':        { id: 'android',      label: 'Android',       g: 'linear-gradient(135deg,#059669,#065f46)' },
  'rust':           { id: 'rust',         label: 'Rust',          g: 'linear-gradient(135deg,#dc2626,#92400e)' },
  'data science':   { id: 'data-science', label: 'Data Science',  g: 'linear-gradient(135deg,#7c3aed,#1e3a8a)' },
  'machine learning':{ id: 'mlops',       label: 'MLOps',         g: 'linear-gradient(135deg,#37007e,#7c3aed)' },
  'frontend':       { id: 'frontend',     label: 'Frontend',      g: 'linear-gradient(135deg,#1e3a8a,#0891b2)' },
  'backend':        { id: 'backend',      label: 'Backend',       g: 'linear-gradient(135deg,#37007e,#1e3a8a)' },
  'express':        { id: 'nodejs',       label: 'Node.js / Express', g: 'linear-gradient(135deg,#065f46,#059669)' },
  'django':         { id: 'python',       label: 'Python / Django', g: 'linear-gradient(135deg,#3776ab,#1e3a8a)' },
  'flask':          { id: 'python',       label: 'Python / Flask', g: 'linear-gradient(135deg,#3776ab,#1e3a8a)' },
  'redis':          { id: 'backend',      label: 'Backend',        g: 'linear-gradient(135deg,#dc2626,#92400e)' },
  'html':           { id: 'frontend',     label: 'Frontend',       g: 'linear-gradient(135deg,#d97706,#dc2626)' },
  'css':            { id: 'frontend',     label: 'Frontend',       g: 'linear-gradient(135deg,#1e3a8a,#0891b2)' },
};

function matchSkills(skills) {
  const seen = new Set();
  const out  = [];
  for (const s of skills) {
    const key  = s.toLowerCase();
    const meta = SKILL_MAP[key];
    if (meta && !seen.has(meta.id)) {
      seen.add(meta.id);
      out.push({ skill: s, ...meta });
    }
    if (out.length >= 4) break;
  }
  // fallback: show frontend roadmap if nothing matched
  if (out.length === 0) {
    out.push({ skill: 'Frontend', id: 'frontend', label: 'Frontend', g: 'linear-gradient(135deg,#1e3a8a,#0891b2)' });
  }
  return out;
}

/* ── FETCH ROADMAP TOPICS ───────────────────────────────────── */
async function fetchTopics(roadmapId) {
  const url = `${ROADMAP_BASE}/${roadmapId}/${roadmapId}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  return nodes
    .filter(n => n.type === 'topic' || n.type === 'subtopic')
    .slice(0, 16)
    .map(n => ({
      id:    n.id,
      label: n.data?.label ?? n.data?.title ?? n.id,
      type:  n.type,
    }));
}

/* ── YOUTUBE SEARCH URL ─────────────────────────────────────── */
const ytSearch = (skill, topic) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${skill} ${topic} tutorial`)}`;

const roadmapUrl = (id) => `https://roadmap.sh/${id}`;

/* ── ICONS ──────────────────────────────────────────────────── */
const YtIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5A3.1 3.1 0 0 0 .5 6.2 32 32 0 0 0 0 12a32 32 0 0 0 .5 5.8 3.1 3.1 0 0 0 2.2 2.2c1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2A32 32 0 0 0 24 12a32 32 0 0 0-.5-5.8z"/>
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const MapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const LoaderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'rl-spin 0.8s linear infinite'}}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ── GOAL RING ──────────────────────────────────────────────── */
function GoalRing({ pct }) {
  const r    = 44;
  const circ = 2 * Math.PI * r;
  const off  = circ - (pct / 100) * circ;
  return (
    <div className="db-goal-ring" style={{width:100,height:100}}>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}>
        <defs>
          <linearGradient id="goalg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#09c4e0"/>
            <stop offset="100%" stopColor="#8b5cf6"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(19,27,46,0.08)" strokeWidth="7"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke="url(#goalg)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{transition:'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'}}
        />
      </svg>
      <div className="db-goal-ring__label">
        <div className="db-goal-ring__pct">{pct}%</div>
        <div className="db-goal-ring__sub">Goal</div>
      </div>
    </div>
  );
}

/* ── TOPIC CARD ─────────────────────────────────────────────── */
function TopicCard({ topic, skillLabel, roadmapId }) {
  const isSubtopic = topic.type === 'subtopic';
  return (
    <div className="rl-topic-card">
      <div className="rl-topic-card__type">{isSubtopic ? 'SUBTOPIC' : 'TOPIC'}</div>
      <div className="rl-topic-card__label">{topic.label}</div>
      <div className="rl-topic-card__actions">
        <a
          href={ytSearch(skillLabel, topic.label)}
          target="_blank"
          rel="noopener noreferrer"
          className="rl-topic-card__btn rl-topic-card__btn--yt"
          title={`Watch "${topic.label}" on YouTube`}
        >
          <YtIcon /> Watch
        </a>
        <a
          href={roadmapUrl(roadmapId)}
          target="_blank"
          rel="noopener noreferrer"
          className="rl-topic-card__btn rl-topic-card__btn--map"
          title="Open roadmap"
        >
          <MapIcon /> Roadmap
        </a>
      </div>
    </div>
  );
}

/* ── ROADMAP SECTION ────────────────────────────────────────── */
function RoadmapSection({ roadmap }) {
  const [topics,  setTopics]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTopics(roadmap.id)
      .then(t => { if (!cancelled) { setTopics(t); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [roadmap.id]);

  const visible = expanded ? topics : topics.slice(0, 8);

  return (
    <div className="rl-section">
      {/* Section header */}
      <div className="rl-section__head">
        <div className="rl-section__brand" style={{background: roadmap.g}}>
          {roadmap.label.slice(0, 2).toUpperCase()}
        </div>
        <div className="rl-section__meta">
          <span className="rl-section__title">{roadmap.label} Roadmap</span>
          <span className="rl-section__sub">
            {loading ? 'Loading topics…' : error ? 'Could not load' : `${topics.length} topics from roadmap.sh`}
          </span>
        </div>
        <a
          href={roadmapUrl(roadmap.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="rl-section__view-all"
        >
          Full Roadmap <ArrowIcon />
        </a>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="rl-skeleton-grid">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="rl-skeleton-card">
              <div className="rl-skeleton-line rl-skeleton-line--sm" />
              <div className="rl-skeleton-line" />
              <div className="rl-skeleton-line rl-skeleton-line--btn" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rl-error">
          <AlertIcon />
          <span>Could not fetch roadmap data — <a href={roadmapUrl(roadmap.id)} target="_blank" rel="noopener noreferrer">view on roadmap.sh</a></span>
        </div>
      )}

      {/* Topics grid */}
      {!loading && !error && (
        <>
          <div className="rl-topics-grid">
            {visible.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                skillLabel={roadmap.label}
                roadmapId={roadmap.id}
              />
            ))}
          </div>
          {topics.length > 8 && (
            <button className="rl-expand-btn" onClick={() => setExpanded(e => !e)}>
              {expanded ? `Show less` : `Show all ${topics.length} topics`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ── MAIN EXPORT ────────────────────────────────────────────── */
export default function ResourceLibrary({ results }) {
  const skills      = results?.extractedSkills ?? [];
  const matchedCount = results?.results?.reduce((s, j) => s + j.matchedCount, 0) ?? 0;
  const roadmaps    = matchSkills(skills);
  const goalPct     = Math.min(95, Math.round(40 + skills.length * 1.8));

  return (
    <div className="db-resources db-animate">
      <style>{`
        @keyframes rl-spin { to { transform: rotate(360deg); } }
        @keyframes rl-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }

        .rl-section {
          background: var(--card);
          border-radius: var(--r-xl);
          box-shadow: var(--sh-sm);
          padding: 24px;
          margin-bottom: 24px;
        }
        .rl-section__head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .rl-section__brand {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: Manrope,sans-serif; font-weight: 900;
          font-size: 0.8rem; color: white; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(19,27,46,0.2);
        }
        .rl-section__meta { flex: 1; min-width: 0; }
        .rl-section__title {
          font-family: Manrope,sans-serif; font-size: 1rem;
          font-weight: 800; color: var(--ink); display: block;
        }
        .rl-section__sub {
          font-size: 0.75rem; color: var(--ink-3); display: block; margin-top: 2px;
        }
        .rl-section__view-all {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 600; color: var(--primary);
          text-decoration: none;
          padding: 6px 12px; border-radius: 9999px;
          background: rgba(30,58,138,0.07);
          transition: background 0.15s;
          white-space: nowrap;
        }
        .rl-section__view-all:hover { background: rgba(30,58,138,0.13); }

        .rl-topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .rl-topic-card {
          background: var(--s-low);
          border-radius: var(--r-lg);
          padding: 14px;
          display: flex; flex-direction: column; gap: 6px;
          transition: background 0.15s, box-shadow 0.15s;
        }
        .rl-topic-card:hover {
          background: var(--s-high);
          box-shadow: var(--sh-xs);
        }
        .rl-topic-card__type {
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.08em; color: var(--ink-3);
          text-transform: uppercase;
        }
        .rl-topic-card__label {
          font-size: 0.82rem; font-weight: 600; color: var(--ink);
          line-height: 1.35; flex: 1;
        }
        .rl-topic-card__actions {
          display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;
        }
        .rl-topic-card__btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 9999px;
          font-size: 0.7rem; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }
        .rl-topic-card__btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .rl-topic-card__btn--yt {
          background: #ff0000; color: white;
        }
        .rl-topic-card__btn--map {
          background: rgba(30,58,138,0.1); color: var(--primary);
        }

        /* Skeletons */
        .rl-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .rl-skeleton-card {
          background: var(--s-low); border-radius: var(--r-lg);
          padding: 14px; display: flex; flex-direction: column; gap: 8px;
        }
        .rl-skeleton-line {
          height: 10px; border-radius: 6px;
          background: linear-gradient(90deg, var(--s-high) 25%, var(--s-low) 50%, var(--s-high) 75%);
          background-size: 400px 100%;
          animation: rl-shimmer 1.4s infinite;
        }
        .rl-skeleton-line--sm  { width: 40%; height: 8px; }
        .rl-skeleton-line--btn { width: 60%; height: 26px; border-radius: 9999px; margin-top: 4px; }

        .rl-expand-btn {
          margin-top: 14px; display: block; width: 100%;
          padding: 9px; border-radius: var(--r-lg);
          background: none; border: 1.5px solid rgba(30,58,138,0.12);
          font-size: 0.82rem; font-weight: 600; color: var(--primary);
          cursor: pointer; transition: background 0.15s;
        }
        .rl-expand-btn:hover { background: rgba(30,58,138,0.05); }

        .rl-error {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: var(--r-lg);
          background: var(--red-bg); font-size: 0.82rem; color: var(--red);
        }
        .rl-error a { color: var(--primary); font-weight: 600; }

        @media (max-width: 600px) {
          .rl-topics-grid, .rl-skeleton-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="db-resources__header">
        <div>
          <div className="db-badge db-badge--cyan" style={{marginBottom:10}}>
            <span className="db-badge__dot" /> Live from roadmap.sh
          </div>
          <h1 className="db-resources__title">Resource Library.</h1>
          <p className="db-resources__sub">
            Curated learning topics mapped to your skills — each card links directly to a YouTube tutorial.
            <br />
            <span style={{color:'var(--ink-3)'}}>
              {skills.length} skills detected · {roadmaps.length} roadmaps loaded · {matchedCount} job skill matches
            </span>
          </p>
        </div>
        <div style={{textAlign:'center'}}>
          <GoalRing pct={goalPct} />
          <div style={{fontSize:'0.72rem',color:'var(--ink-2)',marginTop:6}}>
            Career Goal<br/>Progress
          </div>
        </div>
      </div>

      {/* ── Detected skills chips ── */}
      {skills.length > 0 && (
        <div style={{marginBottom:24}}>
          <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--ink-3)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>
            Your skills · roadmaps loaded below
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {skills.slice(0, 20).map(s => {
              const mapped = SKILL_MAP[s.toLowerCase()];
              return (
                <span
                  key={s}
                  className="db-chip"
                  style={{
                    background: mapped ? 'rgba(30,58,138,0.07)' : 'var(--s-low)',
                    color:      mapped ? 'var(--primary)' : 'var(--ink-2)',
                    fontWeight: mapped ? 600 : 400,
                  }}
                >
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Roadmap sections ── */}
      {roadmaps.map(rm => (
        <RoadmapSection key={rm.id} roadmap={rm} />
      ))}

      {/* ── CTA banner ── */}
      <div style={{
        background:'linear-gradient(135deg,#1e3a8a 0%,#37007e 100%)',
        borderRadius:'var(--r-xl)',
        padding:'28px 32px',
        display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16
      }}>
        <div>
          <h3 style={{fontFamily:'Manrope,sans-serif',fontSize:'1.15rem',fontWeight:800,color:'white',marginBottom:6}}>
            Explore 100+ developer roadmaps.
          </h3>
          <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.65)',lineHeight:1.6,maxWidth:340}}>
            roadmap.sh hosts community-built learning paths for every major technology. Free, open-source, and always up to date.
          </p>
        </div>
        <a
          href="https://roadmap.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="db-btn db-btn--cyan"
          style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6}}
        >
          Browse All Roadmaps <ArrowIcon />
        </a>
      </div>
    </div>
  );
}
