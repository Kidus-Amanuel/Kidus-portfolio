import Link from "next/link";
import { LayoutDashboard, Mail, MessageSquare, Users, Send, Database } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Content Manager", href: "/admin/content", icon: Database },
  { label: "Mass Emailer", href: "/admin/emailer", icon: Mail },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
  { label: "Invite Responses", href: "/admin/invites", icon: Send },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 shrink-0">
        <Link href="/" className="font-bold text-xl tracking-tighter mb-10 hover:opacity-70 transition-opacity">
          K. <span className="text-white/30 text-sm font-normal tracking-normal">Admin</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <Link href="/" className="text-xs text-white/30 hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
