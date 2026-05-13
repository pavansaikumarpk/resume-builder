






// const React = require('react');
// const { renderToStream, Page, Text, View, Document, StyleSheet } = require('@react-pdf/renderer');

// // ==========================================
// // HELPER: RENDER SKILLS
// // ==========================================
// const renderSkillText = (text) => {
//     if (typeof text === 'string' && text.includes(':')) {
//         const parts = text.split(':');
//         return <Text><Text style={{ fontWeight: 'bold' }}>{parts[0]}:</Text>{parts.slice(1).join(':')}</Text>;
//     }
//     return <Text>{text}</Text>;
// };

// // ==========================================
// // 1. HARVARD TEMPLATE (ATS SAFE)
// // ==========================================
// const harvardStyles = StyleSheet.create({
//     page: { fontFamily: 'Times-Roman', fontSize: 11, padding: '1in', color: '#000', lineHeight: 1.3 },
//     headerText: { textAlign: 'center', marginBottom: 16 },
//     name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
//     contact: { fontSize: 10 },
//     section: { marginBottom: 10 },
//     sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, marginBottom: 8, marginTop: 16 },
//     itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
//     bold: { fontWeight: 'bold' },
//     italic: { fontStyle: 'italic' },
//     bulletRow: { flexDirection: 'row', marginTop: 3 },
//     bullet: { width: 15 },
//     bulletText: { flex: 1 }
// });

// const HarvardTemplate = ({ data }) => {
//     const personal = data.personalInfo || data.personalDetails || {};
//     const sections = data.sections || [];
//     const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';

//     return (
//         <Document>
//             <Page size="A4" style={harvardStyles.page}>
//                 <View style={harvardStyles.headerText}>
//                     <Text style={harvardStyles.name}>{fullName}</Text>
//                     <Text style={harvardStyles.contact}>
//                         {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join('   ')}
//                     </Text>
//                 </View>

//                 {sections.map((section, idx) => {
//                     if (section.key === 'personalDetails') return null;

//                     if (section.key === 'summary' && data.summary) {
//                         return (
//                             <View key={idx} style={harvardStyles.section}>
//                                 <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
//                                 <Text>{data.summary}</Text>
//                             </View>
//                         );
//                     }

//                     if (section.key === 'education' && data.education?.length > 0) {
//                         return (
//                             <View key={idx} style={harvardStyles.section}>
//                                 <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
//                                 {data.education.map((edu, i) => (
//                                     <View key={i} style={{ marginBottom: 8 }}>
//                                         <View style={harvardStyles.itemRow}>
//                                             <Text style={harvardStyles.bold}>{edu.institution}</Text>
//                                             <Text>{edu.startDate} - {edu.endDate}</Text>
//                                         </View>
//                                         <Text style={harvardStyles.italic}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.key === 'experience' && data.experience?.length > 0) {
//                         return (
//                             <View key={idx} style={harvardStyles.section}>
//                                 <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
//                                 {data.experience.map((exp, i) => (
//                                     <View key={i} style={{ marginBottom: 12 }}>
//                                         <View style={harvardStyles.itemRow}>
//                                             <Text style={harvardStyles.bold}>{exp.company}</Text>
//                                             <Text>{exp.startDate} - {exp.endDate}</Text>
//                                         </View>
//                                         <Text style={harvardStyles.italic}>{exp.position || exp.jobTitle}</Text>
//                                         {exp.description && (Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
//                                             <View key={j} style={harvardStyles.bulletRow}>
//                                                 <Text style={harvardStyles.bullet}>•</Text>
//                                                 <Text style={harvardStyles.bulletText}>{d}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.key === 'projects' && data.projects?.length > 0) {
//                         return (
//                             <View key={idx} style={harvardStyles.section}>
//                                 <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
//                                 {data.projects.map((proj, i) => (
//                                     <View key={i} style={{ marginBottom: 8 }}>
//                                         <Text style={harvardStyles.bold}>{proj.name || proj.title}</Text>
//                                         {proj.description && (Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
//                                             <View key={j} style={harvardStyles.bulletRow}>
//                                                 <Text style={harvardStyles.bullet}>•</Text>
//                                                 <Text style={harvardStyles.bulletText}>{d}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.key === 'skills' && data.skills?.length > 0) {
//                         return (
//                             <View key={idx} style={harvardStyles.section}>
//                                 <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
//                                 {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => (
//                                     <View key={j} style={harvardStyles.bulletRow}>
//                                         <Text style={harvardStyles.bullet}>•</Text>
//                                         <Text style={harvardStyles.bulletText}>{renderSkillText(skill)}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.isCustom && data[section.key]) {
//                         return (
//                             <View key={idx} style={harvardStyles.section}>
//                                 <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
//                                 {section.type === 'text' ? <Text>{data[section.key]}</Text> : (
//                                     Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
//                                         <View key={i} style={{ marginBottom: 8 }}>
//                                             <View style={harvardStyles.itemRow}>
//                                                 <Text style={harvardStyles.bold}>{item.title}</Text>
//                                                 <Text>{item.date}</Text>
//                                             </View>
//                                             {item.bulletPoints && (Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
//                                                 <View key={bIdx} style={harvardStyles.bulletRow}>
//                                                     <Text style={harvardStyles.bullet}>•</Text>
//                                                     <Text style={harvardStyles.bulletText}>{b}</Text>
//                                                 </View>
//                                             ))}
//                                         </View>
//                                     ))
//                                 )}
//                             </View>
//                         );
//                     }
//                     return null;
//                 })}
//             </Page>
//         </Document>
//     );
// };

