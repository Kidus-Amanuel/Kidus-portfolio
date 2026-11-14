import { StyleSheet, Font } from "@react-pdf/renderer";
import path from "path";
import fs from "fs";

// Ensure hyphenation doesn't break words awkwardly
Font.registerHyphenationCallback((word) => [word]);

let fontsRegistered = false;

export function registerFonts() {
  if (fontsRegistered) return;
  const isServer = typeof window === "undefined";
  const getFontPath = (file: string) => {
    if (isServer) {
      const candidates = [
        path.join(process.cwd(), "public", "fonts", file),
        path.join(process.cwd(), "kidus-portfolio", "public", "fonts", file),
        path.resolve(__dirname, "../../../../public/fonts", file),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
      return candidates[0];
    }
    return `/fonts/${file}`;
  };

  try {
    Font.register({
      family: "Lora",
      fonts: [
        { src: getFontPath("Lora-Regular.ttf"), fontWeight: "normal" },
        { src: getFontPath("Lora-Bold.ttf"), fontWeight: "bold" },
        { src: getFontPath("Lora-Italic.ttf"), fontStyle: "italic" },
      ],
    });

    Font.register({
      family: "Inter",
      fonts: [
        { src: getFontPath("Inter-Regular.ttf"), fontWeight: "normal" },
        { src: getFontPath("Inter-Bold.ttf"), fontWeight: "bold" },
        { src: getFontPath("Inter-Italic.ttf"), fontStyle: "italic" },
      ],
    });

    fontsRegistered = true;
  } catch (err) {
    console.warn("Font registration warning:", err);
  }
}

export const theme = {
  colors: {
    primary: "#0f172a", // Charcoal black
    secondary: "#334155", // Slate gray
    muted: "#64748b", // Light muted slate
    accent: "#1e3a8a", // Refined dark navy accent
    border: "#cbd5e1", // Hairline border
    borderLight: "#e2e8f0",
    background: "#ffffff",
    link: "#1d4ed8",
  },
  fonts: {
    heading: "Lora",
    body: "Inter",
  },
  fontSizes: {
    name: 24,
    roleTitle: 10,
    contact: 8.5,
    sectionHeading: 9.5,
    entryTitle: 10.5,
    entryMeta: 9,
    body: 9,
    bullets: 8.75,
    footer: 8,
  },
  spacing: {
    pagePaddingHorizontal: 40,
    pagePaddingVertical: 36,
    sectionMarginBottom: 13,
    entryMarginBottom: 9,
  },
};

export const commonStyles = StyleSheet.create({
  page: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    color: theme.colors.primary,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.pagePaddingVertical,
    paddingBottom: 44, // Leave space for fixed footer
    paddingHorizontal: theme.spacing.pagePaddingHorizontal,
    lineHeight: 1.45,
  },
  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sectionHeading,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: theme.colors.primary,
    marginRight: 8,
  },
  sectionLine: {
    flex: 1,
    height: 0.75,
    backgroundColor: theme.colors.border,
  },
  // Link styling
  link: {
    color: theme.colors.link,
    textDecoration: "none",
  },
});
