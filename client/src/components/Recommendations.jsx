import { useState } from 'react';

export default function Recommendations({ recommendations }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="recommendations">
      <button
        className="recommendations__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`recommendations__toggle-icon ${isOpen ? 'recommendations__toggle-icon--open' : ''}`}>
          ▶
        </span>
        {isOpen ? 'Hide' : 'Show'} Learning Resources ({recommendations.length} skill{recommendations.length !== 1 ? 's' : ''})
      </button>

      {isOpen && (
        <div className="recommendations__list">
          {recommendations.map((rec, idx) => (
            <div className="recommendation-item" key={idx}>
              <span className="recommendation-item__skill">{rec.skill}</span>
              <div className="recommendation-item__resources">
                {rec.resources.map((resource, rIdx) => (
                  <a
                    key={rIdx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="recommendation-item__link"
                  >
                    <span className="recommendation-item__link-icon">↗</span>
                    {resource.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
