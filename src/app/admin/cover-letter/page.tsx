"use client";
import { useCompletion } from "ai/react";
import { motion } from "framer-motion";
import {
  FileText,
  Copy,
  Loader2,
  Sparkles,
  Bot,
  Download,
  Eye,
  Check,
  Building,
  User,
  Briefcase,
  X,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function CoverLetterBuilder() {
  const [lengthType, setLengthType] = useState<"short" | "normal">("short");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [recipientName, setRecipientName] = useState("Hiring Manager");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [editableBody, setEditableBody] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("edit");
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: "/api/cover-letter",
      body: {
        length: lengthType,
        company,
        role,
        recipientName,
      },
    });

  const outputRef = useRef<HTMLDivElement>(null);

  // Sync completion stream with editable body
  useEffect(() => {
    if (completion) {
      setEditableBody(completion);
    }
  }, [completion]);

  // Auto-scroll output panel
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [completion]);

  const copyToClipboard = () => {
    if (!editableBody) return;
    navigator.clipboard.writeText(editableBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPrintableCoverLetter = (autoPrint: boolean = false) => {
    if (!editableBody) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to open the print-ready cover letter.");
      return;
    }

    const recipient = recipientName.trim() || "Hiring Team";
    const comp = company.trim() || "Prospective Company";
    const r = role.trim() || "Software Engineer";

    let content = editableBody
      .replace(/\{\{\s*company\s*\}\}/gi, comp)
      .replace(/\{\{\s*role\s*\}\}/gi, r)
      .replace(/\{\{\s*recipient_name\s*\}\}/gi, recipient);

    const paragraphs = content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cover Letter – Kidus Amanuel – ${comp}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#111827; --muted:#6B7280; --accent:#1E3A5F; --hair:#E5E7EB;
  --paper:#fff; --bg:#0B1220;
  --serif:"Playfair Display",Georgia,"Times New Roman",serif;
  --sans:Inter,system-ui,-apple-system,sans-serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);font-family:var(--sans);color:var(--ink);font-size:13px;line-height:1.55;-webkit-font-smoothing:antialiased}