// // ==========================================
// // 2. JAKE TEMPLATE (TECH STANDARD)
// // ==========================================
// const jakesStyles = StyleSheet.create({
//     page: { fontFamily: 'Times-Roman', fontSize: 10, padding: '0.5in 0.75in', color: '#000' },
//     header: { textAlign: 'center', marginBottom: 12 },
//     name: { fontSize: 26, fontWeight: 'bold' },
//     contact: { fontSize: 10, marginTop: 4 },
//     sectionTitle: { fontSize: 14, fontWeight: 'bold', borderBottomWidth: 1, marginBottom: 6, marginTop: 12 },
//     row: { flexDirection: 'row', justifyContent: 'space-between' },
//     bold: { fontWeight: 'bold' },
//     italic: { fontStyle: 'italic' },
//     bulletRow: { flexDirection: 'row', marginTop: 2 },
//     bullet: { width: 12 },
//     bulletText: { flex: 1 }
// });

// const JakesTemplate = ({ data }) => {
//     const personal = data.personalInfo || data.personalDetails || {};
//     const sections = data.sections || [];
//     const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';

//     return (
//         <Document>
//             <Page size="A4" style={jakesStyles.page}>
//                 <View style={jakesStyles.header}>
//                     <Text style={jakesStyles.name}>{fullName}</Text>
//                     <Text style={jakesStyles.contact}>
//                         {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join(' | ')}
//                     </Text>
//                 </View>

//                 {sections.map((section, idx) => {
//                     if (section.key === 'personalDetails') return null;

//                     if (section.key === 'summary' && data.summary) {
//                         return (
//                             <View key={idx}>
//                                 <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
//                                 <Text>{data.summary}</Text>
//                             </View>
//                         );
//                     }

