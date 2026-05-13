import React from 'react';
import styles from './analysis.module.css';
import { FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';

export const AnalysisResults = ({ results }) => {
  return (
    <div className={styles.resultsContainer}>
      <div className={styles.scoreHeader}>
        <div className={styles.radialProgress} style={{'--value': results.score}}>
          {results.score}%
        </div>
        <h3>ATS Optimization</h3>
      </div>

      <div className={styles.feedbackSection}>
        <header><FiStar /> Strategic Advice</header>
        <p>{results.strategicFeedback}</p>
      </div>

      <div className={styles.keywordGrid}>
        <header>Missing Keywords</header>
        <div className={styles.chips}>
          {results.missingKeywords?.map(kw => (
            <span key={kw} className={styles.keywordChip}><FiAlertCircle /> {kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
};