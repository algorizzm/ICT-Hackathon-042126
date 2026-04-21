const learningData = require('../data/learning.json');

/**
 * Maps an array of missing skills to their learning resources.
 * 
 * @param {string[]} missingSkills - Array of skill names the user is missing
 * @returns {Object[]} - Array of { skill, resources } objects
 */
function getRecommendations(missingSkills) {
  return missingSkills.map(skill => {
    const skillLower = skill.toLowerCase();
    const resources = learningData[skillLower] || [
      { title: `Search for "${skill}" courses`, url: `https://www.google.com/search?q=learn+${encodeURIComponent(skill)}` }
    ];

    return {
      skill: skillLower,
      resources
    };
  });
}

module.exports = { getRecommendations };