//                     if (section.key === 'education' && data.education?.length > 0) {
//                         return (
//                             <View key={idx}>
//                                 <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
//                                 {data.education.map((edu, i) => (
//                                     <View key={i} style={{ marginBottom: 6 }}>
//                                         <View style={jakesStyles.row}>
//                                             <Text style={jakesStyles.bold}>{edu.institution}</Text>
//                                             <Text>{edu.startDate} - {edu.endDate}</Text>
//                                         </View>
//                                         <Text style={jakesStyles.italic}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.key === 'experience' && data.experience?.length > 0) {
//                         return (
//                             <View key={idx}>
//                                 <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
//                                 {data.experience.map((exp, i) => (
//                                     <View key={i} style={{ marginBottom: 8 }}>
//                                         <View style={jakesStyles.row}>
//                                             <Text style={jakesStyles.bold}>{exp.position || exp.jobTitle}</Text>
//                                             <Text>{exp.startDate} - {exp.endDate}</Text>
//                                         </View>
//                                         <Text style={jakesStyles.italic}>{exp.company}</Text>
//                                         {exp.description && (Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
//                                             <View key={j} style={jakesStyles.bulletRow}>
//                                                 <Text style={jakesStyles.bullet}>•</Text>
//                                                 <Text style={jakesStyles.bulletText}>{d}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.key === 'projects' && data.projects?.length > 0) {
//                         return (
//                             <View key={idx}>
//                                 <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
//                                 {data.projects.map((proj, i) => (
//                                     <View key={i} style={{ marginBottom: 6 }}>
//                                         <Text style={jakesStyles.bold}>{proj.name || proj.title}</Text>
//                                         {proj.description && (Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
//                                             <View key={j} style={jakesStyles.bulletRow}>
//                                                 <Text style={jakesStyles.bullet}>•</Text>
//                                                 <Text style={jakesStyles.bulletText}>{d}</Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.key === 'skills' && data.skills?.length > 0) {
//                         return (
//                             <View key={idx}>
//                                 <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
//                                 {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => (
//                                     <View key={j} style={jakesStyles.bulletRow}>
//                                         <Text style={jakesStyles.bullet}>•</Text>
//                                         <Text style={jakesStyles.bulletText}>{renderSkillText(skill)}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         );
//                     }

//                     if (section.isCustom && data[section.key]) {
//                         return (
//                             <View key={idx}>
//                                 <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
//                                 {section.type === 'text' ? <Text>{data[section.key]}</Text> : (
//                                     Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
//                                         <View key={i} style={{ marginBottom: 6 }}>
//                                             <View style={jakesStyles.row}>
//                                                 <Text style={jakesStyles.bold}>{item.title}</Text>
//                                                 <Text>{item.date}</Text>
//                                             </View>
//                                             {item.bulletPoints && (Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
//                                                 <View key={bIdx} style={jakesStyles.bulletRow}>
//                                                     <Text style={jakesStyles.bullet}>•</Text>
//                                                     <Text style={jakesStyles.bulletText}>{b}</Text>
//                                                 </View>
//                                             ))}
//                                         </View>
//                                     ))
//                                 )}
//                             </View>
//                         );
//                     }
//                     return null;
//                 })}
//             </Page>
//         </Document>
//     );
// };

// // ==========================================
// // 3. TEMPLATE REGISTRY
// // ==========================================
// const TEMPLATE_REGISTRY = {
//     'harvard-ats': HarvardTemplate,
//     'jakes-resume': JakesTemplate
// };

// // ==========================================
// // 4. GENERATOR
// // ==========================================
// const generatePdf = async (resumeData, templateName = 'jakes-resume') => {
//     try {
//         const Template = TEMPLATE_REGISTRY[templateName] || JakesTemplate;
//         return await renderToStream(<Template data={resumeData} />);
//     } catch (err) {
//         console.error("PDF Generation Error:", err);
//         throw new Error('PDF generation failed');
//     }
// };

// module.exports = { generatePdf };












const React = require('react');
const { renderToStream, Page, Text, View, Document, StyleSheet } = require('@react-pdf/renderer');

// ==========================================
// HELPER: RENDER SKILLS
// ==========================================
const renderSkillText = (text) => {
    if (typeof text === 'string' && text.includes(':')) {
        const parts = text.split(':');
        return <Text><Text style={{ fontWeight: 'bold' }}>{parts[0]}: </Text>{parts.slice(1).join(':')}</Text>;
    }
    return <Text>{text}</Text>;
};

// ==========================================
// 1. HARVARD TEMPLATE (ATS SAFE)
// ==========================================
const harvardStyles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 11, padding: '1in', color: '#000', lineHeight: 1.3 },
    headerText: { textAlign: 'center', marginBottom: 16 },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    contact: { fontSize: 10 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, marginBottom: 8, marginTop: 16 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    bulletRow: { flexDirection: 'row', marginTop: 3 },
    bullet: { width: 15 },
    bulletText: { flex: 1 }
});

