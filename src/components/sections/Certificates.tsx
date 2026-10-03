import { prisma } from "@/lib/db";
import { ArrowUpRight, Award } from "lucide-react";

export async function Certificates() {
  let certificates: any[] = [];
  try {
    certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
  } catch {
    // DB not connected yet
  }

  // Gracefully hide the section entirely if you haven't added any certificates yet
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-12">Certifications & Awards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certificates.map(c => (
            <div key={c.id} className="p-8 border border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col justify-between min-h-[200px]">
              <div>
                <Award className="w-8 h-8 text-white/30 mb-6" />
                <h3 className="font-bold text-xl mb-2">{c.name}</h3>
                <p className="text-sm text-white/50">{c.issuer} • {c.date}</p>
              </div>
              {c.url && (
                <div className="mt-8">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium border-b border-transparent hover:border-white transition-colors pb-1">
                    View Credential <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
