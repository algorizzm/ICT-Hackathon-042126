/* Resource Library — Learning Recommendations */
const GOAL_PCT = 75;

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

const SECTIONS = [
  {
    key: 'datavis',
    title: '📊 Data Visualization',
    chip: { label:'Core Skill', color:'#09c4e0', bg:'rgba(9,196,224,0.1)' },
    cards: [
      {
        type:'CERTIFICATION', title:'Advanced D3.js for Executives',
        desc:'Build executive-grade interactive charts using D3.js v7 and Svelte.',
        tags:['Free Tier','Launch AI'], platform:'Coursera',
        gradient:'linear-gradient(135deg,#1e3a8a,#37007e)',
        action:'Launch',
      },
      {
        type:'COURSE', title:'Tableau for Executives',
        desc:'Strategy-level dashboarding and data storytelling for leadership.',
        tags:['Certification','Email AI'], platform:'Tableau',
        gradient:'linear-gradient(135deg,#0d9488,#065f46)',
        action:'Enroll',
      },
      {
        type:'PRACTICE', title:'Power BI Mastery',
        desc:'Enterprise reporting, DAX formulas, and AI-powered insights.',
        tags:['Free','Microsoft Learn'], platform:'Microsoft',
        gradient:'linear-gradient(135deg,#f59e0b,#d97706)',
        action:'Start',
      },
    ],
  },
  {
    key: 'cloud',
    title: '☁️ Cloud Architecture',
    chip: { label:'Top Demand', color:'#8b5cf6', bg:'rgba(139,92,246,0.1)' },
    cards: [
      {
        type:'CERTIFICATION', title:'AWS Solutions Architect Associate',
        desc:'Comprehensive preparation for AWS SAA-C03 with practical lab sessions.',
        tags:['Free Tier','Hands-on'], platform:'AWS',
        gradient:'linear-gradient(135deg,#0369a1,#1e3a8a)',
        action:'Enroll',
      },
      {
        type:'COURSE', title:'Kubernetes in Production',
        desc:'Deploy, scale, and manage containerized workloads like a platform engineer.',
        tags:['Advanced','Video Series'], platform:'Linux Foundation',
        gradient:'linear-gradient(135deg,#7c3aed,#4c1d95)',
        action:'Launch',
      },
      {
        type:'PROJECT', title:'Serverless Design Patterns',
        desc:'Implement event-driven architectures using AWS Lambda and Step Functions.',
        tags:['Expert','Self-paced'], platform:'Pluralsight',
        gradient:'linear-gradient(135deg,#065f46,#0d9488)',
        action:'Start',
      },
    ],
  },
];

export default function ResourceLibrary({ results }) {
  const matchedCount = results?.results?.reduce((s, j) => s + j.matchedCount, 0) || 0;

  return (
    <div className="db-resources db-animate">
      {/* Header */}
      <div className="db-resources__header">
        <div>
          <div className="db-badge db-badge--cyan" style={{marginBottom:10}}><span className="db-badge__dot"/>Curated for You</div>
          <h1 className="db-resources__title">Resource Library.</h1>
          <p className="db-resources__sub">
            Closing your skill gaps with AI-curated pathways from top-tier educational institutions.
            <br /><span style={{color:'var(--text-3)'}}>Based on {matchedCount} matched skills across your profile.</span>
          </p>
        </div>
        <div style={{textAlign:'center'}}>
          <GoalRing pct={GOAL_PCT} />
          <div style={{fontSize:'0.72rem',color:'var(--text-2)',marginTop:6}}>Career Goal<br/>Progress</div>
        </div>
      </div>

      {/* Resource sections */}
      {SECTIONS.map(section => (
        <div key={section.key} className="db-resource-section">
          <div className="db-resource-section__head">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span className="db-resource-section__title">{section.title}</span>
              <span style={{fontSize:'0.68rem',fontWeight:700,padding:'3px 9px',borderRadius:'9999px',background:section.chip.bg,color:section.chip.color}}>{section.chip.label}</span>
            </div>
            <button style={{fontSize:'0.72rem',color:'var(--cyan)',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>View All →</button>
          </div>

          <div className="db-resource-grid">
            {section.cards.map(card => (
              <div key={card.title} className="db-resource-card">
                <div className="db-resource-card__img" style={{background:card.gradient}}>
                  <span style={{fontSize:'1.5rem',opacity:0.6}}>
                    {section.key === 'datavis' ? '📊' : '☁️'}
                  </span>
                </div>
                <div className="db-resource-card__type">{card.type} · {card.platform}</div>
                <div className="db-resource-card__title">{card.title}</div>
                <div className="db-resource-card__desc">{card.desc}</div>
                <div className="db-resource-card__footer">
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {card.tags.map(t => (
                      <span key={t} className="db-chip db-chip--gray" style={{fontSize:'0.65rem'}}>{t}</span>
                    ))}
                  </div>
                  <button className="db-resource-card__btn">{card.action} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Stay ahead CTA */}
      <div style={{
        background:'linear-gradient(135deg,#1e3a8a 0%,#37007e 100%)',
        borderRadius:'var(--r-xl)',
        padding:'28px 32px',
        display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16
      }}>
        <div>
          <h3 style={{fontFamily:'Manrope,sans-serif',fontSize:'1.2rem',fontWeight:800,color:'white',marginBottom:6}}>Stay ahead of the curve.</h3>
          <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.65)',lineHeight:1.6,maxWidth:340}}>
            Get personalized learning reminders and skill starts for your specific career path choices, monthly.
          </p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <input placeholder="your@email.com" style={{padding:'10px 16px',borderRadius:'var(--r-lg)',border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'white',fontSize:'0.85rem',outline:'none',width:200}} />
          <button className="db-btn db-btn--cyan">Subscribe</button>
        </div>
      </div>
    </div>
  );
}