const HarvardTemplate = ({ data }) => {
    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
    return (
        <Document>
            <Page size="A4" style={harvardStyles.page}>
                <View style={harvardStyles.headerText}>
                    <Text style={harvardStyles.name}>{fullName}</Text>
                    <Text style={harvardStyles.contact}>
                        {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join('   ')}
                    </Text>
                </View>
                {sections.map((section, idx) => {
                    if (section.key === 'personalDetails') return null;
                    if (section.key === 'summary' && data.summary) {
                        return (
                            <View key={idx} style={harvardStyles.section}>
                                <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
                                <Text>{data.summary}</Text>
                            </View>
                        );
                    }
                    if (section.key === 'education' && data.education?.length > 0) {
                        return (
                            <View key={idx} style={harvardStyles.section}>
                                <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
                                {data.education.map((edu, i) => (
                                    <View key={i} style={{ marginBottom: 8 }}>
                                        <View style={harvardStyles.itemRow}>
                                            <Text style={harvardStyles.bold}>{edu.institution}</Text>
                                            <Text>{edu.startDate} - {edu.endDate}</Text>
                                        </View>
                                        <Text style={harvardStyles.italic}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'experience' && data.experience?.length > 0) {
                        return (
                            <View key={idx} style={harvardStyles.section}>
                                <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
                                {data.experience.map((exp, i) => (
                                    <View key={i} style={{ marginBottom: 12 }}>
                                        <View style={harvardStyles.itemRow}>
                                            <Text style={harvardStyles.bold}>{exp.company}</Text>
                                            <Text>{exp.startDate} - {exp.endDate}</Text>
                                        </View>
                                        <Text style={harvardStyles.italic}>{exp.position || exp.jobTitle}</Text>
                                        {exp.description && (Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
                                            <View key={j} style={harvardStyles.bulletRow}>
                                                <Text style={harvardStyles.bullet}>•</Text>
                                                <Text style={harvardStyles.bulletText}>{d}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'projects' && data.projects?.length > 0) {
                        return (
                            <View key={idx} style={harvardStyles.section}>
                                <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
                                {data.projects.map((proj, i) => (
                                    <View key={i} style={{ marginBottom: 8 }}>
                                        <Text style={harvardStyles.bold}>{proj.name || proj.title}</Text>
                                        {proj.description && (Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
                                            <View key={j} style={harvardStyles.bulletRow}>
                                                <Text style={harvardStyles.bullet}>•</Text>
                                                <Text style={harvardStyles.bulletText}>{d}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'skills' && data.skills?.length > 0) {
                        return (
                            <View key={idx} style={harvardStyles.section}>
                                <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
                                {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => (
                                    <View key={j} style={harvardStyles.bulletRow}>
                                        <Text style={harvardStyles.bullet}>•</Text>
                                        <Text style={harvardStyles.bulletText}>{renderSkillText(skill)}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.isCustom && data[section.key]) {
                        return (
                            <View key={idx} style={harvardStyles.section}>
                                <Text style={harvardStyles.sectionTitle}>{section.title}</Text>
                                {section.type === 'text' ? <Text>{data[section.key]}</Text> : (
                                    Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                                        <View key={i} style={{ marginBottom: 8 }}>
                                            <View style={harvardStyles.itemRow}>
                                                <Text style={harvardStyles.bold}>{item.title}</Text>
                                                <Text>{item.date}</Text>
                                            </View>
                                            {item.bulletPoints && (Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
                                                <View key={bIdx} style={harvardStyles.bulletRow}>
                                                    <Text style={harvardStyles.bullet}>•</Text>
                                                    <Text style={harvardStyles.bulletText}>{b}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </Page>
        </Document>
    );
};

// ==========================================
// 2. JAKE TEMPLATE (TECH STANDARD)
// ==========================================
const jakesStyles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 10, padding: '0.5in 0.75in', color: '#000' },
    header: { textAlign: 'center', marginBottom: 12 },
    name: { fontSize: 26, fontWeight: 'bold' },
    contact: { fontSize: 10, marginTop: 4 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', borderBottomWidth: 1, marginBottom: 6, marginTop: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    bulletRow: { flexDirection: 'row', marginTop: 2 },
    bullet: { width: 12 },
    bulletText: { flex: 1 }
});

const JakesTemplate = ({ data }) => {
    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
    return (
        <Document>
            <Page size="A4" style={jakesStyles.page}>
                <View style={jakesStyles.header}>
                    <Text style={jakesStyles.name}>{fullName}</Text>
                    <Text style={jakesStyles.contact}>
                        {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join(' | ')}
                    </Text>
                </View>
                {sections.map((section, idx) => {
                    if (section.key === 'personalDetails') return null;
                    if (section.key === 'summary' && data.summary) {
                        return (
                            <View key={idx}>
                                <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
                                <Text>{data.summary}</Text>
                            </View>
                        );
                    }
                    if (section.key === 'education' && data.education?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
                                {data.education.map((edu, i) => (
                                    <View key={i} style={{ marginBottom: 6 }}>
                                        <View style={jakesStyles.row}>
                                            <Text style={jakesStyles.bold}>{edu.institution}</Text>
                                            <Text>{edu.startDate} - {edu.endDate}</Text>
                                        </View>
                                        <Text style={jakesStyles.italic}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'experience' && data.experience?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
                                {data.experience.map((exp, i) => (
                                    <View key={i} style={{ marginBottom: 8 }}>
                                        <View style={jakesStyles.row}>
                                            <Text style={jakesStyles.bold}>{exp.position || exp.jobTitle}</Text>
                                            <Text>{exp.startDate} - {exp.endDate}</Text>
                                        </View>
                                        <Text style={jakesStyles.italic}>{exp.company}</Text>
                                        {exp.description && (Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
                                            <View key={j} style={jakesStyles.bulletRow}>
                                                <Text style={jakesStyles.bullet}>•</Text>
                                                <Text style={jakesStyles.bulletText}>{d}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'projects' && data.projects?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
                                {data.projects.map((proj, i) => (
                                    <View key={i} style={{ marginBottom: 6 }}>
                                        <Text style={jakesStyles.bold}>{proj.name || proj.title}</Text>
                                        {proj.description && (Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
                                            <View key={j} style={jakesStyles.bulletRow}>
                                                <Text style={jakesStyles.bullet}>•</Text>
                                                <Text style={jakesStyles.bulletText}>{d}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'skills' && data.skills?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
                                {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => (
                                    <View key={j} style={jakesStyles.bulletRow}>
                                        <Text style={jakesStyles.bullet}>•</Text>
                                        <Text style={jakesStyles.bulletText}>{renderSkillText(skill)}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.isCustom && data[section.key]) {
                        return (
                            <View key={idx}>
                                <Text style={jakesStyles.sectionTitle}>{section.title}</Text>
                                {section.type === 'text' ? <Text>{data[section.key]}</Text> : (
                                    Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                                        <View key={i} style={{ marginBottom: 6 }}>
                                            <View style={jakesStyles.row}>
                                                <Text style={jakesStyles.bold}>{item.title}</Text>
                                                <Text>{item.date}</Text>
                                            </View>
                                            {item.bulletPoints && (Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
                                                <View key={bIdx} style={jakesStyles.bulletRow}>
                                                    <Text style={jakesStyles.bullet}>•</Text>
                                                    <Text style={jakesStyles.bulletText}>{b}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </Page>
        </Document>
    );
};

// ==========================================
// 3. 🚀 NEW: ACADEMIC LATEX TEMPLATE
// ==========================================
const latexStyles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 11, padding: '0.6in 0.5in', color: '#000', lineHeight: 1.15 },
    headerText: { textAlign: 'left', marginBottom: 12 },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, fontSize: 10 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, marginBottom: 6, marginTop: 12 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    bulletRow: { flexDirection: 'row', marginTop: 2, paddingLeft: 12 },
    bullet: { width: 10, fontSize: 12 },
    bulletText: { flex: 1 }
});

const LatexTemplate = ({ data }) => {
    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
    
    return (
        <Document>
            <Page size="A4" style={latexStyles.page}>
                <View style={latexStyles.headerText}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
                        <Text style={latexStyles.name}>{fullName}</Text>
                        <Text style={{ fontSize: 10 }}>{personal.phone}</Text>
                    </View>
                    <View style={latexStyles.contactRow}>
                        <Text>{personal.email}</Text>
                        {personal.linkedin && <Text>| {personal.linkedin}</Text>}
                        {personal.github && <Text>| {personal.github}</Text>}
                        {personal.location && <Text>| {personal.location}</Text>}
                    </View>
                </View>

                {sections.map((section, idx) => {
                    if (section.key === 'personalDetails') return null;

                    if (section.key === 'summary' && data.summary) {
                        return (
                            <View key={idx}>
                                <Text style={latexStyles.sectionTitle}>{section.title}</Text>
                                <Text>{data.summary}</Text>
                            </View>
                        );
                    }
                    if (section.key === 'education' && data.education?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={latexStyles.sectionTitle}>{section.title}</Text>
                                {data.education.map((edu, i) => (
                                    <View key={i} style={{ marginBottom: 6 }}>
                                        <View style={latexStyles.itemRow}>
                                            <Text style={latexStyles.bold}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                                            <Text style={latexStyles.bold}>{edu.startDate} - {edu.endDate}</Text>
                                        </View>
                                        <View style={latexStyles.itemRow}>
                                            <Text>{edu.institution}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'projects' && data.projects?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={latexStyles.sectionTitle}>{section.title}</Text>
                                {data.projects.map((proj, i) => (
                                    <View key={i} style={{ marginBottom: 8 }}>
                                        <Text style={latexStyles.bold}>{proj.name || proj.title}</Text>
                                        {proj.description && (Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
                                            <View key={j} style={latexStyles.bulletRow}>
                                                <Text style={latexStyles.bullet}>•</Text>
                                                <Text style={latexStyles.bulletText}>{d}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'experience' && data.experience?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={latexStyles.sectionTitle}>{section.title}</Text>
                                {data.experience.map((exp, i) => (
                                    <View key={i} style={{ marginBottom: 8 }}>
                                        <View style={latexStyles.itemRow}>
                                            <Text style={latexStyles.bold}>{exp.position || exp.jobTitle}</Text>
                                            <Text style={latexStyles.bold}>{exp.startDate} - {exp.endDate}</Text>
                                        </View>
                                        <View style={latexStyles.itemRow}>
                                            <Text style={latexStyles.italic}>{exp.company}</Text>
                                        </View>
                                        {exp.description && (Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
                                            <View key={j} style={latexStyles.bulletRow}>
                                                <Text style={latexStyles.bullet}>•</Text>
                                                <Text style={latexStyles.bulletText}>{d}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.key === 'skills' && data.skills?.length > 0) {
                        return (
                            <View key={idx}>
                                <Text style={latexStyles.sectionTitle}>{section.title}</Text>
                                {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => (
                                    <View key={j} style={latexStyles.bulletRow}>
                                        <Text style={latexStyles.bulletText}>{renderSkillText(skill)}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    }
                    if (section.isCustom && data[section.key]) {
                        return (
                            <View key={idx}>
                                <Text style={latexStyles.sectionTitle}>{section.title}</Text>
                                {section.type === 'text' ? <Text>{data[section.key]}</Text> : (
                                    Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                                        <View key={i} style={{ marginBottom: 6 }}>
                                            <View style={latexStyles.itemRow}>
                                                <Text style={latexStyles.bold}>{item.title}</Text>
                                                <Text>{item.date}</Text>
                                            </View>
                                            {item.bulletPoints && (Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
                                                <View key={bIdx} style={latexStyles.bulletRow}>
                                                    <Text style={latexStyles.bullet}>•</Text>
                                                    <Text style={latexStyles.bulletText}>{b}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))
                                )}
                            </View>
                        );
                    }
                    return null;
                })}
            </Page>
        </Document>
    );
};

// ==========================================
// 4. TEMPLATE REGISTRY
// ==========================================
const TEMPLATE_REGISTRY = {
    'harvard-ats': HarvardTemplate,
    'jakes-resume': JakesTemplate,
    'latex-classic': LatexTemplate // 🚀 Added to registry
};

// ==========================================
// 5. GENERATOR
// ==========================================
const generatePdf = async (resumeData, templateName = 'jakes-resume') => {
    try {
        const Template = TEMPLATE_REGISTRY[templateName] || JakesTemplate;
        return await renderToStream(<Template data={resumeData} />);
    } catch (err) {
        console.error("PDF Generation Error:", err);
        throw new Error('PDF generation failed');
    }
};

module.exports = { generatePdf };