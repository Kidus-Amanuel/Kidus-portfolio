"use client";
import { useState, useRef } from "react";
import { Send, Save, Loader2, Code, Eye, Trash2, ChevronRight, PlayCircle, CheckCircle2, List } from "lucide-react";
import { saveTemplate, deleteTemplate, createCampaign } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function EmailerClient({ templates, campaigns = [] }: { templates: any[], campaigns?: any[] }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateName, setTemplateName] = useState("");
  
  // Campaign state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [batchSize, setBatchSize] = useState(50);
  const [intervalMinutes, setIntervalMinutes] = useState(10);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const loadTemplate = (t: any) => {
    setSubject(t.subject);
    setBody(t.html);
    setSelectedTemplateId(t.id);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      alert("Please select and load a saved template first!");
      return;
    }
    
    setStatus("sending");
    try {
      const res = await createCampaign(selectedTemplateId, batchSize, intervalMinutes);
      if (res.error) throw new Error(res.error);
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
      router.refresh();
      router.push("/admin/emailer/queue"); // Auto-redirect to queue
    } catch (err) {
      setStatus("error");
    }
  };

  const activeCount = campaigns.filter(c => c.status === "RUNNING").length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* LEFT: Campaigns & Templates */}
      <div className="xl:col-span-1 space-y-6">
        <div>
          <div className="p-6 border border-white/10 rounded-2xl bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <List className="w-16 h-16" />
            </div>
            <h2 className="font-display font-semibold mb-2">Campaign Queue</h2>
            <p className="text-sm text-white/60 mb-6">You have {activeCount} campaign(s) actively sending right now.</p>
            
            <Link 
              href="/admin/emailer/queue" 
              className="inline-flex items-center justify-center gap-2 w-full border border-white/20 bg-white/5 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/10 transition-colors text-sm text-center"
            >
              <span>View Queue Dashboard</span> <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold mb-4 mt-8">Saved Templates</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-white/40">No saved templates yet.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {templates.map((t) => (
                <div key={t.id} className={`p-4 border ${selectedTemplateId === t.id ? "border-white/50 bg-white/10" : "border-white/10 bg-white/5"} rounded-xl hover:bg-white/10 transition-colors`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-xs text-white/40 truncate mt-0.5">{t.subject}</p>
                    </div>
                    <form action={deleteTemplate}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-red-400/50 hover:text-red-400 transition-colors p-1 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                  <button
                    onClick={() => loadTemplate(t)}
                    className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-medium border border-white/10 rounded-lg py-2 hover:bg-white/20 transition-colors"
                  >
                    Load & Use Template <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Compose area */}
      <div className="xl:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mass Emailer</h1>
            <p className="text-white/50 text-sm mt-1">Select a template and configure batch sizes for safe delivery.</p>
          </div>
          <button
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            <Save className="w-4 h-4" /> Save as New Template
          </button>
        </div>

        {/* Save template form */}
        {showSaveForm && (
          <form
            ref={formRef}
            action={async (fd) => {
              await saveTemplate(fd);
              setShowSaveForm(false);
              setTemplateName("");
            }}
            className="mb-6 p-5 border border-white/10 rounded-2xl bg-white/5 flex gap-3"
          >
            {/* Hidden inputs to pass state to Server Action */}
            <input type="hidden" name="subject" value={subject} />
            <input type="hidden" name="body" value={body} />
            
            <input
              name="templateName"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder='Template name (e.g. "IBM Hackathon Invite")'
              required
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/30"
            />
            <button type="submit" className="bg-white text-black font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
              Save Template
            </button>
          </form>
        )}

        <form onSubmit={handleCreateCampaign} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={!!selectedTemplateId}
              placeholder="e.g. Hey {{name}}, something exciting just shipped!"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-widest opacity-50">Email Template (HTML)</label>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                <button type="button" onClick={() => setViewMode("code")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-colors ${viewMode === "code" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>
                  <Code className="w-4 h-4" /> Code
                </button>
                <button type="button" onClick={() => setViewMode("preview")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-colors ${viewMode === "preview" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>
                  <Eye className="w-4 h-4" /> Preview
                </button>
              </div>
            </div>

            {viewMode === "code" ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                disabled={!!selectedTemplateId}
                rows={16}
                placeholder="Paste your <!DOCTYPE html> template here... Use {{name}} anywhere to personalize!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-white/30 transition-colors resize-y font-mono text-xs disabled:opacity-50"
              />
            ) : (
              <div className="w-full bg-white rounded-xl border border-white/10 overflow-hidden h-[500px]">
                {body.trim() === "" ? (
                  <div className="w-full h-full flex items-center justify-center text-black/40 text-sm">
                    Paste HTML code to see preview
                  </div>
                ) : (
                  <iframe
                    srcDoc={body.replace(/\{\{name\}\}/gi, "Kidus Amanuel").replace(/\{\{email\}\}/gi, "preview@example.com")}
                    className="w-full h-full border-0 bg-white"
                    title="Email Preview"
                  />
                )}
              </div>
            )}
          </div>

          {/* Batch Settings */}
          {selectedTemplateId && (
            <div className="grid grid-cols-2 gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Batch Size (Emails per run)</label>
                <input type="number" min="1" max="500" value={batchSize} onChange={e => setBatchSize(parseInt(e.target.value) || 50)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Interval (Minutes between runs)</label>
                <input type="number" min="1" value={intervalMinutes} onChange={e => setIntervalMinutes(parseInt(e.target.value) || 10)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5" />
              </div>
            </div>
          )}

          {status === "error" && (
            <p className="text-red-400 text-sm">Failed to create campaign. Ensure you have subscribers and haven't already sent this template to them.</p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || !selectedTemplateId}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none disabled:opacity-50 w-full"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
              {!selectedTemplateId 
                ? "Select a Template First to Enable Sending"
                : status === "sending"
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</>
                : status === "success"
                ? <><CheckCircle2 className="w-4 h-4 text-green-400" /> Campaign Scheduled!</>
                : <><PlayCircle className="w-4 h-4" /> Start Campaign Queue</>
              }
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
