const skillsData = require('../data/skills.json');

/**
 * Extracts skills from resume text by matching against the master skill list.
 * Uses lowercased text and checks for both single-word and multi-word skill matches.
 * @param {string} resumeText - Raw resume text input
 * @returns {string[]} - Array of matched skill strings (lowercased)
 */
function extractSkills(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') {
    return [];
  }

  // Clean and normalize the text
  const cleanedText = resumeText
    .toLowerCase()
    .replace(/[,;:()\[\]{}"'!@#$%^&*+=<>?/\\|`~]/g, ' ')  // Replace punctuation with spaces
    .replace(/\s+/g, ' ')  // Collapse multiple spaces
    .trim();

  const matchedSkills = new Set();

  // Check each skill from the master list against the cleaned resume text
  for (const skill of skillsData.skills) {
    const skillLower = skill.toLowerCase();

    // For multi-word skills, check if the phrase exists in the text
    // For single-word skills, check word boundaries to avoid partial matches
    if (skillLower.includes(' ') || skillLower.includes('/') || skillLower.includes('.')) {
      // Multi-word or compound skill (e.g., "machine learning", "ci/cd", "node.js")
      if (cleanedText.includes(skillLower)) {
        matchedSkills.add(skill);
      }
    } else {
      // Single-word skill — use word boundary check
      const regex = new RegExp(`\\b${escapeRegex(skillLower)}\\b`, 'i');
      if (regex.test(cleanedText)) {
        matchedSkills.add(skill);
      }
    }
  }

  return Array.from(matchedSkills);
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { extractSkills };
