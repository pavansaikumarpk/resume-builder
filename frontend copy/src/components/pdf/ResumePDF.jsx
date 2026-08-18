import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const safeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
};

const formatDates = (start, end) => {
    if (start && end) return `${start} - ${end}`;
    return start || end || '';
};

const getSkillString = (items) => {
    if (!items || !Array.isArray(items)) return '';
    return items.map(item => typeof item === 'string' ? item : item.name).filter(Boolean).join(', ');
};

const getStylesConfig = (docStyle) => {
    const isHelvetica = docStyle?.fontFamily !== 'Times-Roman';
    const baseSize = Number(docStyle?.fontSize) || 11;
    
    const marginsMap = { compact: '0.4in', standard: '0.5in', spacious: '0.7in' };
    const lineSpacingMap = { tight: 1.15, standard: 1.3, loose: 1.5 };

    return {
        fonts: {
            regular: isHelvetica ? 'Helvetica' : 'Times-Roman',
            bold: isHelvetica ? 'Helvetica-Bold' : 'Times-Bold',
            italic: isHelvetica ? 'Helvetica-Oblique' : 'Times-Italic',
            size: baseSize,
            h1: baseSize * 2.4,    
            h2: baseSize * 1.25,   
            h3: baseSize * 1.05,   
            small: baseSize * 0.95  
        },
        layout: {
            padding: marginsMap[docStyle?.margins] || '0.5in',
            lineHeight: lineSpacingMap[docStyle?.lineSpacing] || 1.3
        }
    };
};

const ContactRenderer = ({ personal, justify, fontSize }) => {
    const items = [];
    if (personal.phone) items.push({ type: 'text', val: personal.phone });
    if (personal.email) items.push({ type: 'text', val: personal.email });
    if (personal.linkedin) items.push({ type: 'link', val: personal.linkedin, label: personal.linkedinLabel || 'LinkedIn' });
    if (personal.github) items.push({ type: 'link', val: personal.github, label: personal.githubLabel || 'GitHub' });
    if (personal.location) items.push({ type: 'text', val: personal.location });
    
    if (items.length === 0) return null;

    const alignVal = justify === 'center' ? 'center' : (justify === 'flex-start' ? 'flex-start' : 'flex-end');

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: alignVal, marginBottom: 8, marginTop: 4 }}>
            {items.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    {item.type === 'link' ? (
                        <Link src={safeUrl(item.val)} style={{ fontSize, color: '#000', textDecoration: 'none' }}>
                            {item.label}
                        </Link>
                    ) : (
                        <Text style={{ fontSize, color: '#000' }}>{item.val}</Text>
                    )}
                    {index < items.length - 1 && (
                        <Text style={{ fontSize, color: '#000', marginHorizontal: 6 }}>|</Text>
                    )}
                </View>
            ))}
        </View>
    );
};

