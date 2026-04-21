require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { extractSkills } = require('./services/skillExtractor');
const { matchJobs } = require('./services/matcher');
const { analyzeGap } = require('./services/gapAnalyzer');
const { getRecommendations } = require('./services/recommender');
const { register, login } = require('./services/auth');
const { generateSummary, enhanceBulletPoint, generateExperienceBullets } = require('./services/aiGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup multer for in-memory file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

/**
 * POST /api/ai/summary
 * Generate an AI summary based on skills and target job.
 */
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { skills, jobTitle } = req.body;
    const summary = await generateSummary(skills || [], jobTitle || '');
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

/**
 * POST /api/ai/enhance
 * Enhance a single resume bullet point.
 */
app.post('/api/ai/enhance', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text to enhance' });
    const enhanced = await enhanceBulletPoint(text);
    res.json({ enhanced });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enhance bullet' });
  }
});

/**
 * POST /api/ai/bullets
 * Generate ATS-friendly experience bullet points from structured user input.
 */
app.post('/api/ai/bullets', async (req, res) => {
  try {
    const { jobTitle, industry, userTasks, tools, experienceLevel } = req.body;
    if (!userTasks) return res.status(400).json({ error: 'Missing userTasks field' });
    const bullets = await generateExperienceBullets({ jobTitle, industry, userTasks, tools, experienceLevel });
    res.json({ bullets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate bullet points' });
  }
});

/**
 * POST /api/extract
 * Extracts text from uploaded PDF or Word document.
 */
app.post('/api/extract', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { mimetype, buffer } = req.file;
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
      const docxData = await mammoth.extractRawText({ buffer });
      extractedText = docxData.value;
    } else if (mimetype === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload PDF, DOCX, or TXT.' });
    }

    res.json({ extractedText });
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: 'Failed to extract text from file.' });
  }
});

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

/**
 * POST /api/auth/register
 * Creates a new user account. Returns { user, token } or { error }.
 */
app.post('/api/auth/register', (req, res) => {
  const result = register(req.body || {});
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});

/**
 * POST /api/auth/login
 * Authenticates credentials. Returns { user, token } or { error }.
 */
app.post('/api/auth/login', (req, res) => {
  const result = login(req.body || {});
  if (result.error) return res.status(401).json(result);
  res.json(result);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
