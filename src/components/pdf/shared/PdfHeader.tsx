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
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  headline: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.roleTitle,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: theme.colors.muted,
    marginBottom: 7,
  },
  hairline: {
    height: 0.5,
    backgroundColor: theme.colors.borderLight,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 2.5,
  },
  contactItem: {
    fontSize: theme.fontSizes.contact,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.body,
  },
  contactLink: {
    fontSize: theme.fontSizes.contact,
    color: theme.colors.primary,
    fontFamily: theme.fonts.body,
    textDecoration: "none",
  },
  dot: {
    fontSize: theme.fontSizes.contact,
    color: theme.colors.subtle,
    marginHorizontal: 4,
  },
});

export const PdfHeader: React.FC<PdfHeaderProps> = ({ profile }) => {
  const items: React.ReactNode[] = [];

  if (profile.contactEmail) {
    items.push(
      <Link key="email" src={`mailto:${profile.contactEmail}`} style={styles.contactLink}>
        <Text>{profile.contactEmail}</Text>
      </Link>
    );
  }

  if (profile.phone) {
    items.push(
      <Text key="phone" style={styles.contactItem}>
        {profile.phone}
      </Text>
    );
  }

  if (profile.location) {
    items.push(
      <Text key="location" style={styles.contactItem}>
        {profile.location}
      </Text>
    );
  }

  if (profile.websiteUrl) {
    const cleanWeb = profile.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    items.push(
      <Link key="web" src={profile.websiteUrl} style={styles.contactLink}>
        <Text>{cleanWeb}</Text>
      </Link>
    );
  }

  if (profile.linkedinUrl) {
    const cleanLinkedIn = profile.linkedinUrl
      .replace(/^https?:\/\/(www\.)?linkedin\.com\//, "linkedin.com/")
      .replace(/\/$/, "");
    items.push(
      <Link key="linkedin" src={profile.linkedinUrl} style={styles.contactLink}>
        <Text>{cleanLinkedIn}</Text>
      </Link>
    );
  }

  if (profile.githubUrl) {
    const cleanGithub = profile.githubUrl
      .replace(/^https?:\/\/(www\.)?github\.com\//, "github.com/")
      .replace(/\/$/, "");
    items.push(
      <Link key="github" src={profile.githubUrl} style={styles.contactLink}>
        <Text>{cleanGithub}</Text>
      </Link>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.fullName}</Text>
      {profile.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
      <View style={styles.hairline} />
      <View style={styles.contactRow}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < items.length - 1 && <Text style={styles.dot}>•</Text>}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};
