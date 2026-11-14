import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { registerFonts, commonStyles, theme } from "./shared/styles";
import { PdfHeader } from "./shared/PdfHeader";
import { PdfFooter } from "./shared/PdfFooter";
import { CoverLetterRenderData } from "@/lib/cover-letter-data";

// Register local fonts once
registerFonts();

interface CoverLetterDocumentProps {
  data: CoverLetterRenderData;
}

const styles = StyleSheet.create({
  dateBlock: {
    marginTop: 14,
    marginBottom: 14,
  },
  dateText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    color: theme.colors.secondary,
  },
  recipientBlock: {
    marginBottom: 16,
    lineHeight: 1.4,
  },
  recipientName: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.entryTitle,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  recipientMeta: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    color: theme.colors.secondary,
  },
  subjectBlock: {
    marginBottom: 14,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderLight,
  },
  subjectText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.entryTitle,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  salutation: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    lineHeight: 1.55,
    color: theme.colors.secondary,
    marginBottom: 12,
    textAlign: "justify",
  },
  signoffBlock: {
    marginTop: 16,
    marginBottom: 20,
  },
  closingText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    color: theme.colors.secondary,
    marginBottom: 24,
  },
  signerName: {
    fontFamily: theme.fonts.heading,
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 2,
  },
  signerTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.roleTitle,
    color: theme.colors.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});

export const CoverLetterDocument: React.FC<CoverLetterDocumentProps> = ({ data }) => {
  const { sender, recipient, date, subject, salutation, paragraphs, closing } = data;

  return (
    <Document
      title={`Cover Letter - ${sender.fullName}`}
      author={sender.fullName}
      subject={subject}
    >
      <Page size="A4" style={commonStyles.page}>
        {/* Same Header Design Language */}
        <PdfHeader profile={sender} />

        {/* Date */}
        <View style={styles.dateBlock}>
          <Text style={styles.dateText}>{date}</Text>
        </View>

        {/* Recipient Block */}
        <View style={styles.recipientBlock}>
          <Text style={styles.recipientName}>{recipient.name}</Text>
          {recipient.title ? (
            <Text style={styles.recipientMeta}>{recipient.title}</Text>
          ) : null}
          {recipient.company ? (
            <Text style={styles.recipientMeta}>{recipient.company}</Text>
          ) : null}
          {recipient.address ? (
            <Text style={styles.recipientMeta}>{recipient.address}</Text>
          ) : null}
        </View>

        {/* Subject Line */}
        <View style={styles.subjectBlock}>
          <Text style={styles.subjectText}>RE: {subject}</Text>
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>{salutation}</Text>

        {/* Body Paragraphs */}
        {paragraphs.map((p, idx) => (
          <Text key={idx} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        {/* Closing & Signoff */}
        <View style={styles.signoffBlock} wrap={false}>
          <Text style={styles.closingText}>{closing}</Text>
          <Text style={styles.signerName}>{sender.fullName}</Text>
          <Text style={styles.signerTitle}>{sender.headline}</Text>
        </View>

        {/* Matching Fixed Footer */}
        <PdfFooter
          fullName={sender.fullName}
          documentTitle="Cover Letter"
          websiteUrl={sender.websiteUrl}
        />
      </Page>
    </Document>
  );
};
