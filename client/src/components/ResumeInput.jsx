import { useState } from 'react';

const SAMPLE_RESUME = `John Doe — Software Engineer

Skills: Python, JavaScript, React, Node.js, SQL, PostgreSQL, Docker, Git, HTML, CSS, REST API, Express, MongoDB, Linux, AWS, CI/CD, TypeScript, Jest, Agile, Scrum

Experience:
- Built full-stack web applications using React and Node.js
- Designed RESTful APIs with Express and PostgreSQL
- Deployed containerized applications using Docker and AWS
- Implemented CI/CD pipelines with Jenkins and Git
- Collaborated in Agile/Scrum teams using Jira

Education:
B.S. Computer Science — University of Technology`;

export default function ResumeInput({ onAnalyze, isLoading }) {
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = () => {
    if (resumeText.trim()) {
      onAnalyze(resumeText);
    }
  };

  const handleSamplePaste = () => {
    setResumeText(SAMPLE_RESUME);
  };

  const handleClear = () => {
    setResumeText('');
  };

  return (
    <section className="input-section" id="resume-input-section">
      <div className="input-card">
        <label className="input-card__label" htmlFor="resume-textarea">
          <span className="input-card__label-icon">📄</span>
          Resume Content
        </label>
        <textarea
          id="resume-textarea"
          className="input-card__textarea"
          placeholder="Paste your resume text here...&#10;&#10;Include your skills, work experience, education, and certifications for the best results."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          disabled={isLoading}
        />
        <div className="input-card__actions">
          <button
            id="analyze-button"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={isLoading || !resumeText.trim()}
          >
            {isLoading ? (
              <>
                <span className="btn__spinner"></span>
                Analyzing...
              </>
            ) : (
              <>🔍 Analyze Resume</>
            )}
          </button>
          <button
            id="sample-button"
            className="btn btn--secondary"
            onClick={handleSamplePaste}
            disabled={isLoading}
          >
            📋 Try Sample Resume
          </button>
          {resumeText && (
            <button
              id="clear-button"
              className="btn btn--secondary"
              onClick={handleClear}
              disabled={isLoading}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
