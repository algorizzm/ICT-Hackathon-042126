/* Skill Gap & Path Simulator */
function RadialBig({ score }) {
  const size = 110;
  const r    = 46;
  const circ = 2 * Math.PI * r;
  const off  = circ - (score / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#09c4e0' : '#f59e0b';
  return (
    <div className="db-radial" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="rbig" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(19,27,46,0.08)" strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#rbig)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="db-radial__label">
        <div className="db-radial__value" style={{ fontSize: '1.5rem', color }}>{Math.round(score)}%</div>
        <div className="db-radial__sub">Readiness</div>
      </div>
    </div>
  );
}

const MARKET_SKILLS = [
  { name: 'PostgreSQL',          pct: 88, color: 'linear-gradient(90deg,#09c4e0,#0369a1)' },
  { name: 'Python',              pct: 95, color: 'linear-gradient(90deg,#10b981,#059669)' },
  { name: 'AWS Redshift',        pct: 72, color: 'linear-gradient(90deg,#8b5cf6,#6d28d9)' },
  { name: 'Statistical Modeling',pct: 65, color: 'linear-gradient(90deg,#f59e0b,#d97706)' },
];

const PCT_MAP = [20, 18, 14, 12, 10, 9, 8];

export default function SkillGap({ job, results }) {
  if (!job) return <div style={{padding:28,color:'var(--text-2)'}}>Select a job from the Overview to view details.</div>;

  const gap    = 100 - job.matchScore;
  const weeks  = Math.max(2, Math.round(gap / 8));
  const topMiss = job.missingSkills.slice(0, 5);

  return (
    <div className="db-skillgap db-animate">
      {/* Job Header */}
      <div className="db-skillgap__job-header">
        <div className="db-badge db-badge--purple" style={{marginBottom:10}}>
          <span className="db-badge__dot" />
          PREMIUM MATCH · Updated 3 hours ago
        </div>
        <h1 className="db-skillgap__job-title">{job.job_title}</h1>
        <p className="db-skillgap__job-desc">{job.description}</p>
        <div className="db-job-meta">
          <span className="db-job-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            San Francisco, CA
          </span>
          <span className="db-job-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            $100k–$122k
          </span>
          <span className="db-job-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Full-time · 4+ yrs
          </span>
          {job.matchedSkills.slice(0,2).map(s => (
            <span key={s} className="db-chip db-chip--skill" style={{fontSize:'0.7rem'}}>{s}</span>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="db-skillgap__grid">
        {/* Left column */}
        <div className="db-skillgap__left">
          {/* Score + Path Simulator */}
          <div className="db-card">
            <div className="db-score-row">
              <RadialBig score={job.matchScore} />
              <div className="db-score-info">
                <div className="db-score-info__headline">Career Readiness Score</div>
                <div className="db-score-stats">
                  <div>
                    <div className="db-score-stat__label">Current Gap</div>
                    <div className="db-score-stat__value">{gap}%</div>
                  </div>
                  <div>
                    <div className="db-score-stat__label">Time Estimate</div>
                    <div className="db-score-stat__value">{weeks} Weeks</div>
                  </div>
                  <div>
                    <div className="db-score-stat__label">Skills Matched</div>
                    <div className="db-score-stat__value">{job.matchedCount}/{job.totalRequired}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="db-path-sim">
              <div className="db-path-sim__label">Career Path Simulator</div>
              <div className="db-path-sim__track">
                <span className="db-path-sim__end" style={{color:'var(--text-3)'}}>Junior</span>
                <div className="db-path-sim__bar-wrap">
                  <div className="db-path-sim__bar-fill" style={{width:`${job.matchScore}%`}} />
                </div>
                <span className="db-path-sim__end" style={{color:'var(--cyan)'}}>Senior Target</span>
              </div>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="db-card">
            <div className="db-card__head">
              <div className="db-card__title">Skill Gap Analysis</div>
            </div>
            {job.matchedSkills.length > 0 && (
              <div style={{marginBottom:12}}>
                <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>
                  Matched ({job.matchedCount})
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {job.matchedSkills.map(s => <span key={s} className="db-chip db-chip--match">{s}</span>)}
                </div>
              </div>
            )}
            {job.missingSkills.length > 0 && (
              <div>
                <div style={{fontSize:'0.72rem',fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>
                  To Learn ({job.missingSkills.length})
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {job.missingSkills.map(s => <span key={s} className="db-chip db-chip--miss">{s}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Aptitude's Tip */}
          <div className="db-aptitude-tip">
            <div className="db-aptitude-tip__head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Aptitude's Tip
            </div>
            <p className="db-aptitude-tip__body">
              FinTech firms specifically prize candidates who understand data pipeline orchestration.
              Prioritizing <strong style={{color:'var(--purple)'}}>{job.missingSkills[0] || 'SQL Optimization'}</strong> will
              make you competitive against the top 20% of applicants for this role.
            </p>
            <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>
              {['Follow for Big Data: Medium','Industry Report: FinTech'].map(t => (
                <span key={t} className="db-chip db-chip--gray" style={{fontSize:'0.7rem'}}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="db-skillgap__right">
          {/* Fastest Path to Hire */}
          <div className="db-card">
            <div className="db-card__head">
              <div className="db-card__title">Fastest Path to Hire</div>
              <span className="db-badge db-badge--green">Priority</span>
            </div>
            {topMiss.map((skill, i) => (
              <div key={skill} className="db-path-item">
                <div className="db-path-item__label">{skill}</div>
                <div className="db-path-item__bar-wrap">
                  <div className="db-path-item__bar" style={{width:`${70 - i*10}%`}} />
                </div>
                <div className="db-path-item__pct">+{PCT_MAP[i]}%</div>
              </div>
            ))}
            <button className="db-btn db-btn--cyan db-btn--full" style={{marginTop:14}}>
              Start Intensive Path
            </button>
          </div>

          {/* Market Competitiveness */}
          <div className="db-card">
            <div className="db-card__head">
              <div className="db-card__title">Market Competitiveness Stack</div>
            </div>
            {MARKET_SKILLS.map(s => (
              <div key={s.name} className="db-market-bar">
                <div className="db-market-bar__head">
                  <span className="db-market-bar__label">{s.name}</span>
                  <span className="db-market-bar__pct">{s.pct}%</span>
                </div>
                <div className="db-market-bar__track">
                  <div className="db-market-bar__fill" style={{width:`${s.pct}%`, background:s.color}} />
                </div>
              </div>
            ))}
          </div>

          {/* Salary benchmark */}
          <div className="db-card" style={{background:'linear-gradient(135deg,#00236f,#1e3a8a)'}}>
            <div style={{fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase',color:'rgba(255,255,255,0.55)',marginBottom:8}}>
              FinTech Salary Benchmark
            </div>
            <div style={{fontFamily:'Manrope, sans-serif',fontSize:'1.2rem',fontWeight:800,color:'white',marginBottom:4}}>
              Report 2026
            </div>
            <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.7)',lineHeight:1.55,marginBottom:12}}>
              Comprehensive salary intelligence across 500+ data roles in the FinTech sector.
            </div>
            <button className="db-btn db-btn--ghost db-btn--sm" style={{borderColor:'rgba(255,255,255,0.3)',color:'white'}}>
              Download PDF &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
