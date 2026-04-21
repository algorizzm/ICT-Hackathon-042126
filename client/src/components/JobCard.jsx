import CircularProgress from './CircularProgress';
import SkillTag from './SkillTag';
import Recommendations from './Recommendations';

export default function JobCard({ job, rank }) {
  const isBest = rank === 0;

  return (
    <div
      className={`job-card ${isBest ? 'job-card--best' : ''}`}
      style={{ animationDelay: `${rank * 0.08}s` }}
      id={`job-card-${job.id}`}
    >
      {isBest && (
        <div className="job-card__best-badge">
          ⭐ Best Match
        </div>
      )}

      <div className="job-card__header">
        <div className="job-card__info">
          <h3 className="job-card__title">{job.job_title}</h3>
          <p className="job-card__description">{job.description}</p>
        </div>
        <CircularProgress score={job.matchScore} />
      </div>

      {/* Matched Skills */}
      <div className="job-card__skills">
        <div className="job-card__skills-label">
          Matched Skills ({job.matchedSkills.length}/{job.totalRequired})
        </div>
        <div className="job-card__skills-list">
          {job.matchedSkills.map(skill => (
            <SkillTag key={skill} skill={skill} variant="matched" />
          ))}
          {job.missingSkills.map(skill => (
            <SkillTag key={skill} skill={skill} variant="missing" />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <Recommendations recommendations={job.recommendations} />
    </div>
  );
}

