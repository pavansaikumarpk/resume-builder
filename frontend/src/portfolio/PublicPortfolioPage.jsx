import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { FiDownload, FiExternalLink, FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';
import styles from './portfolio.module.css';

const getSafeWebUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

const getTextLines = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && item.trim());
  return typeof value === 'string' && value.trim() ? [value.trim()] : [];
};

const getSkillNames = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills.flatMap((skill) => {
    if (typeof skill === 'string') return [skill];
    if (Array.isArray(skill?.items)) {
      return skill.items.map((item) => typeof item === 'string' ? item : item?.name).filter(Boolean);
    }
    return skill?.name ? [skill.name] : [];
  });
};

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const { publicResume, fetchPublicResume, isLoading } = useResumeStore();

  useEffect(() => {
    if (slug) fetchPublicResume(slug);
  }, [slug, fetchPublicResume]);

  if (isLoading) return <div className={styles.loader}>Loading Professional Profile...</div>;
  if (!publicResume?.resumeData) return <div className={styles.error}>Profile not found or is set to private.</div>;

  const resumeData = publicResume.resumeData;
  // Support both the current editor schema and older saved resumes.
  const personalInfo = resumeData.personalInfo || resumeData.personalDetails || {};
  const fullName = personalInfo.name || [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ') || 'Professional';
  const email = typeof personalInfo.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email) ? personalInfo.email : null;
  const linkedinUrl = getSafeWebUrl(personalInfo.linkedin);
  const githubUrl = getSafeWebUrl(personalInfo.github);
  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const skills = getSkillNames(resumeData.skills);

  return (
    <div className={styles.pageWrapper}>
      <nav className={styles.sideNav} aria-label="Contact and actions">
        <div className={styles.avatar} aria-label={fullName}>{fullName.charAt(0).toUpperCase()}</div>
        <div className={styles.navLinks}>
          {email && <a href={`mailto:${email}`} title="Email" aria-label="Email"><FiMail /></a>}
          {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn"><FiLinkedin /></a>}
          {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub"><FiGithub /></a>}
        </div>
        <button type="button" className={styles.downloadCircle} title="Print or save as PDF" aria-label="Print or save as PDF" onClick={() => window.print()}>
          <FiDownload />
        </button>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.hero}>
          <h1 className={styles.name}>{fullName}</h1>
          <p className={styles.tagline}>{experience[0]?.position || experience[0]?.jobTitle || 'Professional'}</p>
          {resumeData.summary && <div className={styles.summaryCard}><p>{resumeData.summary}</p></div>}
        </header>

        {experience.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <div className={styles.timeline}>
              {experience.map((exp, idx) => (
                <div key={exp._id || exp.id || idx} className={styles.timelineItem}>
                  <div className={styles.timeLineMarker} />
                  <div className={styles.contentCard}>
                    <div className={styles.cardHeader}>
                      <h3>{exp.position || exp.jobTitle || exp.title || 'Role'}</h3>
                      <span className={styles.date}>{[exp.startDate, exp.endDate || exp.duration].filter(Boolean).join(' – ')}</span>
                    </div>
                    {exp.company && <h4 className={styles.company}>{exp.company}</h4>}
                    <ul className={styles.bulletList}>
                      {getTextLines(exp.description).map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Expertise</h2>
            <div className={styles.skillsCloud}>
              {skills.map((skill, idx) => <span key={idx} className={styles.skillTag}>{skill}</span>)}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Featured Projects</h2>
            <div className={styles.projectGrid}>
              {projects.map((project, idx) => {
                const projectUrl = getSafeWebUrl(project.link);
                return (
                  <div key={project._id || project.id || idx} className={styles.projectCard}>
                    <div className={styles.projInfo}>
                      <h3>{project.name || project.title || 'Project'}</h3>
                      {getTextLines(project.description).map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}
                    </div>
                    {projectUrl && <a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.projLink} aria-label={`Open ${project.name || project.title || 'project'}`}><FiExternalLink /></a>}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
