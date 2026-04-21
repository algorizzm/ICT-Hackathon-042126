import { useState } from 'react';
import './Dashboard.css';
import Overview       from './views/Overview';
import SkillGap       from './views/SkillGap';
import CareerPath     from './views/CareerPath';
import SkillLab       from './views/SkillLab';
import ResourceLibrary from './views/ResourceLibrary';
import ResumeBuilder  from './views/ResumeBuilder';
import Settings       from './views/Settings';

/* ── ICONS ─────────────────────────────────────────────── */
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const MapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const FlaskIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5S9.5 20.9 9.5 19.5V2"/>
    <path d="M8.5 2h7"/><path d="M14.5 16h-5"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const LogoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);

const NAV = [
  { id: 'overview',       label: 'Overview',        Icon: GridIcon  },
  { id: 'career-path',    label: 'Career Path',     Icon: MapIcon   },
  { id: 'skill-lab',      label: 'Skill Lab',       Icon: FlaskIcon },
  { id: 'resources',      label: 'Resources',       Icon: BookIcon  },
  { id: 'match-engine',   label: 'Match Engine',    Icon: TargetIcon },
  { id: 'resume-builder', label: 'Resume Builder',  Icon: DocIcon   },
  { id: 'settings',       label: 'Settings',        Icon: GearIcon  },
];

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── SIDEBAR ──────────────────────────────────────────────── */
function Sidebar({ active, onNav, onAnalyzeAgain, isOpen, onClose }) {
  const handleNav = (id) => {
    onNav(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="db-sidebar-backdrop" onClick={onClose} />}

      <aside className={`db-sidebar${isOpen ? ' db-sidebar--open' : ''}`}>
        <div className="db-sidebar__brand">
          <div className="db-sidebar__logo"><LogoIcon /></div>
          <div className="db-sidebar__brand-text">
            <div className="db-sidebar__brand-name">The Curator</div>
            <div className="db-sidebar__brand-sub">Career Intelligence</div>
          </div>
          <button className="db-sidebar__close" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="db-nav" role="navigation" aria-label="Dashboard navigation">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`db-nav__item${active === id ? ' db-nav__item--active' : ''}`}
              onClick={() => handleNav(id)}
              aria-current={active === id ? 'page' : undefined}
            >
              <span className="db-nav__icon"><Icon /></span>
              {label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar__cta">
          <button className="db-sidebar__cta-btn" onClick={onAnalyzeAgain}>
            Analyze Resume
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── DASHBOARD ────────────────────────────────────────────── */
export default function Dashboard({ results, onAnalyzeAgain }) {
  const [view,          setView]   = useState('overview');
  const [activeJob,     setJob]    = useState(null);
  const [sidebarOpen,   setSidebar] = useState(false);

  const handleJobSelect = (job) => {
    setJob(job);
    setView('match-engine');
  };

  const renderView = () => {
    switch (view) {
      case 'overview':
        return <Overview results={results} onJobSelect={handleJobSelect} />;
      case 'match-engine':
        return <SkillGap job={activeJob ?? results.results[0]} results={results} />;
      case 'career-path':
        return <CareerPath results={results} />;
      case 'skill-lab':
        return <SkillLab results={results} />;
      case 'resources':
        return <ResourceLibrary results={results} />;
      case 'resume-builder':
        return <ResumeBuilder results={results} />;
      case 'settings':
        return <Settings results={results} />;
      default:
        return <Overview results={results} onJobSelect={handleJobSelect} />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        active={view}
        onNav={setView}
        onAnalyzeAgain={onAnalyzeAgain}
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
      />
      <main className="db-main">
        {/* Mobile top bar */}
        <div className="db-mobile-bar">
          <button
            className="db-mobile-bar__menu"
            onClick={() => setSidebar(true)}
            aria-label="Open navigation menu"
          >
            <HamburgerIcon />
          </button>
          <div className="db-mobile-bar__brand">
            <div className="db-sidebar__logo"><LogoIcon /></div>
            <span style={{fontFamily:'Manrope,sans-serif',fontWeight:800,fontSize:'0.88rem',color:'var(--ink)'}}>The Curator</span>
          </div>
        </div>
        {renderView()}
      </main>
    </div>
  );
}
