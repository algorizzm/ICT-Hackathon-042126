export default function CircularProgress({ score }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let levelClass = 'low';
  if (score >= 70) levelClass = 'high';
  else if (score >= 40) levelClass = 'medium';

  return (
    <div className="circular-progress" title={`${score}% match`}>
      {/* SVG gradient definitions */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="circular-progress__svg" viewBox="0 0 90 90">
        <circle
          className="circular-progress__bg"
          cx="45"
          cy="45"
          r={radius}
        />
        <circle
          className={`circular-progress__fill circular-progress__fill--${levelClass}`}
          cx="45"
          cy="45"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="circular-progress__text">
        <div className="circular-progress__value">{Math.round(score)}%</div>
        <div className="circular-progress__label">match</div>
      </div>
    </div>
  );
}
