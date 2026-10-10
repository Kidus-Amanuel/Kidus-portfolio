"use client";
import { useState } from "react";
import { PlayCircle, PauseCircle, CheckCircle2, Clock, Mail, AlertTriangle, ChevronRight, Activity, Calendar, Hash, Zap, Loader2, RefreshCw } from "lucide-react";
import { toggleCampaignStatus, triggerCronNow } from "../actions";
import { useRouter } from "next/navigation";

export function QueueClient({ campaigns = [] }: { campaigns: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{ ok: boolean; message: string } | null>(null);
  const router = useRouter();

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const handleTrigger = async () => {
    setTriggering(true);
    setTriggerResult(null);
    const result = await triggerCronNow();
    setTriggerResult(result);
    setTriggering(false);
    if (result.ok) {
      setTimeout(() => {
        router.refresh();
        setTriggerResult(null);
      }, 2500);
    }
  };

  const running = campaigns.filter(c => c.status === "RUNNING").length;
  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalPending = campaigns.reduce((a, c) => a + c.pending, 0);
  const totalFailed = campaigns.reduce((a, c) => a + c.failed, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaign Queue</h1>
          <p className="text-white/50 text-sm mt-1">Detailed view of all email campaigns and delivery status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.refresh()} className="flex items-center gap-2 border border-white/10 px-4 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleTrigger}
            disabled={triggering || running === 0}
            className="flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {triggering ? <><Loader2 className="w-4 h-4 animate-spin" /> Running batch...</> : <><Zap className="w-4 h-4" /> Run Batch Now</>}
          </button>
        </div>
      </div>

      {/* Trigger result toast */}
      {triggerResult && (
        <div className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
          triggerResult.ok
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {triggerResult.ok ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          {triggerResult.message}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: running, color: running > 0 ? "text-blue-400" : "text-white" },
          { label: "Total Sent", value: totalSent, color: "text-green-400" },
          { label: "Pending Queue", value: totalPending, color: "text-white" },
          { label: "Total Failed", value: totalFailed, color: totalFailed > 0 ? "text-red-400" : "text-white" },
        ].map(s => (
          <div key={s.label} className="p-5 border border-white/10 rounded-2xl bg-white/5">
            <p className="text-xs text-white/40 mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Campaign List */}
      {campaigns.length === 0 ? (
        <div className="p-12 border border-white/10 rounded-2xl text-center text-white/40 bg-white/5">
          No campaigns found. Start one from the Mass Emailer.
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(c => {
            const isExpanded = expandedId === c.id;
            const progress = c.total > 0 ? (c.sent / c.total) * 100 : 0;

            return (
              <div key={c.id} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                {/* Summary row */}
                <div
                  className={`p-6 cursor-pointer hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center gap-6 relative ${isExpanded ? "bg-white/[0.02]" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  {/* Status bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    c.status === "RUNNING" ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]" :
                    c.status === "PAUSED" ? "bg-yellow-500" : "bg-green-500"
                  }`} />

                  <div className="flex-1 pl-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md font-bold ${
                        c.status === "COMPLETED" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        c.status === "RUNNING" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {c.status}
                      </span>
                      <h3 className="font-bold text-lg truncate">{c.template?.name || "Unknown Template"}</h3>
                    </div>
                    <p className="text-sm text-white/50 truncate flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {c.template?.subject || "No subject"}
                    </p>
                  </div>

                  <div className="w-full md:w-72 shrink-0">
                    <div className="flex justify-between items-end mb-1.5 text-sm">
                      <span><strong>{c.sent}</strong> <span className="text-white/40">sent</span></span>
                      <span className="text-white/40 text-xs">{c.pending} pending · {c.failed} failed</span>
                    </div>
                    <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          c.status === "RUNNING" ? "bg-blue-400" :
                          c.status === "COMPLETED" ? "bg-green-400" : "bg-white/30"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-white/30 mt-1">{Math.round(progress)}% complete</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {c.status !== "COMPLETED" && (
                      <form action={() => toggleCampaignStatus(c.id, c.status)} onClick={e => e.stopPropagation()}>
                        <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          c.status === "RUNNING"
                            ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20"
                            : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20"
                        }`}>
                          {c.status === "RUNNING" ? <><PauseCircle className="w-4 h-4" /> Pause</> : <><PlayCircle className="w-4 h-4" /> Resume</>}
                        </button>
                      </form>
                    )}
                    <ChevronRight className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-6 bg-black/20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Delivery Stats */}
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Delivery Overview</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Total Audience", value: c.total, color: "" },
                          { label: "Successfully Sent", value: c.sent, color: "text-green-400" },
                          { label: "Pending Queue", value: c.pending, color: "text-blue-400" },
                          { label: "Failed", value: c.failed, color: c.failed > 0 ? "text-red-400" : "" },
                        ].map(s => (
                          <div key={s.label} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                            <p className="text-xs text-white/50 mb-1">{s.label}</p>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Config */}
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Batch Settings</h4>
                      <div className="space-y-0.5">
                        {[
                          { icon: Hash, label: "Emails per batch", value: c.batchSize },
                          { icon: Clock, label: "Delay between batches", value: `${c.intervalMinutes} mins` },
                          { icon: Calendar, label: "Created At", value: formatDate(c.createdAt) },
                          {
                            icon: Activity,
                            label: "Next Batch Run",
                            value: c.status === "RUNNING" ? formatDate(c.nextRunAt) : "Paused / Finished",
                            highlight: c.status === "RUNNING",
                          },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                            <span className="text-sm text-white/50 flex items-center gap-2">
                              <row.icon className="w-4 h-4" /> {row.label}
                            </span>
                            <span className={`text-sm font-medium ${row.highlight ? "text-blue-400" : ""}`}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Diagnostics */}
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Diagnostics</h4>
                      {c.failed > 0 ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <p className="text-red-400 text-sm font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4" /> {c.failed} Failed Deliveries
                          </p>
                          <p className="text-xs text-red-400/80 leading-relaxed">
                            Some emails bounced or were blocked. This usually happens due to invalid email addresses or Gmail rate limits. Check the subscriber list for bad emails.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-400/50 mb-2" />
                          <p className="text-sm text-green-400/80 font-medium">No errors detected</p>
                          <p className="text-xs text-green-400/50 mt-1">Delivery is healthy</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
