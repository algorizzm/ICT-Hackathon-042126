/* Career Path — Strategic Evolution */
const PATHS = [
  {
    id: 'ds-ai',
    gradient: 'linear-gradient(135deg,#1e3a8a,#37007e)',
    iconColor: '#8b5cf6',
    title: 'Data Science & AI',
    desc: 'Transition into data-driven roles with high global market demand and real-time skill indexing.',
    growth: '+14.2%',
    period: 'YoY',
    demand: 'High',
    salary: '$95k–$145k',
    nodes: ['Junior Analyst','Data Analyst','Senior Analyst','Lead Scientist','Principal DS'],
    active: 2,
    coreSkills: ['Python','SQL','Machine Learning','Pandas','TensorFlow'],
    aiRec: 'Based on your skill set, transitioning to a Principal Data Strategist is strongly aligned. The engine suggests focusing on cloud infrastructure to close your final 15% gap.',
  },
  {
    id: 'product',
    gradient: 'linear-gradient(135deg,#0d9488,#065f46)',
    iconColor: '#10b981',
    title: 'Product Management',
    desc: 'Lead cross-functional teams and drive roadmap strategy with data-informed decision making.',
    growth: '+9.8%',
    period: 'YoY',
    demand: 'High',
    salary: '$105k–$155k',
    nodes: ['Associate PM','Product Manager','Senior PM','Group PM','VP Product'],
    active: 1,
    coreSkills: ['Agile','User Research','Roadmapping','Analytics','Stakeholder Mgmt'],
    aiRec: 'Your analytical background maps well to Technical PM roles. Strengthening your user research skills would open Senior PM tracks at FAANG companies.',
  },
  {
    id: 'cloud',
    gradient: 'linear-gradient(135deg,#0369a1,#1e3a8a)',
    iconColor: '#09c4e0',
    title: 'Cloud Engineering',
    desc: 'Architect resilient infrastructure on AWS, Azure, and GCP to power modern digital enterprises.',
    growth: '+18.5%',
    period: 'YoY',
    demand: 'Very High',
    salary: '$110k–$160k',
    nodes: ['Cloud Practitioner','Cloud Engineer','Senior Engineer','Architect','Principal Architect'],
    active: 0,
    coreSkills: ['AWS','Terraform','Kubernetes','Docker','Python'],
    aiRec: 'Cloud Engineering has the fastest job growth in your area. Two certifications (AWS Solutions Architect + Terraform) would qualify you for 120k+ roles.',
  },
  {
    id: 'fullstack',
    gradient: 'linear-gradient(135deg,#7c3aed,#4c1d95)',
    iconColor: '#a78bfa',
    title: 'Full-Stack Development',
    desc: 'Build end-to-end web applications with modern stacks loved by startups and enterprises alike.',
    growth: '+11.3%',
    period: 'YoY',
    demand: 'High',
    salary: '$85k–$130k',
    nodes: ['Junior Dev','Developer','Senior Dev','Tech Lead','Staff Engineer'],
    active: 0,
    coreSkills: ['React','Node.js','TypeScript','PostgreSQL','Docker'],
    aiRec: 'Combining your backend skills with React would make you a competitive Full-Stack candidate. Focus on TypeScript and system design for senior-level tracks.',
  },
];

const DataIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const TrendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const CloudIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);
const CodeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);

const PATH_ICONS = { 'ds-ai': DataIcon, product: TrendIcon, cloud: CloudIcon, fullstack: CodeIcon };

export default function CareerPath({ results }) {
  return (
    <div className="db-careerpath db-animate">
      <div className="db-careerpath__header">
        <div className="db-badge db-badge--cyan"><span className="db-badge__dot" />Strategic Intelligence</div>
        <h1 className="db-careerpath__title">Explore Your Strategic Evolution</h1>
        <p className="db-careerpath__sub">Curated career trajectories for high-confidence impact. Each path is enriched with global market demand and real-time skill indexing.</p>
      </div>

      <div className="db-careerpath__grid">
        {PATHS.map(path => {
          const Icon = PATH_ICONS[path.id];
          return (
            <div key={path.id} className="db-path-card">
              <div className="db-path-card__icon" style={{background: path.gradient}}>
                <span style={{color: 'white'}}><Icon /></span>
              </div>
              <div className="db-path-card__title">{path.title}</div>
              <p className="db-path-card__desc">{path.desc}</p>

              <div className="db-path-card__meta">
                <div>
                  <div className="db-path-card__stat-label">Growth</div>
                  <div className="db-path-card__stat-val" style={{color:'var(--green)'}}>{path.growth} {path.period}</div>
                </div>
                <div>
                  <div className="db-path-card__stat-label">Demand</div>
                  <div className="db-path-card__stat-val" style={{color:'var(--cyan)'}}>{path.demand}</div>
                </div>
                <div>
                  <div className="db-path-card__stat-label">Salary</div>
                  <div className="db-path-card__stat-val">{path.salary}</div>
                </div>
              </div>

              {/* Progression dots */}
              <div className="db-path-progression">
                {path.nodes.map((node, i) => (
                  <span key={node}>
                    <span className={`db-path-node${i === path.active ? ' db-path-node--active' : ''}`}>{node}</span>
                    {i < path.nodes.length - 1 && <span className="db-path-arrow"> › </span>}
                  </span>
                ))}
              </div>

              {/* Core skills */}
              <div style={{marginTop:12,display:'flex',flexWrap:'wrap',gap:5}}>
                {path.coreSkills.map(s => (
                  <span key={s} className="db-chip db-chip--gray" style={{fontSize:'0.7rem'}}>{s}</span>
                ))}
              </div>

              {/* AI rec */}
              <div style={{marginTop:12,padding:'10px 12px',background:'rgba(139,92,246,0.07)',borderRadius:'10px'}}>
                <div style={{fontSize:'0.65rem',fontWeight:700,color:'var(--purple)',textTransform:'uppercase',letterSpacing:'0.7px',marginBottom:4}}>
                  Aptitude Recommendation
                </div>
                <p style={{fontSize:'0.75rem',color:'var(--text-2)',lineHeight:1.55}}>{path.aiRec}</p>
              </div>

              <div style={{display:'flex',gap:8,marginTop:14}}>
                <button className="db-btn db-btn--primary db-btn--sm">Navigate Roadmap</button>
                <button className="db-btn db-btn--ghost db-btn--sm">Compare Paths</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
