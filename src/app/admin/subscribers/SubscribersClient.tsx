"use client";
import { useState, useRef, useTransition } from "react";
import { addSubscriber, deleteSubscriber, toggleSubscriberStatus, importSubscribers } from "./actions";
import { Trash2, UserCheck, UserX, Upload, Users, CheckCircle, XCircle } from "lucide-react";

export function SubscribersClient({ subscribers }: { subscribers: any[] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // ---- CSV Parsing ----
  const parseCSV = (text: string): { name?: string; email: string }[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [];

    // Detect header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes("email") || firstLine.includes("name");
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const headerCols = hasHeader
      ? firstLine.split(",").map(c => c.trim().replace(/"/g, ""))
      : null;

    return dataLines
      .map(line => {
        const cols = line.split(",").map(c => c.trim().replace(/"/g, ""));
        if (!cols.length) return null;

        if (headerCols) {
          const emailIdx = headerCols.findIndex(h => h === "email");
          const nameIdx = headerCols.findIndex(h => h === "name");
          const email = emailIdx >= 0 ? cols[emailIdx] : cols[0];
          const name = nameIdx >= 0 ? cols[nameIdx] : undefined;
          return { email, name };
        } else {
          // No header: assume col0=email or col0=name, col1=email
          if (cols.length === 1) return { email: cols[0] };
          // if col0 looks like an email, it's email; otherwise name, email
          if (cols[0].includes("@")) return { email: cols[0] };
          return { name: cols[0], email: cols[1] };
        }
      })
      .filter(Boolean) as { name?: string; email: string }[];
  };

  const handleFile = async (file: File) => {
    if (!file || !file.name.endsWith(".csv")) {
      alert("Please upload a .csv file");
      return;
    }
    setIsImporting(true);
    setImportResult(null);
    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) {
      alert("No valid rows found in the CSV.");
      setIsImporting(false);
      return;
    }
    const result = await importSubscribers(rows);
    setImportResult(result);
    setIsImporting(false);
    startTransition(() => {});
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const activeCount = subscribers.filter(s => s.status === "active").length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

      {/* LEFT: Add manually + CSV upload */}
      <div className="space-y-8 xl:col-span-1">

        {/* Manual add */}
        <div className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5" /> Add Subscriber</h2>
          <form action={addSubscriber} className="space-y-3">
            <input
              name="name"
              placeholder="Full Name (optional)"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-white/30"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Add to List
            </button>
          </form>
        </div>

        {/* CSV Drag & Drop */}
        <div className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Upload className="w-5 h-5" /> Bulk Import CSV</h2>
          <p className="text-xs text-white/40">CSV format: <code className="bg-white/10 px-1 rounded">name,email</code> or just <code className="bg-white/10 px-1 rounded">email</code> — header row optional.</p>

          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
              ${isDragging ? "border-white bg-white/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            <Upload className="w-8 h-8 mx-auto mb-3 opacity-40" />
            {isImporting ? (
              <p className="text-sm text-white/60">Importing…</p>
            ) : (
              <>
                <p className="text-sm font-medium">Drag & drop a CSV here</p>
                <p className="text-xs text-white/40 mt-1">or click to browse</p>
              </>
            )}
          </div>

          {importResult && (
            <div className="text-sm space-y-1 pt-1">
              <p className="flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4" /> {importResult.imported} subscribers imported</p>
              {importResult.skipped > 0 && (
                <p className="flex items-center gap-2 text-yellow-400"><XCircle className="w-4 h-4" /> {importResult.skipped} rows skipped (invalid email)</p>
              )}
            </div>
          )}
        </div>

        {/* Stats box */}
        <div className="p-6 border border-white/10 rounded-2xl bg-white/5 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{activeCount}</p>
            <p className="text-xs text-white/50 mt-1">Active</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{subscribers.length - activeCount}</p>
            <p className="text-xs text-white/50 mt-1">Unsubscribed</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Subscriber list */}
      <div className="xl:col-span-2 space-y-3">
        <h2 className="text-lg font-bold mb-4">All Subscribers ({subscribers.length})</h2>

        {subscribers.length === 0 ? (
          <div className="p-12 border border-white/10 rounded-2xl text-center text-white/30">
            No subscribers yet. Add one manually or import a CSV.
          </div>
        ) : (
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {subscribers.map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{s.name || <span className="text-white/30 italic">No name</span>}</p>
                  <p className="text-xs text-white/50 truncate">{s.email}</p>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {s.status}
                  </span>

                  {/* Toggle active/unsubscribed */}
                  <form action={toggleSubscriberStatus}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="status" value={s.status} />
                    <button type="submit" title={s.status === "active" ? "Unsubscribe" : "Reactivate"} className="p-2 text-white/40 hover:text-white transition-colors">
                      {s.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </form>

                  {/* Delete */}
                  <form action={deleteSubscriber}>
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit" className="p-2 text-red-400/60 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
