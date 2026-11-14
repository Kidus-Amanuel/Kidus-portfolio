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
    bottom: 22,
    left: theme.spacing.pagePaddingHorizontal,
    right: theme.spacing.pagePaddingHorizontal,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.borderLight,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLeft: {
    fontSize: theme.fontSizes.footer,
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  linkCenter: {
    fontSize: theme.fontSizes.footer,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.body,
    textDecoration: "none",
  },
  pageRight: {
    fontSize: theme.fontSizes.footer,
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    letterSpacing: 0.4,
  },
});

export const PdfFooter: React.FC<PdfFooterProps> = ({
  fullName,
  documentTitle = "Curriculum Vitae",
  websiteUrl,
}) => {
  const displayUrl = websiteUrl
    ? websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  return (
    <View style={styles.container} fixed>
      <Text style={styles.metaLeft}>
        {fullName} • {documentTitle}
      </Text>
      {websiteUrl ? (
        <Link src={websiteUrl} style={styles.linkCenter}>
          <Text>{displayUrl}</Text>
        </Link>
      ) : (
        <Text style={styles.metaLeft}></Text>
      )}
      <Text
        style={styles.pageRight}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
};
