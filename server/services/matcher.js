const jobs = require('../data/jobs.json');

/**
 * Matches extracted user skills against all job roles and computes match scores.
 * Formula: Match Score = (Matched Skills / Total Required Skills) × 100
 * 
 * @param {string[]} userSkills - Array of skills extracted from resume
 * @returns {Object[]} - Array of job match objects sorted by score descending
 */
function matchJobs(userSkills) {
  const userSkillsLower = new Set(userSkills.map(s => s.toLowerCase()));

  const results = jobs.map(job => {
    const requiredSkills = job.skills_required.map(s => s.toLowerCase());
    const totalRequired = requiredSkills.length;

    const matchedSkills = requiredSkills.filter(skill => userSkillsLower.has(skill));
    const matchedCount = matchedSkills.length;

    const matchScore = totalRequired > 0
      ? parseFloat(((matchedCount / totalRequired) * 100).toFixed(1))
      : 0;

    return {
      id: job.id,
      job_title: job.job_title,
      description: job.description,
      matchScore,
      matchedSkills,
      totalRequired,
      matchedCount,
      skills_required: requiredSkills
    };
  });

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

module.exports = { matchJobs };
