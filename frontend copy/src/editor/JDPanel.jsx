import React, { useState } from 'react';
import { FiTarget, FiZap, FiBarChart2 } from 'react-icons/fi';
import styles from './jd.module.css';

export const JDPanel = () => {
  const [jdText, setJdText] = useState('');

  return (
    <div className={styles.panelContainer}>
      <header className={styles.header}>
        <FiTarget className={styles.icon} />
        <span>Target Analysis</span>
      </header>

      <div className={styles.content}>
        <label className={styles.label}>Paste Job Description</label>
        <textarea 
          className={styles.textarea}
          placeholder="Paste the JD here to trigger AI gap analysis..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        
        <button className={styles.analyzeBtn}>
          <FiZap /> Analyze Keywords
        </button>
      </div>

      <div className={styles.statsCard}>
        <div className={styles.statHeader}>
          <FiBarChart2 />
          <span>Keyword Match</span>
        </div>
        <div className={styles.score}>0%</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
};