"use client";
import { useState } from "react";
import { PlayCircle, PauseCircle, CheckCircle2, Clock, Mail, AlertTriangle, ChevronRight, Activity, Calendar, Hash } from "lucide-react";
import { toggleCampaignStatus } from "../actions";

export function QueueClient({ campaigns = [] }: { campaigns: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaign Queue</h1>
          <p className="text-white/50 text-sm mt-1">Detailed view of all your email campaigns and their delivery status.</p>
        </div>
      </div>

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
              <div key={c.id} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all">
                {/* Header / Summary row */}
                <div 
                  className={`p-6 cursor-pointer hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center gap-6 relative ${isExpanded ? 'bg-white/[0.02]' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  {/* Status Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    c.status === "RUNNING" ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : 
                    c.status === "PAUSED" ? "bg-yellow-500" : 
                    "bg-green-500"
                  }`}></div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold ${
                        c.status === "COMPLETED" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        c.status === "RUNNING" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse" :
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {c.status}
                      </span>
                      <h3 className="font-bold text-lg truncate">{c.template?.name || "Unknown Template"}</h3>
                    </div>
                    <p className="text-sm text-white/50 truncate flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {c.template?.subject || "No subject"}
                    </p>
                  </div>

                  <div className="w-full md:w-64 shrink-0">
                    <div className="flex justify-between items-end mb-2 text-sm">
                      <span className="font-bold">{c.sent} <span className="text-white/40 font-normal">sent</span></span>
                      <span className="text-white/40 text-xs">{c.pending} left</span>
                    </div>
                    <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${c.status === 'RUNNING' ? 'bg-blue-400' : c.status === 'COMPLETED' ? 'bg-green-400' : 'bg-white/30'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {c.status !== "COMPLETED" && (
                      <form action={() => toggleCampaignStatus(c.id, c.status)} onClick={e => e.stopPropagation()}>
                        <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          c.status === "RUNNING" 
                          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20" 
                          : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                        }`}>
                          {c.status === "RUNNING" ? <><PauseCircle className="w-4 h-4" /> Pause</> : <><PlayCircle className="w-4 h-4" /> Resume</>}
                        </button>
                      </form>
                    )}
                    <ChevronRight className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-6 bg-black/20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Delivery Stats */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Delivery Overview</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <p className="text-xs text-white/50 mb-1">Total Audience</p>
                          <p className="text-2xl font-bold">{c.total}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <p className="text-xs text-white/50 mb-1">Successfully Sent</p>
                          <p className="text-2xl font-bold text-green-400">{c.sent}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <p className="text-xs text-white/50 mb-1">Pending Queue</p>
                          <p className="text-2xl font-bold text-blue-400">{c.pending}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <p className="text-xs text-white/50 mb-1">Failed</p>
                          <p className={`text-2xl font-bold ${c.failed > 0 ? 'text-red-400' : 'text-white'}`}>{c.failed}</p>
                        </div>
                      </div>
                    </div>

                    {/* Configuration */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Batch Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-sm text-white/50 flex items-center gap-2"><Hash className="w-4 h-4"/> Emails per batch</span>
                          <span className="font-mono">{c.batchSize}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-sm text-white/50 flex items-center gap-2"><Clock className="w-4 h-4"/> Delay between batches</span>
                          <span className="font-mono">{c.intervalMinutes} mins</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-sm text-white/50 flex items-center gap-2"><Calendar className="w-4 h-4"/> Created At</span>
                          <span className="text-sm text-right">{formatDate(c.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-white/50 flex items-center gap-2"><Activity className="w-4 h-4"/> Next Batch Run</span>
                          <span className={`text-sm text-right font-medium ${c.status === 'RUNNING' ? 'text-blue-400' : 'text-white/30'}`}>
                            {c.status === 'RUNNING' ? formatDate(c.nextRunAt) : 'Paused / Finished'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Errors / Warnings */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">Diagnostics</h4>
                      {c.failed > 0 ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <p className="text-red-400 text-sm font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4" /> {c.failed} Failed Deliveries
                          </p>
                          <p className="text-xs text-red-400/80 leading-relaxed">
                            Some emails bounced or were blocked by the SMTP server. This usually happens if the email address is invalid, or if you hit a hard rate limit. 
                          </p>
                          {/* We could list specific emails here if we fetched them */}
                        </div>
                      ) : (
                        <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 flex flex-col items-center justify-center h-full min-h-[120px] text-center">
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
