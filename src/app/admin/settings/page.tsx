"use client";
import { useState, useEffect } from "react";
import { Settings, Save, Loader2, User, FileText } from "lucide-react";
import { getSettings, updateSettings } from "./actions";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    phone: "",
    location: "",
    websiteUrl: "",
    summary: "",
    contactEmail: "",
    senderEmail: "",
    githubUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    upworkUrl: "",
  });
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success">("loading");

  useEffect(() => {
    getSettings().then((data: any) => {
      setFormData({
        fullName: data.fullName || "Kidus Amanuel",
        headline: data.headline || "Full-Stack & AI Engineer",
        phone: data.phone || "+251 900 000 000",
        location: data.location || "Addis Ababa, Ethiopia (Open to Remote)",
        websiteUrl: data.websiteUrl || "https://kidus-portfolio-gray.vercel.app",
        summary:
          data.summary ||
          "Full-stack engineer with 3+ years building scalable SaaS applications and production AI systems.",
        contactEmail: data.contactEmail || "",
        senderEmail: data.senderEmail || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        instagramUrl: data.instagramUrl || "",
        upworkUrl: data.upworkUrl || "",
      });
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
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8" /> Site &amp; CV Settings
        </h1>
        <p className="text-white/50">
          Manage your contact information, social links, and CV header/summary used for dynamic PDF generation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 rounded-3xl p-8">
        {/* CV & Profile Section */}
        <div>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4 text-white/90">
            <User className="w-4 h-4" /> CV Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Full Name (CV Header)
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Headline / Title
              </label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Portfolio / Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                CV Executive Summary
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Section */}
        <div className="pt-6 border-t border-white/10">
          <h2 className="text-base font-bold flex items-center gap-2 mb-4 text-white/90">
            <FileText className="w-4 h-4" /> Contact &amp; Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Contact Email (Public)
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Sender Email (System)
              </label>
              <input
                type="email"
                required
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Upwork URL
              </label>
              <input
                type="url"
                value={formData.upworkUrl}
                onChange={(e) => setFormData({ ...formData, upworkUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={status === "saving"}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === "success" ? "Saved Successfully!" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
