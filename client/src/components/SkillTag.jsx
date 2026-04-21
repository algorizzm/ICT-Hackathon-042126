export default function SkillTag({ skill, variant = 'matched' }) {
  const icons = {
    matched: '✓',
    missing: '✕',
    extracted: '•'
  };

  return (
    <span className={`skill-tag skill-tag--${variant}`}>
      <span className="skill-tag__icon">{icons[variant]}</span>
      {skill}
    </span>
  );
}
