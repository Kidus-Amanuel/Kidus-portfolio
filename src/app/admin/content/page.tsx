import { prisma } from "@/lib/db";
import { 
  addProject, deleteProject, editProject,
  addExperience, deleteExperience, editExperience,
  addCertificate, deleteCertificate, editCertificate 
} from "../actions";
import { Trash2, Edit2, X } from "lucide-react";
import Link from "next/link";

export default async function ContentManager({ searchParams }: { searchParams: { edit?: string, type?: string } }) {
  let projects: any[] = [];
  let experience: any[] = [];
  let certificates: any[] = [];

  let editingItem: any = null;

  try {
    projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    experience = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });

    if (searchParams.edit && searchParams.type) {
      if (searchParams.type === "project") editingItem = await prisma.project.findUnique({ where: { id: searchParams.edit } });
      if (searchParams.type === "experience") editingItem = await prisma.experience.findUnique({ where: { id: searchParams.edit } });
      if (searchParams.type === "certificate") editingItem = await prisma.certificate.findUnique({ where: { id: searchParams.edit } });
    }
  } catch {
    // DB not synced yet
  }

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-2">Content Manager</h1>
      <p className="text-white/50 mb-10">Add, edit, or remove items from your public portfolio.</p>

      {/* EDIT MODAL */}
      {editingItem && searchParams.type && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <Link href="/admin/content" className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </Link>
            <h2 className="text-2xl font-bold mb-6">Edit {searchParams.type}</h2>
            
            {searchParams.type === "project" && (
              <form action={editProject} className="space-y-4">
                <input type="hidden" name="id" value={editingItem.id} />
                <input name="title" defaultValue={editingItem.title} placeholder="Project Title" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="category" defaultValue={editingItem.category} placeholder="Category" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <textarea name="description" defaultValue={editingItem.description} placeholder="Description" required rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm resize-none" />
                <input name="tags" defaultValue={(editingItem.tags || []).join(", ")} placeholder="Tags (comma separated)" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="link" defaultValue={editingItem.link || ""} placeholder="Live URL (optional)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="github" defaultValue={editingItem.github || ""} placeholder="GitHub URL (optional)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="order" type="number" defaultValue={editingItem.order} placeholder="Display Order" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">Save Changes</button>
              </form>
            )}

            {searchParams.type === "experience" && (
              <form action={editExperience} className="space-y-4">
                <input type="hidden" name="id" value={editingItem.id} />
                <input name="company" defaultValue={editingItem.company} placeholder="Company Name" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="role" defaultValue={editingItem.role} placeholder="Job Title" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <div className="flex gap-4">
                  <input name="startDate" defaultValue={editingItem.startDate} placeholder="Start Date" required className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                  <input name="endDate" defaultValue={editingItem.endDate} placeholder="End Date" required className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                </div>
                <textarea name="description" defaultValue={editingItem.description} placeholder="Job Description (use Enters for bullets)" required rows={6} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm resize-none" />
                <input name="order" type="number" defaultValue={editingItem.order} placeholder="Display Order" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">Save Changes</button>
              </form>
            )}

            {searchParams.type === "certificate" && (
              <form action={editCertificate} className="space-y-4">
                <input type="hidden" name="id" value={editingItem.id} />
                <input name="name" defaultValue={editingItem.name} placeholder="Certificate Name" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="issuer" defaultValue={editingItem.issuer} placeholder="Issuer" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="date" defaultValue={editingItem.date} placeholder="Date Earned" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="url" defaultValue={editingItem.url || ""} placeholder="Credential URL" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="order" type="number" defaultValue={editingItem.order} placeholder="Display Order" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">Save Changes</button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* PROJECTS SECTION */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Projects</h2>
          
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id} className="p-4 border border-white/10 rounded-xl bg-white/5 flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-xs text-white/50">{p.category}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/content?edit=${p.id}&type=project`} className="text-white/50 hover:text-white p-2 transition-colors"><Edit2 className="w-4 h-4" /></Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <form action={addProject} className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-4">
            <h3 className="font-bold text-lg mb-4">Add New Project</h3>
            <input name="title" placeholder="Project Title" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
            <input name="category" placeholder="Category (e.g. Full-Stack SaaS)" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
            <textarea name="description" placeholder="Description" required rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm resize-none" />
            <input name="tags" placeholder="Tags (comma separated e.g. React, Node, Tailwind)" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
            <input name="link" placeholder="Live URL (optional)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
            <input name="order" type="number" defaultValue="0" placeholder="Display Order (0 is first)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">Add Project</button>
          </form>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-12">
          
          {/* EXPERIENCE SECTION */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Experience</h2>
            
            <div className="space-y-4">
              {experience.map(e => (
                <div key={e.id} className="p-4 border border-white/10 rounded-xl bg-white/5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{e.role} @ {e.company}</h3>
                    <p className="text-xs text-white/50">{e.startDate} - {e.endDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/content?edit=${e.id}&type=experience`} className="text-white/50 hover:text-white p-2 transition-colors"><Edit2 className="w-4 h-4" /></Link>
                    <form action={deleteExperience}>
                      <input type="hidden" name="id" value={e.id} />
                      <button type="submit" className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <form action={addExperience} className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-4">
              <h3 className="font-bold text-lg mb-4">Add Experience</h3>
              <input name="company" placeholder="Company Name" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <input name="role" placeholder="Job Title" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <div className="flex gap-4">
                <input name="startDate" placeholder="Start Date (e.g. 2021)" required className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
                <input name="endDate" placeholder="End Date (e.g. Present)" required className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              </div>
              <textarea name="description" placeholder="Job Description" required rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm resize-none" />
              <input name="order" type="number" defaultValue="0" placeholder="Display Order (0 is first)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">Add Experience</button>
            </form>
          </div>

          {/* CERTIFICATES SECTION */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Certificates</h2>
            
            <div className="space-y-4">
              {certificates.map(c => (
                <div key={c.id} className="p-4 border border-white/10 rounded-xl bg-white/5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-xs text-white/50">{c.issuer} • {c.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/content?edit=${c.id}&type=certificate`} className="text-white/50 hover:text-white p-2 transition-colors"><Edit2 className="w-4 h-4" /></Link>
                    <form action={deleteCertificate}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <form action={addCertificate} className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-4">
              <h3 className="font-bold text-lg mb-4">Add Certificate</h3>
              <input name="name" placeholder="Certificate Name" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <input name="issuer" placeholder="Issuer (e.g. Amazon)" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <input name="date" placeholder="Date Earned" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <input name="url" placeholder="Credential URL" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <input name="order" type="number" defaultValue="0" placeholder="Display Order (0 is first)" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm" />
              <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">Add Certificate</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
