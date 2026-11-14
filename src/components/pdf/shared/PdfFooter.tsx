import React from "react";
import { View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./styles";

interface PdfFooterProps {
  fullName: string;
  documentTitle?: string;
  websiteUrl?: string;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: theme.spacing.pagePaddingHorizontal,
    right: theme.spacing.pagePaddingHorizontal,
    borderTopWidth: 0.75,
    borderTopColor: theme.colors.borderLight,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: theme.fontSizes.footer,
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
  },
  link: {
    fontSize: theme.fontSizes.footer,
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    textDecoration: "none",
  },
});

export const PdfFooter: React.FC<PdfFooterProps> = ({
  fullName,
  documentTitle = "Curriculum Vitae",
  websiteUrl,
}) => {
  const displayUrl = websiteUrl ? websiteUrl.replace(/^https?:\/\//, "") : "";

  return (
    <View style={styles.container} fixed>
      <Text style={styles.text}>
        {fullName} • {documentTitle}
      </Text>
      {websiteUrl ? (
        <Link src={websiteUrl} style={styles.link}>
          <Text style={styles.text}>{displayUrl}</Text>
        </Link>
      ) : (
        <Text style={styles.text}></Text>
      )}
      <Text
        style={styles.text}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
};
