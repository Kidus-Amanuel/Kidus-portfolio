import React from "react";
import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { registerFonts, commonStyles, theme } from "./shared/styles";
import { PdfHeader } from "./shared/PdfHeader";
import { PdfFooter } from "./shared/PdfFooter";
import { CvData } from "@/lib/cv-data";

// Register local fonts once
registerFonts();

interface CvDocumentProps {
  data: CvData;
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.sectionMarginBottom,
  },
  summaryText: {
    fontSize: theme.fontSizes.body,
    lineHeight: 1.45,
    color: theme.colors.secondary,
    textAlign: "justify",
  },
  // Entry layout
  entry: {
    marginBottom: theme.spacing.entryMarginBottom,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.entryTitle,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  entrySubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.entryMeta,
    color: theme.colors.secondary,
    fontWeight: "normal",
  },
  entryDates: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.entryMeta,
    color: theme.colors.muted,
  },
  // Bullets
  bulletList: {
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: theme.fontSizes.bullets,
    color: theme.colors.primary,
    marginRight: 4,
    width: 6,
    textAlign: "center",
  },
  bulletText: {
    flex: 1,
    fontSize: theme.fontSizes.bullets,
    lineHeight: 1.35,
    color: theme.colors.secondary,
  },
  // Skills list
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
    fontSize: theme.fontSizes.body,
    lineHeight: 1.35,
  },
  skillCategory: {
    fontFamily: theme.fonts.body,
    fontWeight: "bold",
    color: theme.colors.primary,
    width: 140,
  },
  skillItems: {
    flex: 1,
    color: theme.colors.secondary,
  },
  projectLink: {
    fontSize: theme.fontSizes.entryMeta,
    color: theme.colors.link,
    marginLeft: 6,
    textDecoration: "none",
  },
});

export const CvDocument: React.FC<CvDocumentProps> = ({ data }) => {
  const { profile, experience, education, skills, projects, certifications } = data;

  return (
    <Document
      title={`${profile.fullName} - Curriculum Vitae`}
      author={profile.fullName}
      subject="Curriculum Vitae"
      keywords="Full-Stack Engineer, AI, Next.js, TypeScript, React"
    >
      <Page size="A4" style={commonStyles.page}>
        {/* Modern-Classic ATS Header */}
        <PdfHeader profile={profile} />

        {/* 1. Summary */}
        {profile.summary ? (
          <View style={styles.section} wrap={false}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Summary</Text>
              <View style={commonStyles.sectionLine} />
            </View>
            <Text style={styles.summaryText}>{profile.summary}</Text>
          </View>
        ) : null}

        {/* 2. Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Experience</Text>
              <View style={commonStyles.sectionLine} />
            </View>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {exp.role} <Text style={styles.entrySubtitle}>• {exp.company}</Text>
                  </Text>
                  <Text style={styles.entryDates}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                </View>
                {exp.bullets.length > 0 ? (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.bulletText}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 3. Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Education</Text>
              <View style={commonStyles.sectionLine} />
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {edu.degree} <Text style={styles.entrySubtitle}>• {edu.school}</Text>
                  </Text>
                  <Text style={styles.entryDates}>
                    {edu.startDate} – {edu.endDate}
                  </Text>
                </View>
                {edu.description ? (
                  <Text style={styles.bulletText}>{edu.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* 4. Skills */}
        {skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Technical Skills</Text>
              <View style={commonStyles.sectionLine} />
            </View>
            {skills.map((group, idx) => (
              <View key={idx} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{group.category}:</Text>
                <Text style={styles.skillItems}>{group.skills.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 5. Featured Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Key Projects</Text>
              <View style={commonStyles.sectionLine} />
            </View>
            {projects.slice(0, 3).map((proj) => (
              <View key={proj.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {proj.title}
                    {proj.link ? (
                      <Link src={proj.link} style={styles.projectLink}>
                        [Live]
                      </Link>
                    ) : null}
                    {proj.github ? (
                      <Link src={proj.github} style={styles.projectLink}>
                        [Code]
                      </Link>
                    ) : null}
                  </Text>
                  {proj.tags && proj.tags.length > 0 ? (
                    <Text style={styles.entryDates}>{proj.tags.slice(0, 3).join(", ")}</Text>
                  ) : null}
                </View>
                <Text style={styles.bulletText}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 6. Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section} wrap={false}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Certifications & Awards</Text>
              <View style={commonStyles.sectionLine} />
            </View>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {cert.name} <Text style={styles.entrySubtitle}>• {cert.issuer}</Text>
                  </Text>
                  <Text style={styles.entryDates}>{cert.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Fixed Footer on all pages */}
        <PdfFooter
          fullName={profile.fullName}
          documentTitle="Curriculum Vitae"
          websiteUrl={profile.websiteUrl}
        />
      </Page>
    </Document>
  );
};
