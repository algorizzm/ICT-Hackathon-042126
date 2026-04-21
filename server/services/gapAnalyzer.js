/**
 * Analyzes the skill gap between user skills and job requirements.
 * Computes the set difference: job.skills_required - userSkills
 * 
 * @param {string[]} userSkills - Array of skills extracted from resume
 * @param {string[]} requiredSkills - Array of skills required for a job
 * @returns {string[]} - Array of missing skills
 */
function analyzeGap(userSkills, requiredSkills) {
  const userSkillsLower = new Set(userSkills.map(s => s.toLowerCase()));

  const missingSkills = requiredSkills
    .map(s => s.toLowerCase())
    .filter(skill => !userSkillsLower.has(skill));

  return missingSkills;
}

module.exports = { analyzeGap };
