export default function Header() {
  return (
    <header className="header">
      <div className="header__badge">
        <span className="header__badge-dot"></span>
        AI-Powered Analysis
      </div>
      <h1 className="header__title">
        Aptitude <span className="header__title-gradient">& Skill Gap</span> Analyzer
      </h1>
      <p className="header__subtitle">
        Paste your resume below and discover your best career matches, 
        identify skill gaps, and get personalized learning recommendations.
      </p>
    </header>
  );
}