const HarvardTemplate = ({ data, config }) => {
    const styles = StyleSheet.create({
        page: { fontFamily: config.fonts.regular, fontSize: config.fonts.size, padding: config.layout.padding, color: '#000', lineHeight: config.layout.lineHeight },
        headerText: { textAlign: 'center', marginBottom: 12 },
        name: { fontFamily: config.fonts.bold, fontSize: config.fonts.h1, marginBottom: 4, textTransform: 'uppercase' },
        sectionTitle: { fontFamily: config.fonts.bold, fontSize: config.fonts.h2, textTransform: 'uppercase', borderTopWidth: 1, borderTopColor: '#000', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 4, marginBottom: 10, marginTop: 16, textAlign: 'center' },
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
        bold: { fontFamily: config.fonts.bold, fontSize: config.fonts.h3 },
        italic: { fontFamily: config.fonts.italic },
        bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 3, paddingLeft: 8 },
        bullet: { width: 14, fontFamily: config.fonts.bold },
        bulletText: { flex: 1, textAlign: 'justify' },
        sectionBlock: { marginBottom: 12 }
    });

    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.headerText}>
                <Text style={styles.name}>{fullName}</Text>
                <ContactRenderer personal={personal} justify="center" fontSize={config.fonts.small} />
            </View>

            {sections.map((section, idx) => {
                if (section.key === 'personalDetails') return null;

                if (section.key === 'summary' && data.summary) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={{ textAlign: 'justify' }}>{data.summary}</Text>
                    </View>
                );

                if (section.key === 'education' && data.education?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{edu.institution}</Text>
                                    <Text>{edu.location || ''}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.italic}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                                    <Text style={styles.italic}>{formatDates(edu.startDate, edu.endDate)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'experience' && data.experience?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.experience.map((exp, i) => (
                            <View key={i} style={{ marginBottom: 12 }}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{exp.position || exp.title || exp.jobTitle}</Text>
                                    <Text>{formatDates(exp.startDate, exp.endDate)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.italic}>{exp.company}</Text>
                                        {exp.link && (
                                            <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                <Link src={safeUrl(exp.link)} style={{ color: '#000', textDecoration: 'none' }}>[{exp.linkLabel || 'Link'}]</Link>
                                            </Text>
                                        )}
                                    </View>
                                    {exp.location && <Text style={styles.italic}>{exp.location}</Text>}
                                </View>
                                {Array.isArray(exp.description) && exp.description.filter(Boolean).map((d, j) => (
                                    <View key={j} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'projects' && data.projects?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.projects.map((proj, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <View style={styles.row}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.bold}>{proj.name || proj.title}</Text>
                                        {proj.link && (
                                            <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                <Link src={safeUrl(proj.link)} style={{ color: '#000', textDecoration: 'none' }}>[{proj.linkLabel || 'Link'}]</Link>
                                            </Text>
                                        )}
                                    </View>
                                    {proj.date && <Text>{proj.date}</Text>}
                                </View>
                                {proj.subtitle && (
                                    <View style={styles.row}>
                                        <Text style={styles.italic}>{proj.subtitle}</Text>
                                    </View>
                                )}
                                {Array.isArray(proj.description) && proj.description.filter(Boolean).map((d, j) => (
                                    <View key={j} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'skills' && data.skills?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={{ paddingLeft: 4 }}>
                            {data.skills.map((group, j) => (
                                <View key={j} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                                    <Text style={{ fontFamily: config.fonts.bold }}>{group.category || 'Skills'}: </Text>
                                    <Text style={styles.bulletText}>{getSkillString(group.items)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );

                if (section.isCustom && data[section.key]) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.type === 'text' ? <Text style={{ paddingLeft: 4 }}>{data[section.key]}</Text> : (
                            section.title.toLowerCase() === 'languages' ? (
                                <Text style={{ paddingLeft: 4 }}>
                                    {(Array.isArray(data[section.key]) ? data[section.key] : [])
                                        .map(lang => typeof lang === 'string' ? lang : (lang.bulletPoints || []).join(' '))
                                        .join(' | ')}
                                </Text>
                            ) : (
                                Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                                    <View key={i} style={{ marginBottom: 10 }}>
                                        <View style={styles.row}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={styles.bold}>{item.title}</Text>
                                                {item.link && (
                                                    <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                        <Link src={safeUrl(item.link)} style={{ color: '#000', textDecoration: 'none' }}>[{item.linkLabel || 'Link'}]</Link>
                                                    </Text>
                                                )}
                                            </View>
                                            <Text>{item.date}</Text>
                                        </View>
                                        {Array.isArray(item.bulletPoints) && item.bulletPoints.filter(Boolean).map((b, bIdx) => (
                                            <View key={bIdx} style={styles.bulletRow}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.bulletText}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))
                            )
                        )}
                    </View>
                );

                return null;
            })}
        </Page>
    );
};

const JakesTemplate = ({ data, config }) => {
    const styles = StyleSheet.create({
        page: { padding: config.layout.padding, fontFamily: config.fonts.regular, fontSize: config.fonts.size, color: '#000', lineHeight: config.layout.lineHeight },
        header: { textAlign: 'center', marginBottom: 10 },
        name: { fontFamily: config.fonts.bold, fontSize: config.fonts.h1, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
        
        sectionTitle: { 
            fontFamily: config.fonts.bold, 
            fontSize: config.fonts.h2, 
            textTransform: 'uppercase',
            borderBottomWidth: 1, 
            borderBottomColor: '#000', 
            paddingBottom: 3,  
            marginBottom: 8,   
            marginTop: 18,     
            color: '#000' 
        },
        
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
        bold: { fontFamily: config.fonts.bold, fontSize: config.fonts.h3 },
        italic: { fontFamily: config.fonts.italic },
        bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 3, paddingLeft: 12 },
        bullet: { width: 14, fontFamily: config.fonts.regular },
        bulletText: { flex: 1, textAlign: 'justify' },
        sectionBlock: { marginBottom: 12 }
    });

    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.name}>{fullName}</Text>
                <ContactRenderer personal={personal} justify="center" fontSize={config.fonts.small} />
            </View>

            {sections.map((section, idx) => {
                if (section.key === 'personalDetails') return null;

                if (section.key === 'summary' && data.summary) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={{ textAlign: 'justify', paddingLeft: 4 }}>{data.summary}</Text>
                    </View>
                );

                if (section.key === 'education' && data.education?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{edu.institution}</Text>
                                    <Text>{edu.location || ''}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.italic}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                                    <Text style={styles.italic}>{formatDates(edu.startDate, edu.endDate)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'experience' && data.experience?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.experience.map((exp, i) => (
                            <View key={i} style={{ marginBottom: 12 }}>
                                <View style={styles.row}>
                                    <Text style={styles.bold}>{exp.position || exp.title || exp.jobTitle}</Text>
                                    <Text>{formatDates(exp.startDate, exp.endDate)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.italic}>{exp.company}</Text>
                                        {exp.link && (
                                            <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                <Link src={safeUrl(exp.link)} style={{ color: '#000', textDecoration: 'none' }}>[{exp.linkLabel || 'Link'}]</Link>
                                            </Text>
                                        )}
                                    </View>
                                    {exp.location && <Text style={styles.italic}>{exp.location}</Text>}
                                </View>
                                {Array.isArray(exp.description) && exp.description.filter(Boolean).map((d, j) => (
                                    <View key={j} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>-</Text>
                                        <Text style={styles.bulletText}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'projects' && data.projects?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.projects.map((proj, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <View style={styles.row}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.bold}>{proj.name || proj.title}</Text>
                                        {proj.link && (
                                            <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                <Link src={safeUrl(proj.link)} style={{ color: '#000', textDecoration: 'none' }}>[{proj.linkLabel || 'Link'}]</Link>
                                            </Text>
                                        )}
                                    </View>
                                    {proj.date && <Text>{proj.date}</Text>}
                                </View>
                                {proj.subtitle && (
                                    <View style={styles.row}>
                                        <Text style={styles.italic}>{proj.subtitle}</Text>
                                    </View>
                                )}
                                {Array.isArray(proj.description) && proj.description.filter(Boolean).map((d, j) => (
                                    <View key={j} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>-</Text>
                                        <Text style={styles.bulletText}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'skills' && data.skills?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={{ paddingLeft: 4 }}>
                            {data.skills.map((group, j) => (
                                <View key={j} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                                    <Text style={{ fontFamily: config.fonts.bold }}>{group.category || 'Skills'}: </Text>
                                    <Text style={styles.bulletText}>{getSkillString(group.items)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );

                if (section.isCustom && data[section.key]) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.type === 'text' ? <Text style={{ paddingLeft: 4 }}>{data[section.key]}</Text> : (
                            section.title.toLowerCase() === 'languages' ? (
                                <Text style={{ paddingLeft: 4 }}>
                                    {(Array.isArray(data[section.key]) ? data[section.key] : [])
                                        .map(lang => typeof lang === 'string' ? lang : (lang.bulletPoints || []).join(' '))
                                        .join(' | ')}
                                </Text>
                            ) : (
                                Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                                    <View key={i} style={{ marginBottom: 10 }}>
                                        <View style={styles.row}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={styles.bold}>{item.title}</Text>
                                                {item.link && (
                                                    <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                        <Link src={safeUrl(item.link)} style={{ color: '#000', textDecoration: 'none' }}>[{item.linkLabel || 'Link'}]</Link>
                                                    </Text>
                                                )}
                                            </View>
                                            <Text>{item.date}</Text>
                                        </View>
                                        {Array.isArray(item.bulletPoints) && item.bulletPoints.filter(Boolean).map((b, bIdx) => (
                                            <View key={bIdx} style={styles.bulletRow}>
                                                <Text style={styles.bullet}>-</Text>
                                                <Text style={styles.bulletText}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))
                            )
                        )}
                    </View>
                );

                return null;
            })}
        </Page>
    );
};

const LatexTemplate = ({ data, config }) => {
    const styles = StyleSheet.create({
        page: { fontFamily: config.fonts.regular, fontSize: config.fonts.size, padding: config.layout.padding, color: '#000', lineHeight: config.layout.lineHeight },
        headerText: { textAlign: 'left', marginBottom: 14 },
        name: { fontFamily: config.fonts.bold, fontSize: config.fonts.h1, marginBottom: 4 },
        sectionTitle: { fontFamily: config.fonts.bold, fontSize: config.fonts.h2, textTransform: 'uppercase', borderBottomWidth: 1.5, borderBottomColor: '#000', paddingBottom: 4, marginBottom: 10, marginTop: 16 },
        itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
        bold: { fontFamily: config.fonts.bold, fontSize: config.fonts.h3 },
        italic: { fontFamily: config.fonts.italic },
        bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 2, paddingLeft: 12 },
        bullet: { width: 12, fontFamily: config.fonts.bold },
        bulletText: { flex: 1, textAlign: 'justify' },
        sectionBlock: { marginBottom: 12 }
    });

    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.headerText}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
                    <Text style={styles.name}>{fullName}</Text>
                    <Text>{personal.phone}</Text>
                </View>
                <ContactRenderer personal={personal} justify="flex-start" fontSize={config.fonts.small} />
            </View>

            {sections.map((section, idx) => {
                if (section.key === 'personalDetails') return null;

                if (section.key === 'summary' && data.summary) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={{ textAlign: 'justify', paddingLeft: 4 }}>{data.summary}</Text>
                    </View>
                );

                if (section.key === 'education' && data.education?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <View style={styles.itemRow}>
                                    <Text style={styles.bold}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                                    <Text style={{ fontFamily: config.fonts.bold }}>{formatDates(edu.startDate, edu.endDate)}</Text>
                                </View>
                                <View style={styles.itemRow}>
                                    <Text>{edu.institution}</Text>
                                    <Text>{edu.location || ''}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'experience' && data.experience?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.experience.map((exp, i) => (
                            <View key={i} style={{ marginBottom: 12 }}>
                                <View style={styles.itemRow}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                                        <Text style={styles.bold}>{exp.position || exp.title || exp.jobTitle}</Text>
                                        {exp.link && (
                                            <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                <Link src={safeUrl(exp.link)} style={{ color: '#000', textDecoration: 'none' }}>[{exp.linkLabel || 'Link'}]</Link>
                                            </Text>
                                        )}
                                    </View>
                                    <Text style={{ fontFamily: config.fonts.bold }}>{formatDates(exp.startDate, exp.endDate)}</Text>
                                </View>
                                <View style={styles.itemRow}>
                                    <Text style={styles.italic}>{exp.company}</Text>
                                    {exp.location && <Text style={styles.italic}>{exp.location}</Text>}
                                </View>
                                {Array.isArray(exp.description) && exp.description.filter(Boolean).map((d, j) => (
                                    <View key={j} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'projects' && data.projects?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {data.projects.map((proj, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <View style={styles.itemRow}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Text style={styles.bold}>{proj.name || proj.title}</Text>
                                        {proj.link && (
                                            <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                <Link src={safeUrl(proj.link)} style={{ color: '#000', textDecoration: 'none' }}>[{proj.linkLabel || 'Link'}]</Link>
                                            </Text>
                                        )}
                                    </View>
                                    {proj.date && <Text style={{ fontFamily: config.fonts.bold }}>{proj.date}</Text>}
                                </View>
                                {proj.subtitle && (
                                    <View style={styles.itemRow}>
                                        <Text style={styles.italic}>{proj.subtitle}</Text>
                                    </View>
                                )}
                                {Array.isArray(proj.description) && proj.description.filter(Boolean).map((d, j) => (
                                    <View key={j} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{d}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                );

                if (section.key === 'skills' && data.skills?.length > 0) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={{ paddingLeft: 4 }}>
                            {data.skills.map((group, j) => (
                                <View key={j} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                                    <Text style={{ fontFamily: config.fonts.bold }}>{group.category || 'Skills'}: </Text>
                                    <Text style={styles.bulletText}>{getSkillString(group.items)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );

                if (section.isCustom && data[section.key]) return (
                    <View key={idx} style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.type === 'text' ? <Text style={{ paddingLeft: 4 }}>{data[section.key]}</Text> : (
                            section.title.toLowerCase() === 'languages' ? (
                                <Text style={{ paddingLeft: 4 }}>
                                    {(Array.isArray(data[section.key]) ? data[section.key] : [])
                                        .map(lang => typeof lang === 'string' ? lang : (lang.bulletPoints || []).join(' '))
                                        .join(' | ')}
                                </Text>
                            ) : (
                                Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                                    <View key={i} style={{ marginBottom: 10 }}>
                                        <View style={styles.itemRow}>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                                                <Text style={styles.bold}>{item.title}</Text>
                                                {item.link && (
                                                    <Text style={{ fontFamily: config.fonts.regular, marginLeft: 4 }}>
                                                        <Link src={safeUrl(item.link)} style={{ color: '#000', textDecoration: 'none' }}>[{item.linkLabel || 'Link'}]</Link>
                                                    </Text>
                                                )}
                                            </View>
                                            <Text>{item.date}</Text>
                                        </View>
                                        {Array.isArray(item.bulletPoints) && item.bulletPoints.filter(Boolean).map((b, bIdx) => (
                                            <View key={bIdx} style={styles.bulletRow}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.bulletText}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))
                            )
                        )}
                    </View>
                );

                return null;
            })}
        </Page>
    );
};

const TEMPLATE_REGISTRY = {
    'harvard-ats': HarvardTemplate,
    'jakes-resume': JakesTemplate,
    'latex-classic': LatexTemplate
};

export const ResumePDF = ({ data, templateName = 'jakes-resume', documentStyle = {} }) => {
    if (!data) return null;
    
    const TemplateComponent = TEMPLATE_REGISTRY[templateName] || JakesTemplate;
    const config = getStylesConfig(documentStyle);

    return (
        <Document>
            <TemplateComponent data={data} config={config} />
        </Document>
    );
};