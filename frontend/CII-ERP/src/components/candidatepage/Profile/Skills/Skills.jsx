// Skills.jsx
// "Skill & Links" tab: displays skill chips and lets the user add new ones
// via a small inline input revealed by the "+" button.
//
// Props:
//   skills        {array}    – list of skill strings
//   onSkillsChange {function(nextSkills)}

import { useState, useRef, useEffect } from 'react';
import Icon from '../Icon/Icon';
import './Skills.css';

export default function Skills({ skills, onSkillsChange }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const commitSkill = () => {
    const value = draft.trim();
    if (value && !skills.some(s => s.toLowerCase() === value.toLowerCase())) {
      onSkillsChange([...skills, value]);
    }
    setDraft('');
    setAdding(false);
  };

  const removeSkill = (skill) => {
    onSkillsChange(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitSkill();
    if (e.key === 'Escape') { setDraft(''); setAdding(false); }
  };

  return (
    <div className="skills">
      <div className="skills__card">
        <span className="skills__card-title">skill</span>

        <div className="skills__chip-row">
          {skills.map(skill => (
            <span key={skill} className="skills__chip">
              {skill}
              <button
                className="skills__chip-remove"
                onClick={() => removeSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                <Icon name="close" size={10} color="var(--blue)" />
              </button>
            </span>
          ))}

          {adding ? (
            <input
              ref={inputRef}
              className="skills__add-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitSkill}
              onKeyDown={handleKeyDown}
              placeholder="Add skill..."
            />
          ) : (
            <button
              className="skills__add-btn"
              onClick={() => setAdding(true)}
              aria-label="Add skill"
            >
              <Icon name="plus" size={14} color="var(--blue)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
