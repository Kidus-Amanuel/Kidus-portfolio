"use client";
import { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import { getSettings, updateSettings } from "./actions";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    contactEmail: "",
    senderEmail: "",
    githubUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    upworkUrl: "",
  });
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success">("loading");

  useEffect(() => {
    getSettings().then((data) => {
      setFormData(data);
      setStatus("idle");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    await updateSettings(formData);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  };

  if (status === "loading") {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
        <Settings className="w-8 h-8" /> Site Settings
      </h1>
      <p className="text-white/50 mb-12">Manage your contact email, sender email, and social media links across the site.</p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 rounded-3xl p-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Contact Email (Public)</label>
            <input type="email" required value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Sender Email (System)</label>
            <input type="email" required value={formData.senderEmail} onChange={e => setFormData({...formData, senderEmail: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">LinkedIn URL</label>
            <input type="url" value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">GitHub URL</label>
            <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Upwork URL</label>
            <input type="url" value={formData.upworkUrl} onChange={e => setFormData({...formData, upworkUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Instagram URL</label>
            <input type="url" value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button type="submit" disabled={status === "saving"} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
            {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === "success" ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
