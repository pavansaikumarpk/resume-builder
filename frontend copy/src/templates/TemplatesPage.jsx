import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import styles from './template.module.css';

const templates = [
  { id: 'harvard-ats', name: 'Elite Suite (Harvard ATS)', preview: 'https://placehold.co/400x600?text=Elite+ATS' },
  { id: 'jakes-resume', name: 'Clean Classic (Tech Standard)', preview: 'https://placehold.co/400x600?text=Classic+Tech' },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleCreate = async (tpl) => {
    setLoading(tpl.id);
    try {
      // FIXED: Sending the exact schema the backend and EditorPanel expect
      const { data } = await api.post('/resume', {
        title: `My ${tpl.name}`,
        templateName: tpl.id,
        resumeData: {
          personalInfo: { firstName: "", email: "", phone: "", location: "", linkedin: "", github: "" },
          summary: "",
          experience: [],
          education: [],
          projects: [],
          skills: [],
          sections: [
            { key: 'personalDetails', title: 'Personal Details', isCustom: false },
            { key: 'summary', title: 'Professional Summary', isCustom: false },
            { key: 'experience', title: 'Experience', isCustom: false },
            { key: 'education', title: 'Education', isCustom: false },
            { key: 'projects', title: 'Projects', isCustom: false },
            { key: 'skills', title: 'Skills', isCustom: false }
          ]
        }
      });
      navigate(`/editor/${data._id}`);
    } catch (err) {
      console.error(err);
      setLoading(null);
      alert("Failed to create resume. Check the backend terminal for validation errors.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Your Blueprint</h1>
      <div className={styles.grid}>
        {templates.map(tpl => (
          <div key={tpl.id} className={styles.card}>
            <img src={tpl.preview} alt={tpl.name} />
            <h3>{tpl.name}</h3>
            <button onClick={() => handleCreate(tpl)} disabled={loading !== null}>
              {loading === tpl.id ? 'Starting Engine...' : 'Select Template'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}