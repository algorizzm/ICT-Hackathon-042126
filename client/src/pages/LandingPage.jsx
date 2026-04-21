import { useState } from 'react';
import './LandingPage.css';

/* ── INLINE SVG ICONS ─────────────────────────────────────── */
const LogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const TrendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const ExtractionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const LensIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    <path d="M11 8v6M8 11h6"/>
  </svg>
);

const NetworkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <path d="M12 7v4M5 17l5-4M19 17l-5-4"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ── NAVBAR ───────────────────────────────────────────────── */
function NavBar({ onLogoClick }) {
  return (
    <nav className="lp-nav">
      <div className="lp-nav__inner">
        <button className="lp-nav__brand" onClick={onLogoClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="lp-nav__logo">
            <LogoIcon />
          </div>
          <span className="lp-nav__name">Aptitude</span>
        </button>

        <div className="lp-nav__links">
          <a href="#" className="lp-nav__link">Dashboard</a>
          <a href="#" className="lp-nav__link">Job Matches</a>
          <a href="#" className="lp-nav__link">Skill Gaps</a>
          <a href="#" className="lp-nav__link">Resources</a>
        </div>

        <div className="lp-nav__actions">
          <div className="lp-nav__search">
            <SearchIcon />
            <input type="text" placeholder="Search insights..." aria-label="Search" />
          </div>
          <button className="lp-nav__icon-btn" aria-label="Notifications"><BellIcon /></button>
          <button className="lp-nav__icon-btn" aria-label="Settings"><SettingsIcon /></button>
          <div className="lp-nav__avatar" aria-label="User profile">K</div>
        </div>
      </div>
    </nav>
  );
}

/* ── HERO ─────────────────────────────────────────────────── */
function HeroSection({ onAnalyzeClick }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero__grid">
        {/* Left */}
        <div>
          <div className="lp-badge lp-animate">
            <span className="lp-badge__dot" />
            AI-Powered Career Intelligence
          </div>

          <h1 className="lp-hero__headline lp-animate lp-animate--1">
            Your professional<br />
            <em>story, curated</em><br />
            for the future.
          </h1>

          <p className="lp-hero__subtitle lp-animate lp-animate--2">
            Move beyond simple keyword matching. Aptitude performs deep
            semantic analysis of your professional trajectory to find roles
            that align with your true potential, not just your past titles.
          </p>

          <div className="lp-hero__actions lp-animate lp-animate--3">
            <button className="lp-btn lp-btn--primary" onClick={onAnalyzeClick}>
              Analyze My Resume
              <ArrowRightIcon />
            </button>
            <button className="lp-btn lp-btn--ghost">
              Watch Demo
            </button>
          </div>

          <div className="lp-hero__stats lp-animate lp-animate--4">
            <div className="lp-hero__stat">
              <div className="lp-hero__stat-value">15K+</div>
              <div className="lp-hero__stat-label">Professionals</div>
            </div>
            <div className="lp-hero__stat-divider" />
            <div className="lp-hero__stat">
              <div className="lp-hero__stat-value">95%</div>
              <div className="lp-hero__stat-label">Match Rate</div>
            </div>
            <div className="lp-hero__stat-divider" />
            <div className="lp-hero__stat">
              <div className="lp-hero__stat-value">500+</div>
              <div className="lp-hero__stat-label">Skills Tracked</div>
            </div>
          </div>
        </div>

        {/* Right — Extraction Engine Card */}
        <div className="lp-animate lp-animate--2">
          <div className="lp-extract-card">
            <div className="lp-extract-card__head">
              <div className="lp-extract-card__icon">
                <ExtractionIcon />
              </div>
              <div>
                <div className="lp-extract-card__title">Extraction Engine</div>
                <div className="lp-extract-card__status">
                  <span className="lp-extract-card__status-dot" />
                  Active analysis active
                </div>
              </div>
              <div className="lp-extract-card__trend">
                <TrendIcon />
              </div>
            </div>

            <div className="lp-extract-card__bars">
              <div className="lp-bar-row">
                <div className="lp-bar-track"><div className="lp-bar-fill lp-bar-fill--a" /></div>
                <span className="lp-bar-pct">82%</span>
              </div>
              <div className="lp-bar-row">
                <div className="lp-bar-track"><div className="lp-bar-fill lp-bar-fill--b" /></div>
                <span className="lp-bar-pct">60%</span>
              </div>
              <div className="lp-bar-row">
                <div className="lp-bar-track"><div className="lp-bar-fill lp-bar-fill--c" /></div>
                <span className="lp-bar-pct">74%</span>
              </div>
            </div>

            <p className="lp-extract-card__quote">
              "Extracting leadership patterns from 8 years of project management..."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── RESUME INPUT SECTION ────────────────────────────────── */
function ResumeSection({ resumeText, setResumeText, onAnalyze, isLoading, error }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (ev) => setResumeText(ev.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <section className="lp-resume" id="resume-input">
      <div className="lp-resume__inner">
        <div className="lp-section-header">
          <span className="lp-section-header__label">1. Resume Upload / Input</span>
          <span className="lp-section-header__icon"><CodeIcon /></span>
        </div>

        <div className="lp-resume__grid">
          {/* Paste column */}
          <div className="lp-resume__col">
            <div className="lp-resume__col-header">
              <span className="lp-resume__col-title">Paste Your Resume</span>
              <span className="lp-resume__col-tag">Text Input</span>
            </div>
            <textarea
              className="lp-resume__textarea"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Shift + Cmd + V your full resume text here. Our AI will automatically identify skills, achievements, and career progression markers..."
              aria-label="Resume text input"
            />
          </div>

          {/* Upload column */}
          <div className="lp-resume__col">
            <div className="lp-resume__col-header">
              <span className="lp-resume__col-title">Upload File</span>
              <span className="lp-resume__col-tag">PDF / DOCX</span>
            </div>
            <div
              className={`lp-dropzone${dragOver ? ' lp-dropzone--over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              aria-label="File upload area"
              tabIndex={0}
            >
              <div className="lp-dropzone__icon"><UploadIcon /></div>
              <div className="lp-dropzone__title">Drag &amp; Drop Resume</div>
              <div className="lp-dropzone__subtitle">
                Support for PDF, Word, and RTF formats up to 10MB.
              </div>
              <div className="lp-dropzone__tags">
                <span className="lp-dropzone__tag">Privacy Guaranteed</span>
                <span className="lp-dropzone__tag">No Login Required</span>
              </div>
            </div>
            <p style={{ marginTop: '10px', fontSize: '0.76rem', color: 'var(--ink-3)', textAlign: 'center' }}>
              By uploading, you agree to our Career Privacy Protocol. Your data is processed
              in a secure environment and never stored on public servers.
            </p>
          </div>
        </div>

        <div className="lp-resume__footer">
          <button
            className="lp-btn lp-btn--primary"
            onClick={() => resumeText.trim() && onAnalyze(resumeText.trim())}
            disabled={isLoading || !resumeText.trim()}
          >
            {isLoading && <span className="lp-btn__spinner" />}
            Analyze Resume &rarr;
          </button>
          <span className="lp-resume__note">Takes approx. 3 seconds</span>
        </div>

        {error && (
          <div className="lp-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── FEATURES SECTION ────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <LensIcon />,
      variant: 'primary',
      title: 'Contextual Extraction',
      body: "Our AI doesn't just look for keywords — it understands if you were building data pipelines, training models, or teaching others.",
    },
    {
      icon: <NetworkIcon />,
      variant: 'cyan',
      title: 'Achievement Mapping',
      body: 'We translate complex accomplishments into standardized skill markers that match how top-tier hiring managers actually think.',
    },
    {
      icon: <TargetIcon />,
      variant: 'purple',
      title: 'Future-Proof Matching',
      body: 'Match with roles that represent a step up in your career path, identifying opportunities that fit your trajectory, not just your current level.',
    },
  ];

  return (
    <section className="lp-features">
      <div className="lp-features__grid">
        {features.map((f) => (
          <div key={f.title} className="lp-feature-card lp-animate">
            <div className={`lp-feature-card__icon lp-feature-card__icon--${f.variant}`}>
              {f.icon}
            </div>
            <h3 className="lp-feature-card__title">{f.title}</h3>
            <p className="lp-feature-card__body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FOOTER ──────────────────────────────────────────────── */
function FooterSection() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer__inner">
        <div className="lp-footer__grid">
          {/* Brand */}
          <div>
            <div className="lp-footer__brand">
              <div className="lp-footer__logo"><LogoIcon /></div>
              <span className="lp-footer__name">Aptitude</span>
            </div>
            <p className="lp-footer__desc">
              The premium executive suite for modern career intelligence. Built for
              professionals who demand clarity.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div className="lp-footer__col-title">Platform</div>
            <ul className="lp-footer__links">
              {['Career Lab', 'Skill Mapping', 'Company Insights', 'Match Engine'].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div>
            <div className="lp-footer__col-title">Security</div>
            <ul className="lp-footer__links">
              {['Privacy Vault', 'Data Protocol', 'Trust Center'].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <div className="lp-footer__col-title">Join the Future</div>
            <p className="lp-footer__newsletter-label">
              Get weekly insights into AI career trends.
            </p>
            <div className="lp-footer__newsletter-form">
              <input
                className="lp-footer__newsletter-input"
                type="email"
                placeholder="Email"
                aria-label="Newsletter email"
              />
              <button className="lp-footer__newsletter-btn" aria-label="Subscribe">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="lp-footer__bottom">
          <span className="lp-footer__copy">© 2024 Aptitude. All rights reserved.</span>
          <div className="lp-footer__legal">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── MAIN EXPORT ─────────────────────────────────────────── */
export default function LandingPage({ onAnalyze, isLoading, error }) {
  const [resumeText, setResumeText] = useState('');

  const scrollToInput = () => {
    document.getElementById('resume-input')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="lp">
      <NavBar onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <HeroSection onAnalyzeClick={scrollToInput} />
      <ResumeSection
        resumeText={resumeText}
        setResumeText={setResumeText}
        onAnalyze={onAnalyze}
        isLoading={isLoading}
        error={error}
      />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}
