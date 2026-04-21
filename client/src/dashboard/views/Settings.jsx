import { useState } from 'react';

/* Settings */
const SETTING_CARDS = [
  {
    id:'privacy',
    title:'Privacy Cabinet',
    desc:'Control who sees your profile data, skill signals, and career activity within the Aptitude network.',
    iconBg:'rgba(9,196,224,0.10)', iconColor:'var(--cyan)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    action:'Configure →',
  },
  {
    id:'security',
    title:'Security Hub',
    desc:'Two-factor authentication, session management, and audit logs for your account.',
    iconBg:'rgba(16,185,129,0.10)', iconColor:'var(--green)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    action:'Audit Logs →',
  },
  {
    id:'ai',
    title:'AI Data Sovereignty',
    desc:'Manage how Aptitude uses your resume and career data to train personalized models.',
    iconBg:'rgba(139,92,246,0.10)', iconColor:'var(--purple)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    action:'Manage Data →',
  },
];

const TOGGLES = [
  { id:'job-alerts',   label:'Aptitude Alerts',     desc:'Notify when a new match exceeds 80%',  on:true  },
  { id:'market',       label:'Market Intelligence Feed', desc:'Weekly AI market insights digest',  on:true  },
  { id:'resume-sync',  label:'Resume Auto-Sync',     desc:'Sync Skill Lab completions to resume',  on:false },
  { id:'competitors',  label:'Competitor Tracking',  desc:'Monitor similar profiles in your area', on:false },
];

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width:40, height:22, borderRadius:11, border:'none', cursor:'pointer',
        background: on ? 'var(--g-cyan)' : 'rgba(255,255,255,0.1)',
        position:'relative', transition:'background 0.2s ease', flexShrink:0,
      }}
    >
      <span style={{
        position:'absolute', top:3, left: on ? 21 : 3,
        width:16, height:16, borderRadius:'50%', background:'white',
        transition:'left 0.2s ease',
      }}/>
    </button>
  );
}

export default function Settings({ results }) {
  const [toggles, setToggles] = useState(
    Object.fromEntries(TOGGLES.map(t => [t.id, t.on]))
  );

  const flip = (id) => setToggles(s => ({...s, [id]: !s[id]}));

  // Derive real data from results when available
  const topJob      = results?.results?.[0];
  const skillCount  = results?.extractedSkills?.length ?? 0;
  const jobCount    = results?.totalJobsMatched ?? 0;
  const topScore    = topJob ? Math.round(topJob.matchScore) : null;
  const hireLabel   = topScore >= 70 ? 'High' : topScore >= 40 ? 'Medium' : 'Developing';
  const hireColor   = topScore >= 70 ? 'var(--green)' : topScore >= 40 ? 'var(--amber)' : 'var(--ink-3)';
  const avatarLetter = 'U';

  return (
    <div className="db-settings db-animate">
      <h1 className="db-settings__title">System Settings</h1>
      <p className="db-settings__sub">Manage your profile, intelligence feed, and privacy controls.</p>

      {/* Profile card */}
      <div className="db-profile-card">
        <div className="db-profile-avatar">{avatarLetter}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
            <div>
              <div className="db-profile-name">Your Profile</div>
              <div className="db-profile-role">{topJob?.job_title || 'Career Intelligence User'}</div>
              <div className="db-profile-tags">
                <span className="db-chip db-chip--purple" style={{fontSize:'0.7rem'}}>Aptitude AI</span>
                <span className="db-chip db-chip--skill"  style={{fontSize:'0.7rem'}}>{skillCount} Skills</span>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.68rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.6px'}}>Market Insights</div>
              <div style={{fontFamily:'Manrope,sans-serif',fontWeight:800,color:'var(--primary)',marginTop:2}}>Active</div>
            </div>
          </div>
          <p className="db-profile-bio">
            Your resume has been analyzed by Aptitude. {skillCount} skills identified, {jobCount} job matches found.
            {topJob && ` Top match: ${topJob.job_title} at ${topScore}% readiness.`}
          </p>
          <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
            <div style={{padding:'6px 12px',background:'var(--bg-low)',borderRadius:'var(--r-md)'}}>
              <div style={{fontSize:'0.65rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.6px'}}>Skills Found</div>
              <div style={{fontFamily:'Manrope,sans-serif',fontWeight:700,color:'var(--text)',fontSize:'0.82rem'}}>{skillCount}</div>
            </div>
            <div style={{padding:'6px 12px',background:'var(--bg-low)',borderRadius:'var(--r-md)'}}>
              <div style={{fontSize:'0.65rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.6px'}}>Job Matches</div>
              <div style={{fontFamily:'Manrope,sans-serif',fontWeight:700,color:'var(--text)',fontSize:'0.82rem'}}>{jobCount}</div>
            </div>
            <div style={{padding:'6px 12px',background:'var(--bg-low)',borderRadius:'var(--r-md)'}}>
              <div style={{fontSize:'0.65rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.6px'}}>Hire Probability</div>
              <div style={{fontFamily:'Manrope,sans-serif',fontWeight:700,color:hireColor,fontSize:'0.82rem'}}>{hireLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Feed toggles */}
      <div className="db-card" style={{marginBottom:16}}>
        <div className="db-card__head">
          <div className="db-card__title">Intelligence Feed</div>
          <span className="db-badge db-badge--cyan">Personalized</span>
        </div>
        {TOGGLES.map(t => (
          <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{flex:1,marginRight:16}}>
              <div style={{fontSize:'0.85rem',fontWeight:600,color:'var(--text)'}}>{t.label}</div>
              <div style={{fontSize:'0.75rem',color:'var(--text-2)',marginTop:2}}>{t.desc}</div>
            </div>
            <Toggle on={toggles[t.id]} onChange={() => flip(t.id)} />
          </div>
        ))}
      </div>

      {/* Security / Privacy cards */}
      <div className="db-settings-grid">
        {SETTING_CARDS.map(c => (
          <div key={c.id} className="db-settings-card">
            <div className="db-settings-card__icon" style={{background:c.iconBg, color:c.iconColor}}>{c.icon}</div>
            <div className="db-settings-card__title">{c.title}</div>
            <p className="db-settings-card__desc">{c.desc}</p>
            <button className="db-settings-card__btn">{c.action}</button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="db-danger-zone">
        <div>
          <div className="db-danger-zone__title">Archival Account</div>
          <p className="db-danger-zone__text">Permanently delete your profile and all associated career intelligence data. This action cannot be undone.</p>
        </div>
        <button className="db-danger-zone__btn">Destroy My Profile</button>
      </div>
    </div>
  );
}
