import { StyleSheet, Font } from "@react-pdf/renderer";
import path from "path";
import fs from "fs";

// Ensure hyphenation doesn't break words awkwardly
Font.registerHyphenationCallback((word) => [word]);

let fontsRegistered = false;

function resolveFontFile(file: string): string {
  const candidates = [
    path.join(process.cwd(), "public", "fonts", file),
    path.join(process.cwd(), "kidus-portfolio", "public", "fonts", file),
    path.join(__dirname, "../../../../public/fonts", file),
    path.join(__dirname, "../../public/fonts", file),
    path.resolve("./public/fonts", file),
    path.resolve("./kidus-portfolio/public/fonts", file),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return candidates[0];
}

function getFontSrc(file: string): string {
  if (typeof window === "undefined") {
    try {
      const fullPath = resolveFontFile(file);
      if (fs.existsSync(fullPath)) {
        const fileBuffer = fs.readFileSync(fullPath);
        return `data:font/truetype;charset=utf-8;base64,${fileBuffer.toString("base64")}`;
      }
    } catch (e) {
      console.warn(`Could not read font file ${file} as base64, falling back to path`, e);
    }
    return resolveFontFile(file);
  }
  return `/fonts/${file}`;
}

export function registerFonts() {
  if (fontsRegistered) return;

  try {
    Font.register({
      family: "Lora",
      fonts: [
        { src: getFontSrc("Lora-Regular.ttf"), fontWeight: "normal" },
        { src: getFontSrc("Lora-Bold.ttf"), fontWeight: "bold" },
        { src: getFontSrc("Lora-Italic.ttf"), fontStyle: "italic" },
      ],
    });

    Font.register({
      family: "Inter",
      fonts: [
        { src: getFontSrc("Inter-Regular.ttf"), fontWeight: "normal" },
        { src: getFontSrc("Inter-Bold.ttf"), fontWeight: "bold" },
        { src: getFontSrc("Inter-Italic.ttf"), fontStyle: "italic" },
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
  link: {
    color: theme.colors.link,
    textDecoration: "none",
  },
});
