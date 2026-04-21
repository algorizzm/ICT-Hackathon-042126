import SkillTag from './SkillTag';
import JobCard from './JobCard';

export default function ResultsSection({ data }) {
  if (!data) return null;

  const { extractedSkills, totalSkillsFound, totalJobsMatched, results } = data;

  return (
    <section className="results-section" id="results-section">
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-chip" style={{ animationDelay: '0s' }}>
          <span className="stat-chip__icon">🎯</span>
          <span className="stat-chip__value">{totalSkillsFound}</span>
          Skills Detected
        </div>
        <div className="stat-chip" style={{ animationDelay: '0.1s' }}>
          <span className="stat-chip__icon">💼</span>
          <span className="stat-chip__value">{totalJobsMatched}</span>
          Jobs Matched
        </div>
        {results.length > 0 && (
          <div className="stat-chip" style={{ animationDelay: '0.2s' }}>
            <span className="stat-chip__icon">🏆</span>
            Best:
            <span className="stat-chip__value">{Math.round(results[0].matchScore)}%</span>
            {results[0].job_title}
          </div>
        )}
      </div>

      {/* Extracted Skills */}
      <div className="extracted-skills">
        <div className="extracted-skills__title">Your Skills</div>
        <div className="extracted-skills__list">
          {extractedSkills.map(skill => (
            <SkillTag key={skill} skill={skill} variant="extracted" />
          ))}
        </div>
      </div>

      {/* Job Results */}
      <h2 className="results-section__title">
        Job Matches
      </h2>

      {results.length > 0 ? (
        <div className="results-grid">
          {results.map((job, index) => (
            <JobCard key={job.id} job={job} rank={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <h3 className="empty-state__title">No Matches Found</h3>
          <p className="empty-state__description">
            Try adding more skills and experience details to your resume.
          </p>
        </div>
      )}
    </section>
  );
}
