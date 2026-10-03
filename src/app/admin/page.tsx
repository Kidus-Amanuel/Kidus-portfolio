import { prisma } from "@/lib/db";
import Link from "next/link";
import { Mail, MessageSquare, Users, Send } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch real counts from Neon DB
  let contactCount = 0;
  let subscriberCount = 0;
  let inviteCount = 0;

  try {
    [contactCount, subscriberCount, inviteCount] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.subscriber.count(),
      prisma.inviteResponse.count(),
    ]);
  } catch {
    // DB not connected yet — show zeros
  }

  const stats = [
    { label: "Contact Messages", value: contactCount, icon: MessageSquare, href: "/admin/contacts" },
    { label: "Subscribers", value: subscriberCount, icon: Users, href: "/admin/subscribers" },
    { label: "Invite Accepts", value: inviteCount, icon: Send, href: "/admin/invites" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-white/50 mb-10">Welcome back, Kidus. Here's what's happening.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
            <div>
              <p className="text-sm text-white/50 mb-1">{s.label}</p>
              <p className="text-4xl font-bold">{s.value}</p>
            </div>
            <s.icon className="w-8 h-8 text-white/20 group-hover:text-white/50 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/emailer" className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Mass Emailer</h3>
            <p className="text-white/50 text-sm">Compose and send promotional emails to all subscribers via Resend.</p>
          </div>
        </Link>
        <Link href="/admin/contacts" className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Contact Inbox</h3>
            <p className="text-white/50 text-sm">View all inbound messages from your portfolio contact form.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
