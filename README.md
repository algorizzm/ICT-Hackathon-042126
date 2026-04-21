# AI-Based Job Matching & Skill Gap Analyzer

An AI-powered web application that analyzes resumes to match candidates with suitable job roles, identify skill gaps, and recommend learning resources.

## Features

- **Resume Analysis**: Paste your resume and extract relevant skills automatically
- **Job Matching**: Match extracted skills against 15 predefined job roles
- **Match Scoring**: Calculate match scores using the formula: `(Matched Skills / Total Required Skills) × 100`
- **Skill Gap Detection**: Identify missing skills for each job role
- **Learning Recommendations**: Get curated learning resources for missing skills
- **Beautiful UI**: Dark glassmorphism design with animated circular progress indicators

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Data**: JSON files (no database required)

## Project Structure

```
ICT-Hackathon-042126/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Design system
│   └── index.html
│
├── server/                  # Node.js Backend
│   ├── index.js             # Express server
│   ├── services/
│   │   ├── skillExtractor.js
│   │   ├── matcher.js
│   │   ├── gapAnalyzer.js
│   │   └── recommender.js
│   └── data/
│       ├── jobs.json        # 15 Job definitions
│       ├── skills.json      # Master skill list
│       └── learning.json    # Learning resources
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

1. Install backend dependencies:
```bash
cd server
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the App

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

3. Open your browser at `http://localhost:5173`

## API

### POST /api/analyze

**Request:**
```json
{
  "resumeText": "Your resume text here..."
}
```

**Response:**
```json
{
  "extractedSkills": ["python", "sql", "react"],
  "totalSkillsFound": 3,
  "totalJobsMatched": 5,
  "results": [
    {
      "job_title": "Frontend Developer",
      "matchScore": 75.0,
      "matchedSkills": ["react", "javascript"],
      "missingSkills": ["typescript"],
      "recommendations": [...]
    }
  ]
}
```

## Match Score Formula

```
Match Score = (Matched Skills / Total Required Skills) × 100
```