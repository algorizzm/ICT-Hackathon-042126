import { useState, useRef, useCallback } from 'react';
import API_BASE_URL from '../../config';

const API = API_BASE_URL;

// ── Bullet entry block (defined outside to avoid remount on parent re-render) ──
function BulletEntryBlock({
  entry, idx, label, onRemove,
  setter, bulletInput, onTogglePanel, onSetBulletField,
  onGenerate, onEnhance, isGenerating, isEnhancing,
}) {
  const bi = bulletInput || { open: false, industry: '', tasks: '', tools: '', level: 'Mid-level' };
  return (
    <div className="db-rb-role-block">
      <div className="db-rb-role-block__head">
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label} {idx + 1}
        </span>
        <button className="db-rb-delete-btn" onClick={() => onRemove(entry.id)}>Remove</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <input className="db-rb-input" value={entry.org}      onChange={e => setter(entry.id, 'org',      e.target.value)} placeholder="Organization Name" />
        <input className="db-rb-input" value={entry.location} onChange={e => setter(entry.id, 'location', e.target.value)} placeholder="City, State" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <input className="db-rb-input" value={entry.role}  onChange={e => setter(entry.id, 'role',  e.target.value)} placeholder="Position Title / Role" />
        <input className="db-rb-input" value={entry.dates} onChange={e => setter(entry.id, 'dates', e.target.value)} placeholder="Month Year – Month Year" />
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          className="db-rb-input db-rb-textarea"
          value={entry.desc}
          onChange={e => setter(entry.id, 'desc', e.target.value)}
          rows={3}
          placeholder="Describe achievements and responsibilities (one per line)..."
          style={{ paddingBottom: 42 }}
        />
        <button
          className="db-btn db-btn--sm db-ai-btn db-ai-btn--cyan"
          onClick={() => onEnhance(entry.id, entry.desc)}
          disabled={isEnhancing}
          style={{ position: 'absolute', bottom: 8, right: 8 }}
        >
          {isEnhancing ? <><span className="db-ai-btn__spinner" />Enhancing...</> : 'Enhance ✦'}
        </button>
      </div>

      {/* AI Bullet Generator */}
      <div style={{ marginTop: 8 }}>
        <button
          className="db-btn db-btn--ghost db-btn--sm"
          onClick={() => onTogglePanel(entry.id)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>✦</span>
            AI Bullet Generator
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: bi.open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {bi.open && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', background: 'var(--bg-low)', borderRadius: 'var(--r-lg)', border: '1.5px solid rgba(197,197,211,0.24)' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>
              Fill in context and generate 3–5 ATS-optimized bullet points.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input className="db-rb-input" value={bi.industry} onChange={e => onSetBulletField(entry.id, 'industry', e.target.value)} placeholder="Industry (e.g. Finance, Tech)" />
              <select className="db-rb-input" value={bi.level} onChange={e => onSetBulletField(entry.id, 'level', e.target.value)} style={{ cursor: 'pointer' }}>
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Executive</option>
              </select>
            </div>
            <textarea className="db-rb-input db-rb-textarea" value={bi.tasks} onChange={e => onSetBulletField(entry.id, 'tasks', e.target.value)} rows={3} placeholder="Key tasks and responsibilities..." />
            <input className="db-rb-input" value={bi.tools} onChange={e => onSetBulletField(entry.id, 'tools', e.target.value)} placeholder="Tools & skills used" />
            <button
              className="db-btn db-btn--sm db-ai-btn"
              onClick={() => onGenerate(entry.id, entry.role)}
              disabled={isGenerating}
              style={{ alignSelf: 'flex-end' }}
            >
              {isGenerating ? <><span className="db-ai-btn__spinner" />Generating...</> : 'Generate Bullets ✦'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ResumeBuilder({ results }) {
  const extractedSkills = results?.extractedSkills ?? [];
  const topJob          = results?.results?.[0];

  const [openSections, setOpenSections] = useState(new Set(['personal']));
  const toggleSection = (id) =>
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const [isLoadingSummary,    setIsLoadingSummary]    = useState(false);
  const [enhancingId,         setEnhancingId]         = useState(null);
  const [generatingBulletsId, setGeneratingBulletsId] = useState(null);

  const [bulletInputs, setBulletInputs] = useState({});
  const getBulletInput   = (id) => bulletInputs[id] || { open: false, industry: '', tasks: '', tools: extractedSkills.join(', '), level: 'Mid-level' };
  const setBulletField   = useCallback((id, field, value) =>
    setBulletInputs(prev => ({ ...prev, [id]: { ...( prev[id] || getBulletInput(id) ), [field]: value } })), []);
  const toggleBulletPanel = useCallback((id) =>
    setBulletInputs(prev => {
      const cur = prev[id] || { open: false, industry: '', tasks: '', tools: extractedSkills.join(', '), level: 'Mid-level' };
      return { ...prev, [id]: { ...cur, open: !cur.open } };
    }), []);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const notify = (type, msg) => {
    clearTimeout(toastTimer.current);
    setToast({ type, msg });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // ── Resume data (all empty by default) ─────────────────────
  const [resumeData, setResumeData] = useState({
    // Personal Info
    name:         '',
    address:      '',
    cityStateZip: '',
    email:        '',
    phone:        '',

    // AI Summary context
    jobTitle: topJob?.job_title || '',
    summary:  '',

    // University
    uniName:        '',
    uniLocation:    '',
    degree:         '',
    concentration:  '',
    gpa:            '',
    graduationDate: '',
    thesis:         '',
    coursework:     '',
    awards:         '',

    // Study Abroad (optional toggle)
    studyAbroadEnabled:    false,
    studyAbroadProgram:    '',
    studyAbroadLocation:   '',
    studyAbroadDates:      '',
    studyAbroadCoursework: '',

    // High School (optional toggle)
    highSchoolEnabled:  false,
    highSchoolName:     '',
    highSchoolLocation: '',
    highSchoolGradDate: '',
    highSchoolNotes:    '',

    // Experience & Leadership (arrays)
    experience: [],
    leadership: [],

    // Skills & Interests
    technicalSkills:  extractedSkills.join(', '),
    languages:        '',
    laboratorySkills: '',
    interests:        '',
  });

  const setField = useCallback((field, value) =>
    setResumeData(prev => ({ ...prev, [field]: value })), []);

  // Experience helpers
  const setExpField = useCallback((id, field, value) =>
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    })), []);

  const addRole = () =>
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), org: '', role: '', location: '', dates: '', desc: '' }],
    }));

  const removeRole = useCallback((id) =>
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) })), []);

  // Leadership helpers
  const setLeadField = useCallback((id, field, value) =>
    setResumeData(prev => ({
      ...prev,
      leadership: prev.leadership.map(e => e.id === id ? { ...e, [field]: value } : e),
    })), []);

  const addLeadership = () =>
    setResumeData(prev => ({
      ...prev,
      leadership: [...prev.leadership, { id: Date.now(), org: '', role: '', location: '', dates: '', desc: '' }],
    }));

  const removeLeadership = useCallback((id) =>
    setResumeData(prev => ({ ...prev, leadership: prev.leadership.filter(e => e.id !== id) })), []);

  // Summary gating: require name + email + (degree or jobTitle)
  const summaryReady =
    resumeData.name.trim()  !== '' &&
    resumeData.email.trim() !== '' &&
    (resumeData.degree.trim() !== '' || resumeData.jobTitle.trim() !== '');

  // ── AI: Generate summary ────────────────────────────────────
  const handleAutoSummary = async () => {
    if (!summaryReady) return;
    setIsLoadingSummary(true);
    try {
      const res  = await fetch(`${API}/api/ai/summary`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          skills:   extractedSkills,
          jobTitle: resumeData.jobTitle || resumeData.degree,
        }),
      });
      const data = await res.json();
      const text = data.summary || '';
      if (text && !text.startsWith('AI ERROR:')) {
        setField('summary', text);
        notify('success', 'Summary generated by Gemini AI');
      } else {
        notify('error', text.replace('AI ERROR:', '').trim() || data.error || 'Failed to generate summary');
      }
    } catch {
      notify('error', 'Could not reach the AI server — is it running on port 5000?');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // ── AI: Generate bullets ────────────────────────────────────
  const handleGenerateBullets = useCallback(async (entryId, roleTitle, setter) => {
    const inputs = bulletInputs[entryId] || {};
    if (!inputs.tasks?.trim()) {
      notify('error', 'Describe tasks/responsibilities before generating.');
      return;
    }
    setGeneratingBulletsId(entryId);
    try {
      const res = await fetch(`${API}/api/ai/bullets`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle:        roleTitle,
          industry:        inputs.industry || '',
          userTasks:       inputs.tasks,
          tools:           inputs.tools || '',
          experienceLevel: inputs.level || 'Mid-level',
        }),
      });
      const data = await res.json();
      const text = data.bullets || '';
      if (text && !text.startsWith('AI ERROR:')) {
        const lines = text.split('\n').filter(l => l.trim()).map(l => l.replace(/^[-*]\s*/, '').trim()).join('\n');
        setter(entryId, 'desc', lines);
        notify('success', 'Bullet points generated by Gemini AI');
      } else {
        notify('error', text.replace('AI ERROR:', '').trim() || data.error || 'Failed to generate bullets');
      }
    } catch {
      notify('error', 'Could not reach the AI server — is it running on port 5000?');
    } finally {
      setGeneratingBulletsId(null);
    }
  }, [bulletInputs]);

  // ── AI: Enhance bullet ──────────────────────────────────────
  const handleEnhanceBullet = useCallback(async (id, currentText, setter) => {
    if (!currentText.trim()) { notify('error', 'Write something first before enhancing.'); return; }
    setEnhancingId(id);
    try {
      const res  = await fetch(`${API}/api/ai/enhance`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: currentText }),
      });
      const data = await res.json();
      const text = data.enhanced || '';
      if (text && !text.startsWith('AI ERROR:')) {
        setter(id, 'desc', text);
        notify('success', 'Bullet enhanced by Gemini AI');
      } else {
        notify('error', text.replace('AI ERROR:', '').trim() || data.error || 'Failed to enhance bullet');
      }
    } catch {
      notify('error', 'Could not reach the AI server — is it running on port 5000?');
    } finally {
      setEnhancingId(null);
    }
  }, []);

  const handlePrint = () => window.print();

  // ── Sections ────────────────────────────────────────────────
  const sections = [
    {
      id:    'personal',
      title: 'Personal Information',
      badge: 'Required',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input className="db-rb-input" value={resumeData.name}         onChange={e => setField('name',         e.target.value)} placeholder="Full Name *" />
          <input className="db-rb-input" value={resumeData.address}      onChange={e => setField('address',      e.target.value)} placeholder="Home or Campus Street Address" />
          <input className="db-rb-input" value={resumeData.cityStateZip} onChange={e => setField('cityStateZip', e.target.value)} placeholder="City, State ZIP" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input className="db-rb-input" value={resumeData.email} onChange={e => setField('email', e.target.value)} placeholder="Email Address *" />
            <input className="db-rb-input" value={resumeData.phone} onChange={e => setField('phone', e.target.value)} placeholder="Phone Number" />
          </div>
        </div>
      ),
    },
    {
      id:    'education',
      title: 'Education',
      badge: 'Required',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* University */}
          <div className="db-rb-role-block">
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
              University / College
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input className="db-rb-input" value={resumeData.uniName}     onChange={e => setField('uniName',     e.target.value)} placeholder="University Name" />
              <input className="db-rb-input" value={resumeData.uniLocation} onChange={e => setField('uniLocation', e.target.value)} placeholder="City, State" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input className="db-rb-input" value={resumeData.degree}        onChange={e => setField('degree',        e.target.value)} placeholder="Degree (e.g. B.S., M.A.)" />
              <input className="db-rb-input" value={resumeData.concentration} onChange={e => setField('concentration', e.target.value)} placeholder="Concentration / Major" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input className="db-rb-input" value={resumeData.graduationDate} onChange={e => setField('graduationDate', e.target.value)} placeholder="Graduation Date (e.g. May 2025)" />
              <input className="db-rb-input" value={resumeData.gpa}            onChange={e => setField('gpa',            e.target.value)} placeholder="GPA (optional)" />
            </div>
            <input className="db-rb-input" value={resumeData.thesis}     onChange={e => setField('thesis',     e.target.value)} placeholder="Thesis title (optional)"                       style={{ marginBottom: 8 }} />
            <input className="db-rb-input" value={resumeData.coursework} onChange={e => setField('coursework', e.target.value)} placeholder="Relevant Coursework (optional, comma-separated)" style={{ marginBottom: 8 }} />
            <input className="db-rb-input" value={resumeData.awards}     onChange={e => setField('awards',     e.target.value)} placeholder="Awards & Honors (optional)" />
          </div>

          {/* Study Abroad */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--ink-2)', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={resumeData.studyAbroadEnabled} onChange={e => setField('studyAbroadEnabled', e.target.checked)} />
              Include Study Abroad
            </label>
            {resumeData.studyAbroadEnabled && (
              <div className="db-rb-role-block" style={{ marginTop: 8 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Study Abroad</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <input className="db-rb-input" value={resumeData.studyAbroadProgram}  onChange={e => setField('studyAbroadProgram',  e.target.value)} placeholder="Program Name" />
                  <input className="db-rb-input" value={resumeData.studyAbroadLocation} onChange={e => setField('studyAbroadLocation', e.target.value)} placeholder="City, Country" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="db-rb-input" value={resumeData.studyAbroadDates}      onChange={e => setField('studyAbroadDates',      e.target.value)} placeholder="Month Year – Month Year" />
                  <input className="db-rb-input" value={resumeData.studyAbroadCoursework} onChange={e => setField('studyAbroadCoursework', e.target.value)} placeholder="Coursework (optional)" />
                </div>
              </div>
            )}
          </div>

          {/* High School */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--ink-2)', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={resumeData.highSchoolEnabled} onChange={e => setField('highSchoolEnabled', e.target.checked)} />
              Include High School
            </label>
            {resumeData.highSchoolEnabled && (
              <div className="db-rb-role-block" style={{ marginTop: 8 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>High School</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <input className="db-rb-input" value={resumeData.highSchoolName}     onChange={e => setField('highSchoolName',     e.target.value)} placeholder="School Name" />
                  <input className="db-rb-input" value={resumeData.highSchoolLocation} onChange={e => setField('highSchoolLocation', e.target.value)} placeholder="City, State" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="db-rb-input" value={resumeData.highSchoolGradDate} onChange={e => setField('highSchoolGradDate', e.target.value)} placeholder="Graduation Date" />
                  <input className="db-rb-input" value={resumeData.highSchoolNotes}    onChange={e => setField('highSchoolNotes',    e.target.value)} placeholder="GPA / Test Scores / Honors (optional)" />
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id:    'summary',
      title: 'Professional Summary',
      badge: 'AI Powered · Optional',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            className="db-rb-input"
            value={resumeData.jobTitle}
            onChange={e => setField('jobTitle', e.target.value)}
            placeholder="Target Role / Career Goal (used by AI to tailor summary)"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', flex: 1, lineHeight: 1.5 }}>
              AI uses your target role, degree, and extracted skills to write a tailored summary.
              {!summaryReady && (
                <span style={{ display: 'block', color: 'var(--red, #dc2626)', marginTop: 4, fontWeight: 600 }}>
                  Complete Name, Email, and Degree or Target Role first.
                </span>
              )}
            </span>
            <button
              className="db-btn db-btn--sm db-ai-btn"
              onClick={handleAutoSummary}
              disabled={isLoadingSummary || !summaryReady}
              title={!summaryReady ? 'Complete required fields first' : ''}
            >
              {isLoadingSummary ? <><span className="db-ai-btn__spinner" />Generating...</> : 'Auto-Write ✦'}
            </button>
          </div>
          <textarea
            className="db-rb-input db-rb-textarea"
            value={resumeData.summary}
            onChange={e => setField('summary', e.target.value)}
            rows={4}
            placeholder="Write a professional summary or use Auto-Write..."
          />
        </div>
      ),
    },
    {
      id:    'experience',
      title: 'Experience',
      badge: resumeData.experience.length > 0 ? `${resumeData.experience.length} ${resumeData.experience.length === 1 ? 'Entry' : 'Entries'}` : 'Required',
      content: (
        <div>
          {resumeData.experience.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginBottom: 10, lineHeight: 1.5 }}>
              List positions in reverse chronological order (most recent first).
            </p>
          )}
          {resumeData.experience.map((job, idx) => (
            <BulletEntryBlock
              key={job.id}
              entry={job}
              idx={idx}
              label="Position"
              onRemove={removeRole}
              setter={setExpField}
              bulletInput={bulletInputs[job.id]}
              onTogglePanel={toggleBulletPanel}
              onSetBulletField={setBulletField}
              onGenerate={(id, role) => handleGenerateBullets(id, role, setExpField)}
              onEnhance={(id, text) => handleEnhanceBullet(id, text, setExpField)}
              isGenerating={generatingBulletsId === job.id}
              isEnhancing={enhancingId === job.id}
            />
          ))}
          <button className="db-btn db-btn--ghost db-btn--full db-btn--sm" onClick={addRole} style={{ marginTop: 4 }}>
            + Add Position
          </button>
        </div>
      ),
    },
    {
      id:    'leadership',
      title: 'Leadership & Activities',
      badge: resumeData.leadership.length > 0 ? `${resumeData.leadership.length} Entries` : 'Optional',
      content: (
        <div>
          {resumeData.leadership.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginBottom: 10, lineHeight: 1.5 }}>
              Include clubs, volunteer work, campus organizations, or other activities.
            </p>
          )}
          {resumeData.leadership.map((entry, idx) => (
            <BulletEntryBlock
              key={entry.id}
              entry={entry}
              idx={idx}
              label="Activity"
              onRemove={removeLeadership}
              setter={setLeadField}
              bulletInput={bulletInputs[entry.id]}
              onTogglePanel={toggleBulletPanel}
              onSetBulletField={setBulletField}
              onGenerate={(id, role) => handleGenerateBullets(id, role, setLeadField)}
              onEnhance={(id, text) => handleEnhanceBullet(id, text, setLeadField)}
              isGenerating={generatingBulletsId === entry.id}
              isEnhancing={enhancingId === entry.id}
            />
          ))}
          <button className="db-btn db-btn--ghost db-btn--full db-btn--sm" onClick={addLeadership} style={{ marginTop: 4 }}>
            + Add Activity
          </button>
        </div>
      ),
    },
    {
      id:    'skills',
      title: 'Skills & Interests',
      badge: 'Optional',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {extractedSkills.length > 0 && (
            <div style={{ background: 'var(--bg-low)', borderRadius: 'var(--r-md)', padding: '8px 12px' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0 0 6px' }}>
                Extracted from your resume analysis — copy into Technical Skills as needed:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {extractedSkills.slice(0, 20).map(s => <span key={s} className="db-chip db-chip--skill">{s}</span>)}
              </div>
            </div>
          )}
          <input className="db-rb-input" value={resumeData.technicalSkills}  onChange={e => setField('technicalSkills',  e.target.value)} placeholder="Technical Skills (software, languages, tools)" />
          <input className="db-rb-input" value={resumeData.languages}        onChange={e => setField('languages',        e.target.value)} placeholder="Languages (e.g. Spanish – Fluent, Mandarin – Basic)" />
          <input className="db-rb-input" value={resumeData.laboratorySkills} onChange={e => setField('laboratorySkills', e.target.value)} placeholder="Laboratory / Research Skills (if applicable)" />
          <input className="db-rb-input" value={resumeData.interests}        onChange={e => setField('interests',        e.target.value)} placeholder="Interests (e.g. Photography, Rock Climbing, Chess)" />
        </div>
      ),
    },
  ];

  // ── Harvard template helpers ────────────────────────────────
  const hvContact = [resumeData.address, resumeData.cityStateZip, resumeData.email, resumeData.phone].filter(Boolean);

  return (
    <div className="db-resume-builder db-animate">

      {toast && (
        <div className={`db-ai-toast db-ai-toast--${toast.type}`}>
          <span className="db-ai-toast__icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      <style>{`
        .db-rb-input {
          width: 100%; border: 1.5px solid rgba(197,197,211,0.32);
          border-radius: var(--r-sm); padding: 9px 12px;
          font-family: inherit; font-size: 0.84rem;
          color: var(--ink); background: var(--card);
          transition: border-color 0.18s, box-shadow 0.18s;
          display: block; box-sizing: border-box;
        }
        .db-rb-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,58,138,0.08); }
        .db-rb-input:disabled { opacity: 0.45; cursor: not-allowed; }
        .db-rb-textarea { resize: vertical; min-height: 76px; }
        .db-rb-role-block { background: var(--bg-low); border-radius: var(--r-lg); padding: 14px; margin-bottom: 10px; }
        .db-rb-role-block__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .db-rb-delete-btn {
          background: none; border: none; font-size: 0.7rem; font-weight: 700;
          color: var(--red); cursor: pointer; padding: 3px 8px;
          border-radius: var(--r-sm); transition: background 0.15s;
        }
        .db-rb-delete-btn:hover { background: var(--red-bg); }

        /* ── Harvard Print Template — hidden on screen ── */
        .hv-resume { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          .hv-resume, .hv-resume * { visibility: visible !important; }
          .hv-resume {
            display: block !important;
            position: absolute; top: 0; left: 0;
            width: 100%; padding: 0.5in 0.7in;
            box-sizing: border-box; background: #fff;
          }
          @page { margin: 0; size: letter; }
        }
        /* Harvard typography */
        .hv-name {
          font-family: 'Times New Roman', serif; font-size: 14pt;
          font-weight: bold; text-align: center; color: #000; margin: 0 0 3pt;
        }
        .hv-contact {
          font-family: 'Times New Roman', serif; font-size: 10pt;
          text-align: center; color: #000; margin: 0 0 4pt;
        }
        .hv-rule { border: none; border-top: 1px solid #000; margin: 3pt 0; }
        .hv-section { margin-top: 7pt; }
        .hv-section-title {
          font-family: 'Times New Roman', serif; font-size: 11pt;
          font-weight: bold; text-align: center; color: #000; margin: 0 0 2pt;
        }
        .hv-entry { margin-bottom: 7pt; }
        .hv-row {
          display: flex; justify-content: space-between; align-items: baseline;
          font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; line-height: 1.3;
        }
        .hv-row-bold { font-weight: bold; }
        .hv-row-right { white-space: nowrap; margin-left: 6pt; }
        .hv-sub {
          display: flex; justify-content: space-between; align-items: baseline;
          font-family: 'Times New Roman', serif; font-size: 11pt;
          color: #000; line-height: 1.3; font-style: italic;
        }
        .hv-sub .hv-row-right { font-style: normal; }
        .hv-meta {
          font-family: 'Times New Roman', serif; font-size: 10.5pt;
          color: #000; line-height: 1.45; margin: 1pt 0;
        }
        .hv-bullets {
          margin: 2pt 0 0; padding-left: 15pt;
          font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000;
        }
        .hv-bullets li { margin-bottom: 2pt; line-height: 1.4; }
        .hv-skill-row {
          font-family: 'Times New Roman', serif; font-size: 10.5pt;
          color: #000; line-height: 1.65;
        }
        .hv-skill-row b { font-weight: bold; }
      `}</style>

      {/* ── Left: Editor ── */}
      <div className="db-rb-left">
        <div className="db-rb-header">
          <div className="db-badge db-badge--cyan" style={{ marginBottom: 8 }}>
            <span className="db-badge__dot" />AI Sync Active
          </div>
          <div className="db-rb-title">Resume Builder</div>
          <p className="db-rb-subtitle">Fill in all sections, then Download PDF for a Harvard-format resume.</p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <button className="db-btn db-btn--primary db-btn--sm" onClick={handlePrint}>
            Download PDF
          </button>
        </div>

        {sections.map(s => (
          <div key={s.id} className="db-rb-section">
            <div className="db-rb-section__head" onClick={() => toggleSection(s.id)}>
              <span className="db-rb-section__title">{s.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="db-rb-section__badge">{s.badge}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: openSections.has(s.id) ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {openSections.has(s.id) && <div className="db-rb-section__body">{s.content}</div>}
          </div>
        ))}
      </div>

      {/* ── Right: Live Preview ── */}
      <div className="db-rb-preview">
        <div className="db-rb-preview__header">
          <div className="db-rb-preview__name">{resumeData.name || 'YOUR NAME'}</div>
          <div className="db-rb-preview__meta">
            {hvContact.map((item, i) => (
              <span key={i}>
                {item}
                {i < hvContact.length - 1 && <span style={{ margin: '0 5px', opacity: 0.4 }}>•</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="db-rb-preview__body">

          {/* Summary */}
          {resumeData.summary && (
            <div className="db-rb-preview__section">
              <div className="db-rb-preview__section-title">Professional Summary</div>
              <p className="db-rb-preview__text">{resumeData.summary}</p>
            </div>
          )}

          {/* Education */}
          {(resumeData.uniName || resumeData.degree) && (
            <div className="db-rb-preview__section">
              <div className="db-rb-preview__section-title">Education</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f1830' }}>{resumeData.uniName}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>{resumeData.uniLocation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.74rem', color: '#374151' }}>
                    {[resumeData.degree, resumeData.concentration].filter(Boolean).join(', ')}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>{resumeData.graduationDate}</span>
                </div>
                {resumeData.gpa        && <div style={{ fontSize: '0.72rem', color: '#6b7a99' }}>GPA: {resumeData.gpa}</div>}
                {resumeData.thesis     && <div style={{ fontSize: '0.72rem', color: '#6b7a99' }}>Thesis: {resumeData.thesis}</div>}
                {resumeData.coursework && <div style={{ fontSize: '0.72rem', color: '#6b7a99' }}>Coursework: {resumeData.coursework}</div>}
                {resumeData.awards     && <div style={{ fontSize: '0.72rem', color: '#6b7a99' }}>Awards: {resumeData.awards}</div>}
              </div>
              {resumeData.studyAbroadEnabled && resumeData.studyAbroadProgram && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.79rem', color: '#0f1830' }}>{resumeData.studyAbroadProgram}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>{resumeData.studyAbroadLocation}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6b7a99' }}>{resumeData.studyAbroadCoursework}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>{resumeData.studyAbroadDates}</span>
                  </div>
                </div>
              )}
              {resumeData.highSchoolEnabled && resumeData.highSchoolName && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.79rem', color: '#0f1830' }}>{resumeData.highSchoolName}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>{resumeData.highSchoolLocation}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6b7a99' }}>{resumeData.highSchoolNotes}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>{resumeData.highSchoolGradDate}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.some(j => j.org || j.role) && (
            <div className="db-rb-preview__section">
              <div className="db-rb-preview__section-title">Experience</div>
              {resumeData.experience.map(job => (job.org || job.role) ? (
                <div key={job.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#0f1830' }}>{job.org}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99', whiteSpace: 'nowrap', marginLeft: 8 }}>{job.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.74rem', color: '#374151', fontStyle: 'italic' }}>{job.role}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99', whiteSpace: 'nowrap', marginLeft: 8 }}>{job.dates}</span>
                  </div>
                  {job.desc && (
                    <ul style={{ paddingLeft: 14, margin: '3px 0 0' }}>
                      {job.desc.split('\n').filter(l => l.trim()).map((line, i) => (
                        <li key={i} style={{ fontSize: '0.73rem', color: '#374151', lineHeight: 1.55 }}>{line.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null)}
            </div>
          )}

          {/* Leadership */}
          {resumeData.leadership.some(e => e.org || e.role) && (
            <div className="db-rb-preview__section">
              <div className="db-rb-preview__section-title">Leadership & Activities</div>
              {resumeData.leadership.map(entry => (entry.org || entry.role) ? (
                <div key={entry.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#0f1830' }}>{entry.org}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99', whiteSpace: 'nowrap', marginLeft: 8 }}>{entry.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.74rem', color: '#374151', fontStyle: 'italic' }}>{entry.role}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7a99', whiteSpace: 'nowrap', marginLeft: 8 }}>{entry.dates}</span>
                  </div>
                  {entry.desc && (
                    <ul style={{ paddingLeft: 14, margin: '3px 0 0' }}>
                      {entry.desc.split('\n').filter(l => l.trim()).map((line, i) => (
                        <li key={i} style={{ fontSize: '0.73rem', color: '#374151', lineHeight: 1.55 }}>{line.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null)}
            </div>
          )}

          {/* Skills */}
          {(resumeData.technicalSkills || resumeData.languages || resumeData.laboratorySkills || resumeData.interests) && (
            <div className="db-rb-preview__section">
              <div className="db-rb-preview__section-title">Skills & Interests</div>
              {resumeData.technicalSkills  && <div style={{ fontSize: '0.73rem', color: '#374151', lineHeight: 1.6 }}><strong>Technical: </strong>{resumeData.technicalSkills}</div>}
              {resumeData.languages        && <div style={{ fontSize: '0.73rem', color: '#374151', lineHeight: 1.6 }}><strong>Language: </strong>{resumeData.languages}</div>}
              {resumeData.laboratorySkills && <div style={{ fontSize: '0.73rem', color: '#374151', lineHeight: 1.6 }}><strong>Laboratory: </strong>{resumeData.laboratorySkills}</div>}
              {resumeData.interests        && <div style={{ fontSize: '0.73rem', color: '#374151', lineHeight: 1.6 }}><strong>Interests: </strong>{resumeData.interests}</div>}
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          Harvard-format Print Template (hidden on screen)
          ══════════════════════════════════════════════════════════ */}
      <div className="hv-resume">

        {/* Header */}
        <div className="hv-name">{resumeData.name || 'Your Name'}</div>
        {hvContact.length > 0 && <div className="hv-contact">{hvContact.join(' • ')}</div>}
        <hr className="hv-rule" />

        {/* Education */}
        {(resumeData.uniName || resumeData.degree ||
          (resumeData.studyAbroadEnabled && resumeData.studyAbroadProgram) ||
          (resumeData.highSchoolEnabled  && resumeData.highSchoolName)) && (
          <div className="hv-section">
            <div className="hv-section-title">Education</div>
            <hr className="hv-rule" />

            {/* University */}
            {(resumeData.uniName || resumeData.degree) && (
              <div className="hv-entry">
                <div className="hv-row">
                  <span className="hv-row-bold">{resumeData.uniName}</span>
                  <span className="hv-row-right">{resumeData.uniLocation}</span>
                </div>
                <div className="hv-row">
                  <span>{[resumeData.degree, resumeData.concentration].filter(Boolean).join(', ')}</span>
                  <span className="hv-row-right">{resumeData.graduationDate}</span>
                </div>
                {resumeData.gpa        && <div className="hv-meta">GPA: {resumeData.gpa}</div>}
                {resumeData.thesis     && <div className="hv-meta">Thesis: {resumeData.thesis}</div>}
                {resumeData.coursework && <div className="hv-meta">Relevant Coursework: {resumeData.coursework}</div>}
                {resumeData.awards     && <div className="hv-meta">Awards and Honors: {resumeData.awards}</div>}
              </div>
            )}

            {/* Study Abroad */}
            {resumeData.studyAbroadEnabled && resumeData.studyAbroadProgram && (
              <div className="hv-entry">
                <div className="hv-row">
                  <span className="hv-row-bold">{resumeData.studyAbroadProgram}</span>
                  <span className="hv-row-right">{resumeData.studyAbroadLocation}</span>
                </div>
                <div className="hv-row">
                  <span>
                    {resumeData.studyAbroadCoursework
                      ? `Study abroad coursework in ${resumeData.studyAbroadCoursework}`
                      : 'Study Abroad Program'}
                  </span>
                  <span className="hv-row-right">{resumeData.studyAbroadDates}</span>
                </div>
              </div>
            )}

            {/* High School */}
            {resumeData.highSchoolEnabled && resumeData.highSchoolName && (
              <div className="hv-entry">
                <div className="hv-row">
                  <span className="hv-row-bold">{resumeData.highSchoolName}</span>
                  <span className="hv-row-right">{resumeData.highSchoolLocation}</span>
                </div>
                <div className="hv-row">
                  <span>{resumeData.highSchoolNotes}</span>
                  <span className="hv-row-right">{resumeData.highSchoolGradDate}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.some(j => j.org || j.role) && (
          <div className="hv-section">
            <div className="hv-section-title">Experience</div>
            <hr className="hv-rule" />
            {resumeData.experience.map(job => (job.org || job.role) ? (
              <div key={job.id} className="hv-entry">
                <div className="hv-row">
                  <span className="hv-row-bold">{job.org}</span>
                  <span className="hv-row-right">{job.location}</span>
                </div>
                <div className="hv-sub">
                  <span>{job.role}</span>
                  <span className="hv-row-right">{job.dates}</span>
                </div>
                {job.desc && (
                  <ul className="hv-bullets">
                    {job.desc.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i}>{line.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null)}
          </div>
        )}

        {/* Leadership & Activities */}
        {resumeData.leadership.some(e => e.org || e.role) && (
          <div className="hv-section">
            <div className="hv-section-title">Leadership &amp; Activities</div>
            <hr className="hv-rule" />
            {resumeData.leadership.map(entry => (entry.org || entry.role) ? (
              <div key={entry.id} className="hv-entry">
                <div className="hv-row">
                  <span className="hv-row-bold">{entry.org}</span>
                  <span className="hv-row-right">{entry.location}</span>
                </div>
                <div className="hv-sub">
                  <span>{entry.role}</span>
                  <span className="hv-row-right">{entry.dates}</span>
                </div>
                {entry.desc && (
                  <ul className="hv-bullets">
                    {entry.desc.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i}>{line.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null)}
          </div>
        )}

        {/* Skills & Interests */}
        {(resumeData.technicalSkills || resumeData.languages || resumeData.laboratorySkills || resumeData.interests) && (
          <div className="hv-section">
            <div className="hv-section-title">Skills &amp; Interests</div>
            <hr className="hv-rule" />
            {resumeData.technicalSkills  && <div className="hv-skill-row"><b>Technical: </b>{resumeData.technicalSkills}</div>}
            {resumeData.languages        && <div className="hv-skill-row"><b>Language: </b>{resumeData.languages}</div>}
            {resumeData.laboratorySkills && <div className="hv-skill-row"><b>Laboratory: </b>{resumeData.laboratorySkills}</div>}
            {resumeData.interests        && <div className="hv-skill-row"><b>Interests: </b>{resumeData.interests}</div>}
          </div>
        )}

      </div>
    </div>
  );
}
