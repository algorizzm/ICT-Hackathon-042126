const express = require('express');
const cors = require('cors');
const { extractSkills } = require('./services/skillExtractor');
const { matchJobs } = require('./services/matcher');
const { analyzeGap } = require('./services/gapAnalyzer');
const { getRecommendations } = require('./services/recommender');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

/**
 * POST /api/analyze
 * Accepts resume text, extracts skills, matches to jobs, identifies gaps,
 * and returns recommendations.
 */
app.post('/api/analyze', (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide resume text in the "resumeText" field.'
      });
    }

    // Step 1: Extract skills from resume
    const extractedSkills = extractSkills(resumeText);

    // Step 2: Match against all jobs
    const jobMatches = matchJobs(extractedSkills);

    // Step 3: For each job, compute gap analysis and recommendations
    const results = jobMatches
      .filter(job => job.matchScore > 0)  // Filter out 0% matches
      .map(job => {
        const missingSkills = analyzeGap(extractedSkills, job.skills_required);
        const recommendations = getRecommendations(missingSkills);

        return {
          id: job.id,
          job_title: job.job_title,
          description: job.description,
          matchScore: job.matchScore,
          matchedSkills: job.matchedSkills,
          missingSkills,
          totalRequired: job.totalRequired,
          matchedCount: job.matchedCount,
          recommendations
        };
      });

    // Step 4: Return response
    res.json({
      extractedSkills,
      totalSkillsFound: extractedSkills.length,
      totalJobsMatched: results.length,
      results
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the resume.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
