import { useState } from 'react';

/* Skill Lab */
const CERTS = [
  { id:1, name:'Cloud Architecture', date:'Issued Nov 2024', earned:true  },
  { id:2, name:'Data Engineering',   date:'Issued Nov 2024', earned:true  },
  { id:3, name:'Advanced Python',    date:'Complete path to unlock', earned:false },
];

const MODULES = [
  {
    id:1, level:'Advanced', pct:76, gradient:'linear-gradient(135deg,#1e3a8a,#37007e)',
    title:'Mastering SQL Joins',
    desc:'Optimize complex queries and master multi-table relational logic.',
    hours:'4.5 hrs', lessons:'34 Lessons', status:'continue',
  },
  {
    id:2, level:'Intermediate', pct:50, gradient:'linear-gradient(135deg,#0d9488,#1e3a8a)',
    title:'Data Viz Fundamentals',
    desc:'Learn to tell compelling stories using data and visualization principles.',
    hours:'6 hrs', lessons:'51 Lessons', status:'start',
  },
  {
    id:3, level:'Advanced', pct:100, gradient:'linear-gradient(135deg,#7c3aed,#1e3a8a)',
    title:'Cloud System Architecture',
    desc:'Examine first-class architecture design using scalable and AWS services.',
    hours:'12 hrs', lessons:'88 Lessons', status:'review',
  },
];

const BADGE_COLORS = ['linear-gradient(135deg,#09c4e0,#0369a1)', 'linear-gradient(135deg,#8b5cf6,#6d28d9)', 'linear-gradient(135deg,#10b981,#065f46)'];

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);

export default function SkillLab({ results }) {
  const [activeFilter, setFilter] = useState('All Modules');
  const filters = ['All Modules', 'Beginner', 'Intermediate', 'Advanced'];

  const topRec = results?.results?.[0]?.missingSkills?.[0] || 'Advanced Python';
  const filtered = activeFilter === 'All Modules'
    ? MODULES
    : MODULES.filter(m => m.level === activeFilter);

  return (
    <div className="db-skilllab db-animate">
      {/* Header */}
      <div className="db-skilllab__header">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <div className="db-badge db-badge--purple" style={{marginBottom:8}}><span className="db-badge__dot"/>Knowledge Curator</div>
            <h1 className="db-skilllab__title">Skill Lab</h1>
            <p className="db-skilllab__sub">Interactive modules designed to bridge your unique skill gaps using Curator AI intelligence.</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'10px 16px'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            <div>
              <div style={{fontSize:'0.68rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.6px'}}>Badges Earned</div>
              <div style={{fontFamily:'Manrope,sans-serif',fontSize:'1rem',fontWeight:800,color:'var(--text)'}}>12</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current focus + badges */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:16,marginBottom:20,alignItems:'start'}}>
        {/* Current focus */}
        <div className="db-focus-card">
          <div className="db-focus-card__label">Current Focus</div>
          <div className="db-focus-card__title">Advanced Python for Data</div>
          <div className="db-focus-card__desc">
            Master decorative patterns, generators, and async execution for high-performance data pipelines.
          </div>
          <div className="db-focus-card__progress">
            <div className="db-focus-card__progress-head">
              <span className="db-focus-card__progress-label">Module Progress</span>
              <span className="db-focus-card__progress-pct">86%</span>
            </div>
            <div className="db-focus-card__progress-bar">
              <div className="db-focus-card__progress-fill" style={{width:'86%'}} />
            </div>
          </div>
          <div className="db-focus-card__next">Next: Async Programming Patterns</div>
          <button className="db-focus-card__btn">Continue Session →</button>
        </div>

        {/* Recent badges */}
        <div className="db-card">
          <div className="db-card__head">
            <div className="db-card__title">Recent Badges</div>
            <button style={{fontSize:'0.72rem',color:'var(--cyan)',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>View All →</button>
          </div>
          <div className="db-badges" style={{marginBottom:12}}>
            {BADGE_COLORS.map((bg, i) => (
              <div key={i} className="db-badge-item" style={{background: bg.replace('linear-gradient','radial-gradient').replace('135deg','circle')}}>
                <StarIcon />
              </div>
            ))}
            <div className="db-badge-item" style={{border:'1px dashed rgba(19,27,46,0.15)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div style={{marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div style={{fontFamily:'Manrope,sans-serif',fontSize:'0.95rem',fontWeight:700,color:'var(--text)'}}>My Certificates</div>
          <button style={{fontSize:'0.72rem',color:'var(--cyan)',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>View Transcript →</button>
        </div>
        <div className="db-certs">
          {CERTS.map(c => (
            <div key={c.id} className={`db-cert-card${c.earned ? '' : ' db-cert-card--locked'}`}>
              <div className="db-cert-card__icon">
                {c.earned
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                }
              </div>
              <div className="db-cert-card__name">{c.name}</div>
              <div className="db-cert-card__date">{c.date}</div>
              {c.earned && (
                <div className="db-cert-card__dl">
                  <DownloadIcon /> Download PDF
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skill Path Modules */}
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:10}}>
          <div style={{fontFamily:'Manrope,sans-serif',fontSize:'0.95rem',fontWeight:700,color:'var(--text)'}}>Skill Path Modules</div>
          <div className="db-filter-tabs">
            {filters.map(f => (
              <button key={f} className={`db-filter-tab${activeFilter === f ? ' db-filter-tab--active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="db-modules-grid">
          {filtered.map(m => (
            <div key={m.id} className="db-module-card">
              <div className="db-module-card__img" style={{background: m.gradient}}>
                <span className="db-module-card__level">{m.level}</span>
                <span className="db-module-card__pct">{m.pct}%</span>
              </div>
              <div className="db-module-card__body">
                <div className="db-module-card__title">{m.title}</div>
                <div className="db-module-card__desc">{m.desc}</div>
                <div className="db-module-card__meta">
                  <span>{m.hours}</span>
                  <span>·</span>
                  <span>{m.lessons}</span>
                </div>
                <button className={`db-module-card__btn db-module-card__btn--${m.status}`}>
                  {m.status === 'start' ? 'Start Learning' : m.status === 'continue' ? 'Continue Session' : 'Review Labs'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curator's suggestion */}
      <div style={{marginTop:20,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        <div className="db-curator-suggest">
          <div className="db-curator-suggest__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <div className="db-curator-suggest__title">Curator's Suggestion</div>
            <p className="db-curator-suggest__body">
              Based on your recent Product Manager job matches, we recommend focusing on{' '}
              <strong style={{color:'var(--text)'}}>{topRec}</strong> to close your top skill gap.
            </p>
            <div className="db-curator-suggest__trend"><TrendUpIcon /> MARKET TREND · +60% Demand This Month</div>
          </div>
        </div>
        {[{label:'Lab 01', title:'Terminal Velocity', desc:'Rapid CLI proficiency to ace your speed and accuracy in Linux environments.'},
          {label:'Lab 02', title:'Metrics Analysis', desc:'Interrogate data and identify performance bottlenecks.'}].map(lab => (
          <div key={lab.label} className="db-card" style={{cursor:'pointer'}}>
            <div style={{fontSize:'0.65rem',fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.7px',marginBottom:6}}>{lab.label}</div>
            <div style={{fontFamily:'Manrope,sans-serif',fontSize:'0.88rem',fontWeight:700,color:'var(--text)',marginBottom:6}}>{lab.title}</div>
            <p style={{fontSize:'0.75rem',color:'var(--text-2)',lineHeight:1.55}}>{lab.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
