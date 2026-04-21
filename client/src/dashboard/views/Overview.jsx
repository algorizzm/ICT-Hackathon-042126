/* Overview — Executive Dashboard */
const ADVANCED_SKILLS  = new Set(['machine learning','deep learning','tensorflow','pytorch','kubernetes','docker','spark','system design','data science','scikit-learn','r','hadoop']);
const INTERMEDIATE_SKILLS = new Set(['react','python','node.js','sql','postgresql','mongodb','java','typescript','redux','graphql','api','pandas','numpy','tableau','power bi','azure','aws','git','ci/cd','rest api','flask','django','express','redis','elasticsearch']);

function tier(skill) {
  const s = skill.toLowerCase();
  if (ADVANCED_SKILLS.has(s))    return 'advanced';
  if (INTERMEDIATE_SKILLS.has(s)) return 'intermediate';
  return 'beginner';
}

function RadialProgress({ score, size = 72 }) {
  const r   = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const off  = circ - (score / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="db-radial" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`rg-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(19,27,46,0.08)" strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={`url(#rg-${score})`} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="db-radial__label">
        <div className="db-radial__value" style={{ fontSize: size * 0.22, color }}>{Math.round(score)}%</div>
        <div className="db-radial__sub">match</div>
      </div>
    </div>
  );
}

const MOCK_SALARIES = ['$80k–$110k','$90k–$130k','$70k–$100k','$100k–$140k','$75k–$105k'];
const MOCK_LOCATIONS = ['New York, NY','San Francisco, CA','Austin, TX','Remote','Chicago, IL'];
const MOCK_COMPANIES = ['TechVision Inc.','DataFlow Corp.','Nexus Analytics','CloudScale AI','InnovateLab'];

export default function Overview({ results, onJobSelect }) {
  const { extractedSkills, totalSkillsFound, totalJobsMatched, results: jobs } = results;

  const sorted   = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const topThree = sorted.slice(0, 3);
  const topJob   = sorted[0];

  const beginner     = extractedSkills.filter(s => tier(s) === 'beginner');
  const intermediate = extractedSkills.filter(s => tier(s) === 'intermediate');
  const advanced     = extractedSkills.filter(s => tier(s) === 'advanced');

  const scoreLabel = topJob?.matchScore >= 75 ? 'Exceptional' : topJob?.matchScore >= 50 ? 'Strong' : 'Developing';

  return (
    <div className="db-overview db-animate">
      {/* ── Header ── */}
      <div className="db-overview__header">
        <div>
          <div className="db-badge db-badge--cyan">
            <span className="db-badge__dot" />
            AI Trajectory Analyzed
          </div>
          <h1 className="db-overview__title">Executive Dashboard</h1>
          <p className="db-overview__sub">All-drive analysis of your professional trajectory</p>
        </div>
        <div className="db-score-card">
          <span className="db-score-card__label">Curator AI Score</span>
          <span className="db-score-card__value">{scoreLabel}</span>
        </div>
      </div>

      {/* ── Two-column ── */}
      <div className="db-overview__grid">
        {/* Left */}
        <div className="db-overview__left">
          {/* Extracted Skills */}
          <div className="db-card">
            <div className="db-card__head">
              <div>
                <div className="db-card__title">Extracted Skills</div>
                <div className="db-card__subtitle">{totalSkillsFound} identified from your resume</div>
              </div>
              <span className="db-badge db-badge--green">{totalJobsMatched} job matches</span>
            </div>

            {advanced.length > 0 && (
              <div className="db-skills-tier">
                <div className="db-skills-tier__label">Advanced</div>
                <div className="db-skills-tier__chips">
                  {advanced.map(s => <span key={s} className="db-chip db-chip--purple">{s}</span>)}
                </div>
              </div>
            )}
            {intermediate.length > 0 && (
              <div className="db-skills-tier">
                <div className="db-skills-tier__label">Intermediate</div>
                <div className="db-skills-tier__chips">
                  {intermediate.map(s => <span key={s} className="db-chip db-chip--skill">{s}</span>)}
                </div>
              </div>
            )}
            {beginner.length > 0 && (
              <div className="db-skills-tier">
                <div className="db-skills-tier__label">Beginner</div>
                <div className="db-skills-tier__chips">
                  {beginner.map(s => <span key={s} className="db-chip db-chip--gray">{s}</span>)}
                </div>
              </div>
            )}
            {extractedSkills.length === 0 && (
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>No skills extracted — try a more detailed resume.</p>
            )}
          </div>

          {/* AI Career Coaching */}
          <div className="db-coaching">
            <div className="db-coaching__head">
              <div>
                <div className="db-coaching__title">AI Career Coaching</div>
                <div className="db-coaching__subtitle">Powered by Curator Intelligence Engine</div>
              </div>
              <span className="db-badge db-badge--live"><span className="db-badge__dot" />Live</span>
            </div>
            <p className="db-coaching__body">
              Based on your career arc, transitioning to a <strong style={{color:'rgba(255,255,255,0.95)'}}>{topJob?.job_title || 'Senior Analyst'}</strong> role
              would represent a strong upward move. The engine suggests focusing on{' '}
              <em style={{color:'rgba(255,255,255,0.8)'}}>{topJob?.missingSkills?.slice(0,2).join(' & ') || 'data visualization'}</em> to
              close your current skill gap.
            </p>
            <div className="db-coaching__stats">
              <div>
                <div className="db-coaching__stat-label">Market Demand</div>
                <div className="db-coaching__stat-value">High</div>
              </div>
              <div>
                <div className="db-coaching__stat-label">Skills Gained</div>
                <div className="db-coaching__stat-value">+{topJob?.matchedCount || 0}</div>
              </div>
            </div>
            <div className="db-coaching__actions">
              <button className="db-coaching__btn-main">Explore Learning Path</button>
              <button className="db-coaching__btn-sec">See Role Insights</button>
            </div>
          </div>
        </div>

        {/* Right — Job matches */}
        <div>
          <div className="db-card">
            <div className="db-card__head">
              <div className="db-card__title">Top Job Matches</div>
              <span className="db-badge db-badge--cyan">{sorted.length} total</span>
            </div>
            {topThree.map((job, i) => (
              <div key={job.id} className="db-job-card" onClick={() => onJobSelect(job)}>
                <RadialProgress score={job.matchScore} />
                <div className="db-job-card__info">
                  <div className="db-job-card__title">{job.job_title}</div>
                  <div className="db-job-card__company">{MOCK_COMPANIES[i % MOCK_COMPANIES.length]}</div>
                  <div className="db-job-card__location">{MOCK_LOCATIONS[i % MOCK_LOCATIONS.length]}</div>
                  <div className="db-job-card__salary">{MOCK_SALARIES[i % MOCK_SALARIES.length]}</div>
                  <div className="db-job-card__actions">
                    <button className="db-job-card__apply">Apply</button>
                    <button className="db-job-card__details" onClick={e => { e.stopPropagation(); onJobSelect(job); }}>Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
