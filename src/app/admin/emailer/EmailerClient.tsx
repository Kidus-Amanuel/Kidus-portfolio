"use client";
import { useState, useRef } from "react";
import { saveTemplate, deleteTemplate } from "./actions";
import { Send, Loader2, CheckCircle, Code, Eye, BookMarked, Save, Trash2, ChevronRight } from "lucide-react";

export function EmailerClient({ templates }: { templates: any[] }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [result, setResult] = useState<{ sent: number } | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const loadTemplate = (t: any) => {
    setSubject(t.subject);
    setBody(t.html);
    setViewMode("code");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Send this email to ALL active subscribers? This cannot be undone.`)) return;
    setStatus("sending");

    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });

    if (res.ok) {
      const data = await res.json();
      setResult(data);
      setStatus("sent");
    } else {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <CheckCircle className="w-16 h-16 mb-4 text-green-400" />
        <h2 className="text-2xl font-bold mb-2">Campaign Sent!</h2>
        <p className="text-white/50">Successfully delivered to <span className="text-white font-bold">{result?.sent}</span> subscribers.</p>
        <button onClick={() => { setStatus("idle"); setSubject(""); setBody(""); }} className="mt-8 border border-white/20 px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors">
          Compose New Email
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

      {/* LEFT: Saved Templates */}
      <div className="xl:col-span-1 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BookMarked className="w-5 h-5" /> Saved Templates
        </h2>

        {templates.length === 0 ? (
          <p className="text-sm text-white/30 italic">No saved templates yet.</p>
        ) : (
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
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
                  className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-medium border border-white/10 rounded-lg py-2 hover:bg-white/10 transition-colors"
                >
                  Load Template <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Variable hints */}
        <div className="p-4 border border-white/10 rounded-xl bg-white/[0.03] space-y-2 mt-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Dynamic Variables</p>
          <p className="text-xs text-white/40">Use these in your HTML template and subject:</p>
          <div className="space-y-1 mt-2">
            <code className="block text-xs bg-white/10 px-2 py-1 rounded text-green-400">{"{{name}}"}</code>
            <p className="text-xs text-white/30 pl-1">→ Subscriber's name (or "there")</p>
            <code className="block text-xs bg-white/10 px-2 py-1 rounded text-blue-400 mt-2">{"{{email}}"}</code>
            <p className="text-xs text-white/30 pl-1">→ Subscriber's email address</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Compose area */}
      <div className="xl:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mass Emailer</h1>
            <p className="text-white/50 text-sm mt-1">Paste or load a template, preview it, then send.</p>
          </div>
          <button
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            <Save className="w-4 h-4" /> Save as Template
          </button>
        </div>

        {/* Save template form (collapsible) */}
        {showSaveForm && (
          <form
            ref={formRef}
            action={async (fd) => {
              fd.set("subject", subject);
              fd.set("body", body);
              await saveTemplate(fd);
              setShowSaveForm(false);
              setTemplateName("");
            }}
            className="mb-6 p-5 border border-white/10 rounded-2xl bg-white/5 flex gap-3"
          >
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

        <form onSubmit={handleSend} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-xs uppercase tracking-widest opacity-50 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder='e.g. Hey {{name}}, something exciting just shipped 🚀'
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Body with code/preview toggle */}
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
                rows={16}
                placeholder="Paste your <!DOCTYPE html> template here... Use {{name}} anywhere to personalize!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-white/30 transition-colors resize-y font-mono text-xs"
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
            <p className="text-xs text-white/30 mt-2">Preview shows <code className="bg-white/10 px-1 rounded">{"{{name}}"}</code> replaced with a sample name.</p>
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm">Something went wrong. Check your GMAIL_USER and GMAIL_APP_PASSWORD in .env</p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || !body.trim() || !subject.trim()}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none disabled:opacity-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
              {status === "sending"
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending Campaign...</>
                : <><Send className="w-4 h-4" /> Send to All Subscribers</>
              }
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
