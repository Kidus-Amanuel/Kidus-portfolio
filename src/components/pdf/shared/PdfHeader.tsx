import React from "react";
import { View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./styles";
import { CvProfile } from "@/lib/cv-data";

interface PdfHeaderProps {
  profile: CvProfile;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  name: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.name,
    fontWeight: "bold",
    color: theme.colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headline: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.roleTitle,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: theme.colors.accent,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  contactItem: {
    fontSize: theme.fontSizes.contact,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.body,
  },
  separator: {
    fontSize: theme.fontSizes.contact,
    color: theme.colors.muted,
    marginHorizontal: 3,
  },
  link: {
    color: theme.colors.primary,
    textDecoration: "none",
  },
});

export const PdfHeader: React.FC<PdfHeaderProps> = ({ profile }) => {
  const contactItems: React.ReactNode[] = [];

  if (profile.contactEmail) {
    contactItems.push(
      <Link key="email" src={`mailto:${profile.contactEmail}`} style={styles.link}>
        <Text style={styles.contactItem}>{profile.contactEmail}</Text>
      </Link>
    );
  }

  if (profile.phone) {
    contactItems.push(
      <Text key="phone" style={styles.contactItem}>
        {profile.phone}
      </Text>
    );
  }

  if (profile.location) {
    contactItems.push(
      <Text key="location" style={styles.contactItem}>
        {profile.location}
      </Text>
    );
  }

  if (profile.websiteUrl) {
    const displayWeb = profile.websiteUrl.replace(/^https?:\/\//, "");
    contactItems.push(
      <Link key="web" src={profile.websiteUrl} style={styles.link}>
        <Text style={styles.contactItem}>{displayWeb}</Text>
      </Link>
    );
  }

  if (profile.linkedinUrl) {
    contactItems.push(
      <Link key="linkedin" src={profile.linkedinUrl} style={styles.link}>
        <Text style={styles.contactItem}>LinkedIn</Text>
      </Link>
    );
  }

  if (profile.githubUrl) {
    contactItems.push(
      <Link key="github" src={profile.githubUrl} style={styles.link}>
        <Text style={styles.contactItem}>GitHub</Text>
      </Link>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.fullName}</Text>
      {profile.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
      <View style={styles.divider} />
      <View style={styles.contactRow}>
        {contactItems.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < contactItems.length - 1 && <Text style={styles.separator}>•</Text>}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};
