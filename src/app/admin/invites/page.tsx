import { Send } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type InviteRow = Awaited<ReturnType<typeof prisma.inviteResponse.findMany>>[number];

export default async function InvitesPage() {
  let invites: InviteRow[] = [];

  try {
    invites = await prisma.inviteResponse.findMany({ orderBy: { acceptedAt: "desc" } });
  } catch {
    // DB not connected yet
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Invite Responses</h1>
      <p className="text-white/50 mb-10">Everyone who accepted the invite from the lab game.</p>

      {invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-2xl text-center text-white/30">
          <Send className="w-10 h-10 mb-3" />
          <p>No invite responses yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                <div>
                  <h3 className="font-bold">{invite.friendName}</h3>
                  <p className="text-sm text-white/50">invited by {invite.senderName}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0">
                  {new Date(invite.acceptedAt).toLocaleDateString()}
                </span>
              </div>
              <span className="inline-block mt-1 text-xs uppercase tracking-wider border border-white/15 px-3 py-1.5 rounded-full text-white/60">
                {invite.plan}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
