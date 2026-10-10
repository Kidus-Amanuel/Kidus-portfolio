import { prisma } from "@/lib/db";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });

  return (
    <footer className="py-8 px-6 md:px-12 border-t border-white/10 bg-black text-white/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
      <p>© {new Date().getFullYear()} Kidus. All rights reserved.</p>
      <div className="flex items-center gap-6">
        {settings?.githubUrl && (
          <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        )}
        {settings?.linkedinUrl && (
          <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        )}
        {settings?.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
        )}
        {settings?.upworkUrl && (
          <a href={settings.upworkUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Upwork</a>
        )}
      </div>
    </footer>
  );
}