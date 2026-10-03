import { prisma } from "@/lib/db";
import { MessageSquare } from "lucide-react";

export default async function ContactsPage() {
  let contacts: Array<{ id: string; name: string; email: string; message: string; createdAt: Date }> = [];
  try {
    contacts = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    // DB not connected yet
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Contact Inbox</h1>
      <p className="text-white/50 mb-10">All inbound messages from your portfolio contact form.</p>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-2xl text-center text-white/30">
          <MessageSquare className="w-10 h-10 mb-3" />
          <p>No messages yet. Share your portfolio to start getting contacts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <a href={`mailto:${c.email}`} className="text-sm text-white/50 hover:text-white transition-colors">{c.email}</a>
                </div>
                <span className="text-xs text-white/30 shrink-0">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{c.message}</p>
              <a href={`mailto:${c.email}?subject=Re: Your message&body=Hi ${c.name},`} className="mt-4 inline-block text-xs border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                Reply via Email
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