.toolbar{max-width:820px;margin:16px auto 0;padding:0 12px;display:flex;justify-content:flex-end}
.btn{font:600 13px var(--sans);background:var(--accent);color:#fff;border:0;border-radius:999px;padding:10px 22px;cursor:pointer}
.btn:hover{opacity:.9}
.paper{max-width:820px;margin:12px auto 32px;background:var(--paper);color:var(--ink);box-shadow:0 10px 30px rgba(0,0,0,.3);border-radius:4px;overflow:hidden}
.bar{height:6px;background:var(--accent)}
.inner{padding:38px 48px 30px}
header .row{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
h1{font:700 38px/1.1 var(--serif);margin:0}
.role{margin-top:6px;font-weight:600;font-size:12.5px;letter-spacing:1px;text-transform:uppercase;color:var(--accent)}
.contact{text-align:right;font-size:12px;color:var(--muted);line-height:1.6}
.contact a{color:var(--accent);text-decoration:none}
.rule{border:0;border-top:1px solid var(--hair);margin:18px 0}
.date{margin:18px 0 14px;color:var(--muted);font-size:12.5px}
.recipient{margin-bottom:18px;font-size:13px;line-height:1.45}
.recipient-name{font-weight:600;color:var(--ink)}
.subject{font-weight:700;font-size:13.5px;color:var(--accent);margin:18px 0 14px;padding-bottom:5px;border-bottom:1px solid var(--hair)}
.salutation{font-weight:600;margin-bottom:14px}
p.paragraph{margin:0 0 14px;line-height:1.6;color:#374151;text-align:justify}
.signoff{margin-top:22px}
.signer-name{font:700 18px var(--serif);color:var(--ink);margin-top:20px}
.signer-title{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-top:2px}
footer.sheet-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:0 48px;padding:12px 0 20px;border-top:.75px solid var(--hair);font-size:10.5px;color:var(--muted)}
footer.sheet-foot span{flex:1}
footer.sheet-foot span:nth-child(2){text-align:center}
footer.sheet-foot span:nth-child(3){text-align:right}
footer.sheet-foot a{color:var(--accent);text-decoration:none}
@page{
  size:A4;margin:14mm 12mm 16mm;
  @bottom-left{content:"Kidus Amanuel · Cover Letter";font:7.5pt Inter,Arial,sans-serif;color:#6B7280}
  @bottom-center{content:"kidus-portfolio-gray.vercel.app";font:7.5pt Inter,Arial,sans-serif;color:#1E3A5F}
  @bottom-right{content:"Page " counter(page) " of " counter(pages);font:7.5pt Inter,Arial,sans-serif;color:#6B7280}
}
@media print{
  html{padding:0}
  body{background:#fff!important;font-size:10pt}
  .toolbar{display:none!important}
  .paper{margin:0!important;max-width:none!important;box-shadow:none!important;border-radius:0}
  .inner{padding:0!important}
  .bar{height:4pt!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  h1{font-size:26pt!important}
  .inner{padding-top:10pt!important}
  footer.sheet-foot{margin:0!important;padding:8px 0 0!important;border-top:.5pt solid #E5E7EB!important}
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
}
</style>
</head>
<body>
<div class="toolbar"><button class="btn" onclick="window.print()">Download PDF / Print</button></div>
<main class="paper">
  <div class="bar"></div>
  <div class="inner">
    <header>
      <div class="row">
        <div>
          <h1>Kidus Amanuel</h1>
          <div class="role">Full-Stack &amp; AI Engineer</div>
        </div>
        <div class="contact">
          <a href="mailto:kidusamanuel@yahoo.com">kidusamanuel@yahoo.com</a><br>
          Addis Ababa, Ethiopia (Open to Remote)<br>
          <a href="https://kidus-portfolio-gray.vercel.app" target="_blank">kidus-portfolio-gray.vercel.app</a> · <a href="https://linkedin.com/in/kidus-amanuel" target="_blank">LinkedIn</a> · <a href="https://github.com/Kidus-Amanuel" target="_blank">GitHub</a>
        </div>
      </div>
      <hr class="rule">
    </header>
    <div class="date">${formattedDate}</div>
    <div class="recipient">
      <div class="recipient-name">${recipient}</div>
      ${recipientTitle ? `<div>${recipientTitle}</div>` : ""}
      <div>${comp}</div>
    </div>
    <div class="subject">RE: Application for ${r}</div>
    <div class="salutation">Dear ${recipient},</div>
    ${paragraphs.map((p) => `<p class="paragraph">${p}</p>`).join("")}
    <div class="signoff">
      <div>Sincerely,</div>
      <div class="signer-name">Kidus Amanuel</div>
      <div class="signer-title">Full-Stack &amp; AI Engineer</div>
    </div>
  </div>
  <footer class="sheet-foot">
    <span>Kidus Amanuel · Cover Letter</span>
    <span><a href="https://kidus-portfolio-gray.vercel.app" target="_blank">kidus-portfolio-gray.vercel.app</a></span>
    <span>Page 1 of 1</span>
  </footer>
</main>
${
  autoPrint
    ? `<script>
  window.addEventListener('load', () => {
    setTimeout(() => { window.print(); }, 400);
  });
</script>`
    : ""
}
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownloadPdf = () => {
    openPrintableCoverLetter(true);
  };

  const handleOpenPdfPreview = () => {
    openPrintableCoverLetter(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-3 mb-1">
            <FileText className="w-6 h-6" /> Cover Letter Studio
          </h1>
          <p className="text-sm text-white/50">
            Generate tailored cover letters with Gemini AI and download matching ATS-compliant PDFs.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenPdfPreview}
            disabled={!editableBody || isDownloading}
            className="inline-flex items-center gap-2 border border-white/20 rounded-xl px-4 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <Eye className="w-4 h-4" /> Live PDF Preview
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={!editableBody || isDownloading}
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl p-[1px] font-medium focus:outline-none disabled:opacity-30"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-xs text-white backdrop-blur-3xl transition-colors hover:bg-white/10 font-semibold">
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Rendering PDF…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PDF
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Recipient & Role Metadata Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 border border-white/10 rounded-2xl bg-white/[0.02]">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-white/40" /> Target Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Stripe, Vercel"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-white/40" /> Target Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-white/40" /> Recipient Name
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Hiring Manager"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
            Recipient Title
          </label>
          <input
            type="text"
            value={recipientTitle}
            onChange={(e) => setRecipientTitle(e.target.value)}
            placeholder="e.g. Head of Engineering"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Main Two-Column Layout: Job Description Input | AI Output & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[560px]">
        {/* Left Column: Job Description & Prompting */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="p-5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Bot className="w-5 h-5" /> Job Description
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Paste the requirements or role posting below
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span className="text-xs uppercase tracking-widest opacity-50">Gemini 2.5</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-[280px] p-5">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Paste the job description or requirements here…&#10;&#10;Tip: You can use placeholders in your prompt or output like {{company}}, {{role}}, or {{recipient_name}}."
                  className="w-full h-full bg-transparent border-0 focus:outline-none resize-none text-sm leading-relaxed text-white placeholder:text-white/20"
                  required
                />
              </div>

              <div className="p-4 bg-black/50 backdrop-blur-md flex flex-col gap-4 border-t border-white/10">
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setLengthType("short")}
                    className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                      lengthType === "short"
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50"
                    }`}
                  >
                    Short (~1000 chars)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLengthType("normal")}
                    className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                      lengthType === "normal"
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50"
                    }`}
                  >
                    Normal (Detailed)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !input}
                  className="w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none disabled:opacity-40"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-sm text-white backdrop-blur-3xl transition-colors hover:bg-white/10 font-semibold">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Tailored Letter…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate with Gemini
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Column: AI Output & Editable Studio */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="p-5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Cover Letter
                </h3>
                <div className="flex bg-white/10 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === "edit" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    Edit Text
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeTab === "preview" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    Clean View
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                )}
                <button
                  onClick={copyToClipboard}
                  disabled={!editableBody}
                  className="text-xs flex items-center gap-1.5 border border-white/20 rounded-full px-3.5 py-1.5 hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editor / Clean View Area */}
            <div ref={outputRef} className="flex-1 min-h-[300px] p-6 overflow-y-auto">
              {activeTab === "edit" ? (
                <textarea
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  placeholder="Your generated cover letter will appear and stream here. You can freely edit any paragraph before downloading the PDF…"
                  className="w-full h-full min-h-[350px] bg-transparent border-0 focus:outline-none resize-none text-sm leading-relaxed text-white/90 placeholder:text-white/20 font-sans"
                />
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                  {editableBody || (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-16">
                      <FileText className="w-12 h-12 mb-4 opacity-50" />
                      <p className="max-w-xs text-sm">
                        Generate a cover letter to view the clean layout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Helper Bar */}
            <div className="p-3 bg-black/50 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-white/40 px-5">
              <span>{editableBody ? `${editableBody.length} characters` : "Ready"}</span>
              <span className="flex gap-2">
                Placeholders: <code className="text-white/70 font-mono">{"{{company}}"}</code>{" "}
                <code className="text-white/70 font-mono">{"{{role}}"}</code>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PDF Live Preview Modal */}
      {isPreviewModalOpen && previewPdfUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#111] border border-white/20 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="font-bold text-sm">Cover Letter PDF Live Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-white/50 hover:text-white p-1.5 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full h-full bg-[#222]">
              <iframe src={previewPdfUrl} className="w-full h-full border-0" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
