import { prisma } from "@/lib/db";
import Link from "next/link";
import { Mail, MessageSquare, Users, Send, Database, FileText, Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch real counts from Neon DB
  let contactCount = 0;
  let activeSubs = 0;
  let totalSubs = 0;
  let inviteCount = 0;
  let runningCampaigns = 0;
  let totalSentEmails = 0;

  try {
    const [contact, subs, invite, campaigns, deliveries] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.subscriber.findMany(),
      prisma.inviteResponse.count(),
      prisma.emailCampaign.count({ where: { status: "RUNNING" } }),
      prisma.emailDelivery.count({ where: { status: "SENT" } }),
    ]);
    
    contactCount = contact;
    totalSubs = subs.length;
    activeSubs = subs.filter(s => s.status === "active").length;
    inviteCount = invite;
    runningCampaigns = campaigns;
    totalSentEmails = deliveries;
  } catch {
    // DB not connected yet
  }

  const stats = [
    { label: "Total Subscribers", value: totalSubs, sub: \\ active\, icon: Users, href: "/admin/subscribers" },
    { label: "Emails Sent", value: totalSentEmails, sub: "All time", icon: Mail, href: "/admin/emailer" },
    { label: "Contact Messages", value: contactCount, sub: "From portfolio", icon: MessageSquare, href: "/admin/contacts" },
    { label: "Invite Accepts", value: inviteCount, sub: "Yes responses", icon: Send, href: "/admin/invites" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-white/50">Welcome back, Kidus. Here's what's happening today.</p>
        </div>
        {runningCampaigns > 0 && (
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/20">
            <Activity className="w-4 h-4 animate-pulse" />
            {runningCampaigns} Active Campaign{runningCampaigns > 1 ? "s" : ""} Running
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <s.icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-white/50 mb-1">{s.label}</p>
              <p className="text-4xl font-bold mb-1">{s.value}</p>
              <p className="text-xs text-white/40">{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/emailer" className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Mass Emailer</h3>
            <p className="text-white/50 text-sm leading-relaxed">Compose and schedule batched email campaigns to your subscribers.</p>
          </div>
        </Link>
        <Link href="/admin/cover-letter" className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Cover Letter AI</h3>
            <p className="text-white/50 text-sm leading-relaxed">Generate personalized cover letters using Gemini AI and your CMS data.</p>
          </div>
        </Link>
        <Link href="/admin/content" className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Content Manager</h3>
            <p className="text-white/50 text-sm leading-relaxed">Manage your projects, experience, and certificates displayed on the site.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
