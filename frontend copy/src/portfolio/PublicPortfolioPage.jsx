import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { FiDownload, FiExternalLink, FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';
import styles from './portfolio.module.css';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const { publicResume, fetchPublicResume, isLoading } = useResumeStore();

  useEffect(() => {
    if (slug) fetchPublicResume(slug);
  }, [slug, fetchPublicResume]);

  if (isLoading) return <div className={styles.loader}>Loading Professional Profile...</div>;
  if (!publicResume) return <div className={styles.error}>Profile not found or is set to private.</div>;

  const { resumeData } = publicResume;

  return (
    <div className={styles.pageWrapper}>
      {/* --- FLOATING CONTACT BAR --- */}
      <nav className={styles.sideNav}>
        <div className={styles.avatar}>
          {resumeData.personalDetails?.name?.charAt(0)}
        </div>
        <div className={styles.navLinks}>
          <a href={`mailto:${resumeData.personalDetails?.email}`} title="Email"><FiMail /></a>
          <a href={resumeData.personalDetails?.linkedin} target="_blank" rel="noreferrer"><FiLinkedin /></a>
          <a href={resumeData.personalDetails?.github} target="_blank" rel="noreferrer"><FiGithub /></a>
        </div>
        <button className={styles.downloadCircle} title="Download PDF">
          <FiDownload />
        </button>
      </nav>

      <main className={styles.mainContent}>
        {/* HERO SECTION */}
        <header className={styles.hero}>
          <h1 className={styles.name}>{resumeData.personalDetails?.name}</h1>
          <p className={styles.tagline}>{resumeData.experience?.[0]?.jobTitle || 'Professional'}</p>
          <div className={styles.summaryCard}>
             <p>{resumeData.summary}</p>
          </div>
        </header>

        {/* EXPERIENCE GRID */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={styles.timeline}>
            {resumeData.experience?.map((exp, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timeLineMarker} />
                <div className={styles.contentCard}>
                  <div className={styles.cardHeader}>
                    <h3>{exp.jobTitle}</h3>
                    <span className={styles.date}>{exp.duration}</span>
                  </div>
                  <h4 className={styles.company}>{exp.company}</h4>
                  <ul className={styles.bulletList}>
                    {exp.description?.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS CLOUD */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Expertise</h2>
          <div className={styles.skillsCloud}>
            {resumeData.skills?.map((skill, idx) => (
              <span key={idx} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <div className={styles.projectGrid}>
            {resumeData.projects?.map((proj, idx) => (
              <div key={idx} className={styles.projectCard}>
                <div className={styles.projInfo}>
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                </div>
                <a href={proj.link} className={styles.projLink}><FiExternalLink /></a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}