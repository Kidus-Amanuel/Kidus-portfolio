import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutMe } from "@/components/sections/AboutMe";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Certificates } from "@/components/sections/Certificates";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Recommendations } from "@/components/sections/Recommendations";
import { Contact } from "@/components/sections/Contact";
import { AILab } from "@/components/sections/AILab";
import { MoreAboutToggle } from "@/components/ui/MoreAboutToggle";
import { Games } from "@/components/sections/Games";
import { prisma } from "@/lib/db";

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" }
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Hero />
      <section className="px-6 md:px-12 lg:px-24 py-12 md:py-16 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          <AboutMe />
          <AILab />
        </div>
      </section>
      <MoreAboutToggle>
        <Experience />
        <Education />
        <Certificates />
        <Projects />
        <Skills />
        <Recommendations />
      </MoreAboutToggle>
      <Games />
      <Contact settings={settings} />
      <Footer />
    </main>
  );
}
