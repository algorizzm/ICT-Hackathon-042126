import { useState } from 'react';

/* Resume Builder */
export default function ResumeBuilder({ results }) {
  const [openSection, setOpen] = useState('summary');
  const skills = results?.extractedSkills ?? [];
  const topJob = results?.results?.[0];

  const toggle = (id) => setOpen(s => s === id ? null : id);

  const sections = [
    {
      id: 'summary',
      title: 'Executive Summary',
      badge: 'AI Sync',
      content: (
        <p className="db-rb-section__text">
          Strategic technology executive with 5+ years of experience leading cross-functional teams
          to deliver high-impact projects. Expert in bridging the gap between complex business
          requirements and technical implementation. Recognized for driving enterprise-scale solutions
          that improve operational efficiency by 35%+.
        </p>
      ),
    },
    {
      id: 'skills',
      title: 'Skill Intelligence',
      badge: `${skills.length} Extracted`,
      content: (
        <div className="db-rb-skills-wrap">
          {skills.map(s => (
            <span key={s} className="db-chip db-chip--skill">{s}</span>
          ))}
          {skills.length === 0 && <span className="db-chip db-chip--gray">No skills extracted yet</span>}
        </div>
      ),
    },
    {
      id: 'tenure',
      title: 'Professional Tenure',
      badge: 'Auto-populated',
      content: (
        <div>
          {[
            { role:'Senior Software Engineer', co:'DataFlow Corp.', period:'2022–Present', desc:'Led migration to microservices architecture, reducing deployment time by 60%.' },
            { role:'Software Engineer',        co:'TechVision Inc.', period:'2020–2022',   desc:'Built scalable REST APIs serving 2M+ daily active users.' },
          ].map(job => (
            <div key={job.role} style={{marginBottom:12,paddingBottom:12,borderBottom:'1px solid rgba(30,58,138,0.1)'}}>
              <div style={{fontWeight:700,fontSize:'0.82rem',color:'#0f1830'}}>{job.role}</div>
              <div style={{fontSize:'0.72rem',color:'#6b7a99',marginBottom:4}}>{job.co} · {job.period}</div>
              <div style={{fontSize:'0.75rem',color:'#374151',lineHeight:1.55}}>{job.desc}</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="db-resume-builder db-animate">
      {/* Left — editor */}
      <div className="db-rb-left">
        <div className="db-rb-header">
          <div className="db-badge db-badge--cyan" style={{marginBottom:8}}><span className="db-badge__dot"/>AI Sync Active</div>
          <div className="db-rb-title">Resume Builder</div>
          <p className="db-rb-subtitle">Synchronized with your Skill Lab achievements and AI-mapped formatting.</p>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:6,flexWrap:'wrap'}}>
          {['Support Chat','Save Changes'].map(lbl => (
            <button key={lbl} className="db-btn db-btn--ghost db-btn--sm">{lbl}</button>
          ))}
        </div>

        {sections.map(s => (
          <div key={s.id} className="db-rb-section">
            <div className="db-rb-section__head" onClick={() => toggle(s.id)}>
              <span className="db-rb-section__title">{s.title}</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span className="db-rb-section__badge">{s.badge}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{transform: openSection === s.id ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.2s ease'}}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
            {openSection === s.id && <div className="db-rb-section__body">{s.content}</div>}
          </div>
        ))}

        <button className="db-btn db-btn--primary db-btn--full" style={{marginTop:8}}>
          Analyze Resume →
        </button>
      </div>

      {/* Right — live preview */}
      <div className="db-rb-preview">
        <div className="db-rb-preview__header">
          <div className="db-rb-preview__name">ALEXANDER STERLING</div>
          <div className="db-rb-preview__role">{topJob?.job_title || 'Senior Data Architect'} · Cloud Infrastructure Lead</div>
          <div className="db-rb-preview__meta">
            <span>alexander@curator.ai</span>
            <span>·</span>
            <span>San Francisco, CA</span>
            <span>·</span>
            <span>linkedin.com/in/alexander</span>
          </div>
        </div>
        <div className="db-rb-preview__body">
          <div className="db-rb-preview__section">
            <div className="db-rb-preview__section-title">Professional Summary</div>
            <p className="db-rb-preview__text">
              Strategic technology executive with 5+ years of experience leading cross-functional
              teams to deliver high-impact digital transformation projects. Expert in bridging
              business requirements and technical implementation.
            </p>
          </div>
          <div className="db-rb-preview__section">
            <div className="db-rb-preview__section-title">Core Skills</div>
            <div className="db-rb-preview__skill-list">
              {(skills.length > 0 ? skills.slice(0, 10) : ['Python','SQL','React','Node.js','Docker']).map(s => (
                <span key={s} className="db-rb-preview__skill">{s}</span>
              ))}
            </div>
          </div>
          <div className="db-rb-preview__section">
            <div className="db-rb-preview__section-title">Experience</div>
            {[
              { role:'Senior Software Engineer', co:'DataFlow Corp.', period:'2022–Present', items:['Led migration to microservices, reducing deployment time 60%.','Mentored 6 engineers across 3 product squads.'] },
              { role:'Software Engineer',        co:'TechVision Inc.', period:'2020–2022',   items:['Built REST APIs serving 2M+ daily active users.','Implemented CI/CD pipelines cutting release cycles by 40%.'] },
            ].map(job => (
              <div key={job.role} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                  <strong style={{fontSize:'0.82rem',color:'#0f1830'}}>{job.role}</strong>
                  <span style={{fontSize:'0.7rem',color:'#6b7a99'}}>{job.period}</span>
                </div>
                <div style={{fontSize:'0.75rem',color:'#6b7a99',marginBottom:4}}>{job.co}</div>
                <ul style={{paddingLeft:14,margin:0}}>
                  {job.items.map(item => (
                    <li key={item} style={{fontSize:'0.75rem',color:'#374151',lineHeight:1.55,marginBottom:3}}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
